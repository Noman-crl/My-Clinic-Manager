/*
  # Fix Row Level Security Policies

  1. Problem
    - Current RLS policies are too restrictive
    - Blocking authenticated users from creating/updating records
    - Need to allow all operations for authenticated users

  2. Solution
    - Drop existing restrictive policies
    - Create new permissive policies for authenticated users
    - Ensure all CRUD operations work for logged-in users

  3. Security
    - Maintain RLS enabled for security
    - Allow authenticated users full access to clinic data
    - Block anonymous access completely
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON patients;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON doctors;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON appointments;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON medical_records;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON invoices;

-- Create comprehensive policies for patients table
CREATE POLICY "Allow authenticated users to view patients" ON patients
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert patients" ON patients
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update patients" ON patients
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete patients" ON patients
  FOR DELETE TO authenticated USING (true);

-- Create comprehensive policies for doctors table
CREATE POLICY "Allow authenticated users to view doctors" ON doctors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert doctors" ON doctors
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update doctors" ON doctors
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete doctors" ON doctors
  FOR DELETE TO authenticated USING (true);

-- Create comprehensive policies for appointments table
CREATE POLICY "Allow authenticated users to view appointments" ON appointments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert appointments" ON appointments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update appointments" ON appointments
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete appointments" ON appointments
  FOR DELETE TO authenticated USING (true);

-- Create comprehensive policies for medical_records table
CREATE POLICY "Allow authenticated users to view medical_records" ON medical_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert medical_records" ON medical_records
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update medical_records" ON medical_records
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete medical_records" ON medical_records
  FOR DELETE TO authenticated USING (true);

-- Create comprehensive policies for invoices table
CREATE POLICY "Allow authenticated users to view invoices" ON invoices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to insert invoices" ON invoices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update invoices" ON invoices
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete invoices" ON invoices
  FOR DELETE TO authenticated USING (true);

-- Verify RLS is still enabled (should already be enabled)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;