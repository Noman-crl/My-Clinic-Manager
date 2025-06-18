#!/bin/bash

# Clinic Management System Deployment Script
# Usage: ./deploy.sh

set -e

echo "🏥 Starting Clinic Management System Deployment..."

# Configuration
SERVER_IP="103.161.145.180"
SERVER_USER="unni"
APP_NAME="clinic-management"
DOMAIN="clinic.yourdomain.com"  # Change this to your domain
DB_NAME="clinic_management"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we can connect to the server
echo "🔍 Checking server connection..."
if ssh -o ConnectTimeout=10 ${SERVER_USER}@${SERVER_IP} "echo 'Connection successful'" > /dev/null 2>&1; then
    print_status "Server connection established"
else
    print_error "Cannot connect to server. Please check your SSH configuration."
    exit 1
fi

# Create deployment directory structure
echo "📁 Setting up directory structure..."
ssh ${SERVER_USER}@${SERVER_IP} "
    sudo mkdir -p /var/www/${APP_NAME}
    sudo mkdir -p /var/www/${APP_NAME}/backend
    sudo mkdir -p /var/www/${APP_NAME}/frontend
    sudo mkdir -p /var/www/${APP_NAME}/logs
    sudo chown -R ${SERVER_USER}:${SERVER_USER} /var/www/${APP_NAME}
"
print_status "Directory structure created"

# Install system dependencies
echo "📦 Installing system dependencies..."
ssh ${SERVER_USER}@${SERVER_IP} "
    sudo apt update
    sudo apt install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates lsb-release
    
    # Install Node.js 18.x
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
    fi
    
    # Install MongoDB
    if ! command -v mongod &> /dev/null; then
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        echo 'deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse' | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        sudo apt update
        sudo apt install -y mongodb-org
        sudo systemctl start mongod
        sudo systemctl enable mongod
    fi
    
    # Install Nginx
    if ! command -v nginx &> /dev/null; then
        sudo apt install -y nginx
        sudo systemctl start nginx
        sudo systemctl enable nginx
    fi
    
    # Install PM2 globally
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
"
print_status "System dependencies installed"

# Upload backend files
echo "📤 Uploading backend files..."
rsync -avz --delete ./server/ ${SERVER_USER}@${SERVER_IP}:/var/www/${APP_NAME}/backend/
print_status "Backend files uploaded"

# Upload frontend build
echo "🏗️ Building and uploading frontend..."
npm run build
rsync -avz --delete ./dist/ ${SERVER_USER}@${SERVER_IP}:/var/www/${APP_NAME}/frontend/
print_status "Frontend files uploaded"

# Install backend dependencies and setup
echo "⚙️ Setting up backend..."
ssh ${SERVER_USER}@${SERVER_IP} "
    cd /var/www/${APP_NAME}/backend
    npm install --production
    
    # Create .env file
    cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/${DB_NAME}
JWT_SECRET=$(openssl rand -base64 32)
PORT=5000
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
EOF
    
    # Create uploads directory
    mkdir -p uploads
    chmod 755 uploads
"
print_status "Backend setup completed"

# Setup PM2 ecosystem
echo "🔄 Setting up PM2 process manager..."
ssh ${SERVER_USER}@${SERVER_IP} "
    cd /var/www/${APP_NAME}/backend
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: '${APP_NAME}-backend',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '../logs/backend-error.log',
    out_file: '../logs/backend-out.log',
    log_file: '../logs/backend-combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max_old_space_size=1024'
  }]
};
EOF
    
    # Start the application with PM2
    pm2 delete ${APP_NAME}-backend 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup | grep -E '^sudo' | bash || true
"
print_status "PM2 setup completed"

