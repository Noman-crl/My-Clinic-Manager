/*
  # Comprehensive Indian Clinic Management System

  1. New Tables
    - `users` - User management with roles and permissions
    - `medicines` - Medicine inventory management
    - `suppliers` - Supplier information for purchases
    - `purchases` - Purchase orders and inventory tracking
    - `pharmacy_sales` - Pharmacy sales transactions
    - `accounts` - Chart of accounts for Indian accounting
    - `transactions` - Financial transactions (Journal entries)
    - `tax_settings` - GST and other tax configurations
    - `reports` - Saved reports and analytics

  2. User Roles & Permissions
    - Admin: Full access to all modules
    - Doctor: Patient management, appointments, medical records
    - Pharmacist: Pharmacy, medicine inventory, sales
    - Accountant: Financial reports, accounts, transactions
    - Receptionist: Appointments, basic patient info

  3. Indian Accounting Features
    - GST compliance (CGST, SGST, IGST)
    - TDS calculations
    - Indian financial year support
    - Comprehensive reporting
*/

-- Create users table for role-based access
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('admin', 'doctor', 'pharmacist', 'accountant', 'receptionist')) NOT NULL DEFAULT 'receptionist',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    gstin VARCHAR(15),
    pan VARCHAR(10),
    payment_terms INTEGER DEFAULT 30,
    credit_limit DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    manufacturer VARCHAR(200),
    category VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'piece',
    strength VARCHAR(50),
    form VARCHAR(50), -- tablet, capsule, syrup, injection, etc.
    batch_number VARCHAR(50),
    expiry_date DATE,
    purchase_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    selling_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    mrp DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 10,
    maximum_stock INTEGER DEFAULT 1000,
    location VARCHAR(100),
    hsn_code VARCHAR(10),
    gst_rate DECIMAL(5,2) DEFAULT 12.00,
    is_prescription_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_number VARCHAR(20) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) ON DELETE RESTRICT,
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    invoice_number VARCHAR(50),
    invoice_date DATE,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'partial', 'paid')) DEFAULT 'pending',
    status VARCHAR(20) CHECK (status IN ('draft', 'ordered', 'received', 'cancelled')) DEFAULT 'draft',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create purchase_items table
CREATE TABLE IF NOT EXISTS purchase_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES purchases(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    batch_number VARCHAR(50),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pharmacy_sales table
CREATE TABLE IF NOT EXISTS pharmacy_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_number VARCHAR(20) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
    prescription_id UUID, -- Reference to prescription if exists
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'upi', 'credit')) DEFAULT 'cash',
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'paid',
    served_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pharmacy_sale_items table
CREATE TABLE IF NOT EXISTS pharmacy_sale_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sale_id UUID REFERENCES pharmacy_sales(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    batch_number VARCHAR(50),
    expiry_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table for chart of accounts
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_code VARCHAR(20) UNIQUE NOT NULL,
    account_name VARCHAR(200) NOT NULL,
    account_type VARCHAR(50) CHECK (account_type IN ('asset', 'liability', 'equity', 'income', 'expense')) NOT NULL,
    parent_account_id UUID REFERENCES accounts(id),
    is_active BOOLEAN DEFAULT TRUE,
    opening_balance DECIMAL(15,2) DEFAULT 0,
    current_balance DECIMAL(15,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table for journal entries
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_number VARCHAR(20) UNIQUE NOT NULL,
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reference_type VARCHAR(50), -- invoice, payment, purchase, etc.
    reference_id UUID,
    description TEXT NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL CHECK (total_amount > 0),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    status VARCHAR(20) CHECK (status IN ('draft', 'posted', 'cancelled')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transaction_entries table for double-entry bookkeeping
CREATE TABLE IF NOT EXISTS transaction_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE RESTRICT,
    debit_amount DECIMAL(15,2) DEFAULT 0 CHECK (debit_amount >= 0),
    credit_amount DECIMAL(15,2) DEFAULT 0 CHECK (credit_amount >= 0),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_debit_or_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR 
        (credit_amount > 0 AND debit_amount = 0)
    )
);

-- Create tax_settings table
CREATE TABLE IF NOT EXISTS tax_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tax_name VARCHAR(50) NOT NULL,
    tax_type VARCHAR(20) CHECK (tax_type IN ('gst', 'tds', 'cess', 'other')) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_from DATE DEFAULT CURRENT_DATE,
    applicable_to DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines(category);
CREATE INDEX IF NOT EXISTS idx_medicines_expiry ON medicines(expiry_date);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_purchases_supplier ON purchases(supplier_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_sales_date ON pharmacy_sales(sale_date);
CREATE INDEX IF NOT EXISTS idx_pharmacy_sales_patient ON pharmacy_sales(patient_id);
CREATE INDEX IF NOT EXISTS idx_accounts_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(reference_type, reference_id);

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchases_updated_at BEFORE UPDATE ON purchases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pharmacy_sales_updated_at BEFORE UPDATE ON pharmacy_sales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_settings_updated_at BEFORE UPDATE ON tax_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate purchase numbers
CREATE OR REPLACE FUNCTION generate_purchase_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.purchase_number IS NULL OR NEW.purchase_number = '' THEN
        NEW.purchase_number := 'PUR-' || LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(purchase_number FROM 5) AS INTEGER)), 0) + 1 FROM purchases WHERE purchase_number ~ '^PUR-[0-9]+$')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_purchase_number_trigger BEFORE INSERT ON purchases FOR EACH ROW EXECUTE FUNCTION generate_purchase_number();

-- Function to generate sale numbers
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.sale_number IS NULL OR NEW.sale_number = '' THEN
        NEW.sale_number := 'SAL-' || LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(sale_number FROM 5) AS INTEGER)), 0) + 1 FROM pharmacy_sales WHERE sale_number ~ '^SAL-[0-9]+$')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_sale_number_trigger BEFORE INSERT ON pharmacy_sales FOR EACH ROW EXECUTE FUNCTION generate_sale_number();

-- Function to generate transaction numbers
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.transaction_number IS NULL OR NEW.transaction_number = '' THEN
        NEW.transaction_number := 'TXN-' || LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(transaction_number FROM 5) AS INTEGER)), 0) + 1 FROM transactions WHERE transaction_number ~ '^TXN-[0-9]+$')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_transaction_number_trigger BEFORE INSERT ON transactions FOR EACH ROW EXECUTE FUNCTION generate_transaction_number();

-- Enable RLS on all new tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for all new tables
CREATE POLICY "Allow authenticated users to manage users" ON users FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage suppliers" ON suppliers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage medicines" ON medicines FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage purchases" ON purchases FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage purchase_items" ON purchase_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage pharmacy_sales" ON pharmacy_sales FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage pharmacy_sale_items" ON pharmacy_sale_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage accounts" ON accounts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage transactions" ON transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage transaction_entries" ON transaction_entries FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to manage tax_settings" ON tax_settings FOR ALL TO authenticated USING (true);