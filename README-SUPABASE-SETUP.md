# Supabase Database Setup Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard/project/oizuvelumphmjedakdwy)
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

## Step 2: Create Database Schema

Copy and paste the following SQL into the SQL Editor and click **"Run"**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')) NOT NULL,
    address TEXT NOT NULL,
    emergency_contact VARCHAR(100) NOT NULL,
    emergency_phone VARCHAR(20) NOT NULL,
    insurance_number VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doctors table
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    experience INTEGER NOT NULL CHECK (experience >= 0),
    consultation_fee DECIMAL(10,2) NOT NULL CHECK (consultation_fee >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30 CHECK (duration > 0),
    reason TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show')) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medical_records table
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    visit_date DATE NOT NULL DEFAULT CURRENT_DATE,
    chief_complaint TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    treatment TEXT NOT NULL,
    medications JSONB DEFAULT '[]',
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) CHECK (status IN ('draft', 'sent', 'paid', 'partially-paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_patients_name ON patients(first_name, last_name);
CREATE INDEX idx_doctors_email ON doctors(email);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_visit_date ON medical_records(visit_date);
CREATE INDEX idx_invoices_patient ON invoices(patient_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number := 'INV-' || LPAD((SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1 FROM invoices WHERE invoice_number ~ '^INV-[0-9]+$')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for invoice number generation
CREATE TRIGGER generate_invoice_number_trigger BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();

-- Enable Row Level Security on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON patients FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON doctors FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON medical_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON invoices FOR ALL TO authenticated USING (true);
```

## Step 3: Insert Sample Data

After the schema is created successfully, run this second query to add sample data:

```sql
-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, email, phone, specialization, license_number, experience, consultation_fee) VALUES
('John', 'Smith', 'john.smith@clinic.com', '+1-555-0101', 'Cardiology', 'MD001', 15, 200.00),
('Sarah', 'Johnson', 'sarah.johnson@clinic.com', '+1-555-0102', 'Pediatrics', 'MD002', 12, 180.00),
('Michael', 'Brown', 'michael.brown@clinic.com', '+1-555-0103', 'Orthopedics', 'MD003', 18, 250.00),
('Emily', 'Davis', 'emily.davis@clinic.com', '+1-555-0104', 'Dermatology', 'MD004', 8, 160.00),
('Robert', 'Wilson', 'robert.wilson@clinic.com', '+1-555-0105', 'Neurology', 'MD005', 20, 300.00);

-- Insert sample patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address, emergency_contact, emergency_phone, insurance_number) VALUES
('Alice', 'Brown', 'alice.brown@email.com', '+1-555-0201', '1985-03-15', 'female', '123 Main St, New York, NY 10001', 'Bob Brown', '+1-555-0202', 'INS001'),
('Michael', 'Davis', 'michael.davis@email.com', '+1-555-0203', '1978-07-22', 'male', '456 Oak Ave, Los Angeles, CA 90001', 'Lisa Davis', '+1-555-0204', 'INS002'),
('Emma', 'Thompson', 'emma.thompson@email.com', '+1-555-0205', '2010-12-08', 'female', '789 Pine St, Chicago, IL 60601', 'James Thompson', '+1-555-0206', 'INS003'),
('David', 'Miller', 'david.miller@email.com', '+1-555-0207', '1992-05-30', 'male', '321 Elm St, Houston, TX 77001', 'Susan Miller', '+1-555-0208', 'INS004'),
('Sophie', 'Anderson', 'sophie.anderson@email.com', '+1-555-0209', '1988-11-12', 'female', '654 Maple Ave, Phoenix, AZ 85001', 'Mark Anderson', '+1-555-0210', 'INS005');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
((SELECT id FROM patients WHERE email = 'alice.brown@email.com'), (SELECT id FROM doctors WHERE email = 'john.smith@clinic.com'), CURRENT_DATE + INTERVAL '1 day', '10:00', 'Regular checkup', 'scheduled'),
((SELECT id FROM patients WHERE email = 'michael.davis@email.com'), (SELECT id FROM doctors WHERE email = 'michael.brown@clinic.com'), CURRENT_DATE + INTERVAL '2 days', '14:00', 'Knee pain consultation', 'scheduled'),
((SELECT id FROM patients WHERE email = 'emma.thompson@email.com'), (SELECT id FROM doctors WHERE email = 'sarah.johnson@clinic.com'), CURRENT_DATE + INTERVAL '3 days', '09:30', 'Pediatric checkup', 'scheduled'),
((SELECT id FROM patients WHERE email = 'david.miller@email.com'), (SELECT id FROM doctors WHERE email = 'emily.davis@clinic.com'), CURRENT_DATE + INTERVAL '4 days', '11:00', 'Skin condition', 'scheduled'),
((SELECT id FROM patients WHERE email = 'sophie.anderson@email.com'), (SELECT id FROM doctors WHERE email = 'robert.wilson@clinic.com'), CURRENT_DATE + INTERVAL '5 days', '15:30', 'Headache consultation', 'scheduled');
```

## Step 4: Verify Setup

After running both queries, you should see:
- ✅ 5 tables created (patients, doctors, appointments, medical_records, invoices)
- ✅ 5 doctors inserted
- ✅ 5 patients inserted  
- ✅ 5 appointments inserted

## Step 5: Test the Application

Once the database is set up, your clinic management application will be fully functional with:
- Patient management
- Doctor management
- Appointment scheduling
- Medical records
- Billing system
- Dashboard with statistics

## Authentication Note

The application uses Supabase's built-in authentication. You can sign up new users directly in the app, and they'll be stored in Supabase's auth system automatically.

## Next Steps

After completing the database setup:
1. Refresh your application
2. Try signing up a new user or use the test credentials
3. Explore all the features of your clinic management system!