-- Insert default user roles and permissions
INSERT INTO users (auth_user_id, first_name, last_name, email, role, permissions) 
SELECT 
    auth.uid(),
    'System',
    'Admin',
    'admin@clinic.com',
    'admin',
    '{"all": true}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@clinic.com');

-- Insert default chart of accounts (Indian accounting structure)
INSERT INTO accounts (account_code, account_name, account_type, opening_balance) VALUES
-- Assets
('1000', 'Current Assets', 'asset', 0),
('1100', 'Cash in Hand', 'asset', 50000),
('1200', 'Bank Account - Current', 'asset', 500000),
('1300', 'Accounts Receivable', 'asset', 0),
('1400', 'Medicine Inventory', 'asset', 200000),
('1500', 'Medical Equipment', 'asset', 1000000),
('1600', 'Furniture & Fixtures', 'asset', 150000),
('1700', 'Prepaid Expenses', 'asset', 25000),

-- Liabilities
('2000', 'Current Liabilities', 'liability', 0),
('2100', 'Accounts Payable', 'liability', 0),
('2200', 'GST Payable', 'liability', 0),
('2300', 'TDS Payable', 'liability', 0),
('2400', 'Salary Payable', 'liability', 0),
('2500', 'Loan Payable', 'liability', 0),

-- Equity
('3000', 'Owner Equity', 'equity', 1500000),
('3100', 'Retained Earnings', 'equity', 0),

-- Income
('4000', 'Consultation Income', 'income', 0),
('4100', 'Pharmacy Sales', 'income', 0),
('4200', 'Diagnostic Income', 'income', 0),
('4300', 'Other Income', 'income', 0),

-- Expenses
('5000', 'Medicine Purchase', 'expense', 0),
('5100', 'Staff Salary', 'expense', 0),
('5200', 'Rent Expense', 'expense', 0),
('5300', 'Electricity Expense', 'expense', 0),
('5400', 'Telephone Expense', 'expense', 0),
('5500', 'Medical Equipment Expense', 'expense', 0),
('5600', 'Marketing Expense', 'expense', 0),
('5700', 'Professional Fees', 'expense', 0),
('5800', 'Insurance Expense', 'expense', 0),
('5900', 'Depreciation Expense', 'expense', 0)
ON CONFLICT (account_code) DO NOTHING;

-- Insert default tax settings (Indian GST rates)
INSERT INTO tax_settings (tax_name, tax_type, tax_rate) VALUES
('GST 0%', 'gst', 0.00),
('GST 5%', 'gst', 5.00),
('GST 12%', 'gst', 12.00),
('GST 18%', 'gst', 18.00),
('GST 28%', 'gst', 28.00),
('TDS 1%', 'tds', 1.00),
('TDS 2%', 'tds', 2.00),
('TDS 10%', 'tds', 10.00)
ON CONFLICT DO NOTHING;

-- Insert sample suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, gstin, pan, payment_terms) VALUES
('MediCorp Pharmaceuticals', 'Rajesh Kumar', 'rajesh@medicorp.com', '+91-9876543210', 'Plot 123, Industrial Area, Mumbai, Maharashtra 400001', '27ABCDE1234F1Z5', 'ABCDE1234F', 30),
('HealthPlus Distributors', 'Priya Sharma', 'priya@healthplus.com', '+91-9876543211', '45, Medical Complex, Delhi 110001', '07FGHIJ5678G2Y6', 'FGHIJ5678G', 15),
('Wellness Pharma Ltd', 'Amit Patel', 'amit@wellnesspharma.com', '+91-9876543212', 'B-67, Pharma Park, Ahmedabad, Gujarat 380001', '24KLMNO9012H3X7', 'KLMNO9012H', 45),
('Care Medical Supplies', 'Sunita Reddy', 'sunita@caremedical.com', '+91-9876543213', '12-A, Medical Street, Hyderabad, Telangana 500001', '36PQRST3456I4W8', 'PQRST3456I', 30),
('Prime Healthcare Dist', 'Vikram Singh', 'vikram@primehealthcare.com', '+91-9876543214', '78, Healthcare Avenue, Bangalore, Karnataka 560001', '29UVWXY7890J5V9', 'UVWXY7890J', 20)
ON CONFLICT (email) DO NOTHING;

-- Insert sample medicines
INSERT INTO medicines (name, generic_name, manufacturer, category, unit, strength, form, purchase_price, selling_price, mrp, stock_quantity, minimum_stock, hsn_code, gst_rate, is_prescription_required) VALUES
('Paracetamol 500mg', 'Paracetamol', 'ABC Pharma', 'Analgesic', 'tablet', '500mg', 'tablet', 2.50, 3.50, 4.00, 500, 50, '3004', 12.00, false),
('Amoxicillin 250mg', 'Amoxicillin', 'XYZ Pharma', 'Antibiotic', 'capsule', '250mg', 'capsule', 8.00, 12.00, 15.00, 200, 20, '3004', 12.00, true),
('Cetirizine 10mg', 'Cetirizine', 'DEF Pharma', 'Antihistamine', 'tablet', '10mg', 'tablet', 1.80, 2.50, 3.00, 300, 30, '3004', 12.00, false),
('Omeprazole 20mg', 'Omeprazole', 'GHI Pharma', 'Antacid', 'capsule', '20mg', 'capsule', 4.50, 6.50, 8.00, 150, 15, '3004', 12.00, true),
('Cough Syrup 100ml', 'Dextromethorphan', 'JKL Pharma', 'Cough Suppressant', 'bottle', '100ml', 'syrup', 45.00, 65.00, 75.00, 80, 10, '3004', 12.00, false),
('Vitamin D3 60K', 'Cholecalciferol', 'MNO Pharma', 'Vitamin', 'capsule', '60000 IU', 'capsule', 15.00, 22.00, 25.00, 100, 10, '3004', 12.00, true),
('Insulin Injection', 'Human Insulin', 'PQR Pharma', 'Antidiabetic', 'vial', '100 IU/ml', 'injection', 180.00, 250.00, 280.00, 50, 5, '3004', 5.00, true),
('Blood Pressure Monitor', 'Digital BP Monitor', 'STU Medical', 'Medical Device', 'piece', 'Standard', 'device', 1200.00, 1800.00, 2000.00, 25, 5, '9018', 18.00, false),
('Thermometer Digital', 'Digital Thermometer', 'VWX Medical', 'Medical Device', 'piece', 'Standard', 'device', 150.00, 220.00, 250.00, 40, 10, '9025', 18.00, false),
('Face Mask N95', 'N95 Respirator', 'YZA Safety', 'PPE', 'piece', 'Standard', 'mask', 25.00, 40.00, 45.00, 1000, 100, '6307', 12.00, false)
ON CONFLICT DO NOTHING;

-- Update invoice amounts to Indian Rupees (multiply by 83 for approximate conversion)
UPDATE invoices SET 
    subtotal = subtotal * 83,
    tax_amount = tax_amount * 83,
    total_amount = total_amount * 83
WHERE total_amount < 1000; -- Only update if not already converted

-- Update doctor consultation fees to Indian Rupees
UPDATE doctors SET 
    consultation_fee = consultation_fee * 83
WHERE consultation_fee < 1000; -- Only update if not already converted