# Setup Nginx configuration
echo "🌐 Configuring Nginx..."
ssh ${SERVER_USER}@${SERVER_IP} "
    sudo tee /etc/nginx/sites-available/${APP_NAME} > /dev/null << 'EOF'
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN} ${SERVER_IP};
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection \"1; mode=block\";
    add_header Referrer-Policy \"strict-origin-when-cross-origin\";
    
    # Frontend
    location / {
        root /var/www/${APP_NAME}/frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control \"public, immutable\";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # File uploads
    client_max_body_size 10M;
    
    # Logs
    access_log /var/log/nginx/${APP_NAME}_access.log;
    error_log /var/log/nginx/${APP_NAME}_error.log;
}
EOF
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl reload nginx
"
print_status "Nginx configuration completed"

# Setup SSL with Let's Encrypt (optional)
echo "🔒 Setting up SSL certificate..."
ssh ${SERVER_USER}@${SERVER_IP} "
    if ! command -v certbot &> /dev/null; then
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # Only run certbot if domain is not localhost/IP
    if [[ '${DOMAIN}' != *'localhost'* ]] && [[ '${DOMAIN}' != *'${SERVER_IP}'* ]]; then
        sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} || true
    fi
"
print_status "SSL setup completed"

# Setup database and seed data
echo "🗄️ Setting up database..."
ssh ${SERVER_USER}@${SERVER_IP} "
    cd /var/www/${APP_NAME}/backend
    
    # Wait for MongoDB to be ready
    sleep 5
    
    # Seed initial data
    npm run seed || echo 'Seeding completed or skipped'
"
print_status "Database setup completed"

# Setup log rotation
echo "📋 Setting up log rotation..."
ssh ${SERVER_USER}@${SERVER_IP} "
    sudo tee /etc/logrotate.d/${APP_NAME} > /dev/null << 'EOF'
/var/www/${APP_NAME}/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ${SERVER_USER} ${SERVER_USER}
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
"
print_status "Log rotation setup completed"

# Setup firewall
echo "🔥 Configuring firewall..."
ssh ${SERVER_USER}@${SERVER_IP} "
    sudo ufw --force enable
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 27017  # MongoDB (restrict this in production)
    sudo ufw status
"
print_status "Firewall configured"

# Final checks
echo "🔍 Running final checks..."
ssh ${SERVER_USER}@${SERVER_IP} "
    # Check if services are running
    sudo systemctl is-active --quiet mongod && echo 'MongoDB: Running' || echo 'MongoDB: Not running'
    sudo systemctl is-active --quiet nginx && echo 'Nginx: Running' || echo 'Nginx: Not running'
    pm2 list | grep -q ${APP_NAME}-backend && echo 'Backend: Running' || echo 'Backend: Not running'
    
    # Check if ports are listening
    netstat -tlnp | grep :80 && echo 'Port 80: Open' || echo 'Port 80: Closed'
    netstat -tlnp | grep :5000 && echo 'Port 5000: Open' || echo 'Port 5000: Closed'
    netstat -tlnp | grep :27017 && echo 'Port 27017: Open' || echo 'Port 27017: Closed'
"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Deployment Summary:"
echo "   Server: ${SERVER_USER}@${SERVER_IP}"
echo "   Application: ${APP_NAME}"
echo "   Frontend: http://${SERVER_IP}"
echo "   Backend API: http://${SERVER_IP}/api"
echo "   Database: MongoDB on port 27017"
echo ""
echo "🔐 Default Admin Credentials:"
echo "   Email: admin@admin.com"
echo "   Password: Admin"
echo ""
echo "📝 Important Notes:"
echo "   1. Change the default admin password immediately"
echo "   2. Configure email settings in /var/www/${APP_NAME}/backend/.env"
echo "   3. Set up regular database backups"
echo "   4. Monitor logs in /var/www/${APP_NAME}/logs/"
echo "   5. Update your domain DNS to point to ${SERVER_IP}"
echo ""
echo "🛠️ Useful Commands:"
echo "   View logs: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 logs ${APP_NAME}-backend'"
echo "   Restart app: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 restart ${APP_NAME}-backend'"
echo "   Check status: ssh ${SERVER_USER}@${SERVER_IP} 'pm2 status'"
echo ""

print_status "Deployment script completed!"