# Clinic Management System Deployment Guide

This guide will help you deploy the Clinic Management System to your Ubuntu server.

## Prerequisites

- Ubuntu 20.04+ server with root/sudo access
- SSH access to the server
- Domain name (optional, can use IP address)
- At least 2GB RAM and 20GB storage

## Quick Deployment

1. **Make the deployment script executable:**
   ```bash
   chmod +x deployment/deploy.sh
   ```

2. **Edit the deployment script configuration:**
   Open `deployment/deploy.sh` and update these variables:
   ```bash
   SERVER_IP="103.161.145.180"
   SERVER_USER="unni"
   DOMAIN="clinic.yourdomain.com"  # Change to your domain or use IP
   ```

3. **Run the deployment:**
   ```bash
   ./deployment/deploy.sh
   ```

## Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

### 1. Server Setup

```bash
# Connect to your server
ssh unni@103.161.145.180

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/clinic-management
sudo chown -R unni:unni /var/www/clinic-management

# Upload backend files
rsync -avz ./server/ unni@103.161.145.180:/var/www/clinic-management/backend/

# Build and upload frontend
npm run build
rsync -avz ./dist/ unni@103.161.145.180:/var/www/clinic-management/frontend/
```

### 3. Backend Configuration

```bash
# SSH to server
ssh unni@103.161.145.180

# Navigate to backend directory
cd /var/www/clinic-management/backend

# Install dependencies
npm install --production

# Create environment file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/clinic_management
JWT_SECRET=$(openssl rand -base64 32)
PORT=5000
NODE_ENV=production
EOF

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'clinic-backend',
    script: 'index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx Configuration

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/clinic-management << EOF
server {
    listen 80;
    server_name 103.161.145.180;
    
    location / {
        root /var/www/clinic-management/frontend;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
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
    }
    
    client_max_body_size 10M;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/clinic-management /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Database Setup

```bash
# Seed initial data
cd /var/www/clinic-management/backend
npm run seed
```

### 6. Firewall Configuration

```bash
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
```

## Post-Deployment

### Default Admin Credentials
- **Email:** admin@admin.com
- **Password:** Admin

**⚠️ Important: Change these credentials immediately after first login!**

### Useful Commands

```bash
# View application logs
pm2 logs clinic-backend

# Restart application
pm2 restart clinic-backend

# Check application status
pm2 status

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check MongoDB status
sudo systemctl status mongod

# MongoDB shell
mongosh
```

### Backup Strategy

```bash
# Create backup script
cat > /home/unni/backup-clinic.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
mongodump --db clinic_management --out /home/unni/backups/\$DATE
tar -czf /home/unni/backups/clinic_backup_\$DATE.tar.gz /home/unni/backups/\$DATE
rm -rf /home/unni/backups/\$DATE
find /home/unni/backups -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x /home/unni/backup-clinic.sh

# Add to crontab for daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * /home/unni/backup-clinic.sh") | crontab -
```

### SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com
```

### Monitoring

```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor system resources
htop

# Monitor disk usage
df -h

# Monitor MongoDB
mongosh --eval "db.stats()"
```

## Troubleshooting

### Common Issues

1. **Application not starting:**
   ```bash
   pm2 logs clinic-backend
   ```

2. **Database connection issues:**
   ```bash
   sudo systemctl status mongod
   mongosh
   ```

3. **Nginx configuration errors:**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **Port conflicts:**
   ```bash
   netstat -tlnp | grep :5000
   netstat -tlnp | grep :80
   ```

### Performance Optimization

1. **Enable Nginx gzip compression:**
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   ```

2. **MongoDB optimization:**
   ```bash
   # Edit MongoDB configuration
   sudo nano /etc/mongod.conf
   
   # Add these settings for better performance
   storage:
     wiredTiger:
       engineConfig:
         cacheSizeGB: 1
   ```

3. **PM2 optimization:**
   ```javascript
   // In ecosystem.config.js
   max_memory_restart: '1G',
   node_args: '--max_old_space_size=1024'
   ```

## Security Checklist

- [ ] Change default admin password
- [ ] Configure firewall (UFW)
- [ ] Set up SSL certificate
- [ ] Regular security updates
- [ ] Database access restrictions
- [ ] Regular backups
- [ ] Monitor logs for suspicious activity
- [ ] Use strong JWT secrets
- [ ] Implement rate limiting (optional)

## Support

If you encounter any issues during deployment, check:

1. Server logs: `pm2 logs clinic-backend`
2. Nginx logs: `/var/log/nginx/error.log`
3. MongoDB logs: `/var/log/mongodb/mongod.log`
4. System resources: `htop`, `df -h`

For additional support, ensure all prerequisites are met and follow the troubleshooting steps above.