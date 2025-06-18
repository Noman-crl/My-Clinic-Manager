-- Insert sample doctors
INSERT INTO doctors (first_name, last_name, email, phone, specialization, license_number, experience, consultation_fee) VALUES
('John', 'Smith', 'john.smith@clinic.com', '+1-555-0101', 'Cardiology', 'MD001', 15, 200.00),
('Sarah', 'Johnson', 'sarah.johnson@clinic.com', '+1-555-0102', 'Pediatrics', 'MD002', 12, 180.00),
('Michael', 'Brown', 'michael.brown@clinic.com', '+1-555-0103', 'Orthopedics', 'MD003', 18, 250.00),
('Emily', 'Davis', 'emily.davis@clinic.com', '+1-555-0104', 'Dermatology', 'MD004', 8, 160.00),
('Robert', 'Wilson', 'robert.wilson@clinic.com', '+1-555-0105', 'Neurology', 'MD005', 20, 300.00)
ON CONFLICT (email) DO NOTHING;

-- Insert sample patients
INSERT INTO patients (first_name, last_name, email, phone, date_of_birth, gender, address, emergency_contact, emergency_phone, insurance_number) VALUES
('Alice', 'Brown', 'alice.brown@email.com', '+1-555-0201', '1985-03-15', 'female', '123 Main St, New York, NY 10001', 'Bob Brown', '+1-555-0202', 'INS001'),
('Michael', 'Davis', 'michael.davis@email.com', '+1-555-0203', '1978-07-22', 'male', '456 Oak Ave, Los Angeles, CA 90001', 'Lisa Davis', '+1-555-0204', 'INS002'),
('Emma', 'Thompson', 'emma.thompson@email.com', '+1-555-0205', '2010-12-08', 'female', '789 Pine St, Chicago, IL 60601', 'James Thompson', '+1-555-0206', 'INS003'),
('David', 'Miller', 'david.miller@email.com', '+1-555-0207', '1992-05-30', 'male', '321 Elm St, Houston, TX 77001', 'Susan Miller', '+1-555-0208', 'INS004'),
('Sophie', 'Anderson', 'sophie.anderson@email.com', '+1-555-0209', '1988-11-12', 'female', '654 Maple Ave, Phoenix, AZ 85001', 'Mark Anderson', '+1-555-0210', 'INS005')
ON CONFLICT (email) DO NOTHING;

-- Insert sample appointments (only if both patient and doctor exist)
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE + INTERVAL '1 day' as appointment_date,
    '10:00' as appointment_time,
    'Regular checkup' as reason,
    'scheduled' as status
FROM patients p, doctors d 
WHERE p.email = 'alice.brown@email.com' AND d.email = 'john.smith@clinic.com'
AND NOT EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.patient_id = p.id AND a.doctor_id = d.id 
    AND a.appointment_date = CURRENT_DATE + INTERVAL '1 day'
    AND a.appointment_time = '10:00'
);

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE + INTERVAL '2 days' as appointment_date,
    '14:00' as appointment_time,
    'Knee pain consultation' as reason,
    'scheduled' as status
FROM patients p, doctors d 
WHERE p.email = 'michael.davis@email.com' AND d.email = 'michael.brown@clinic.com'
AND NOT EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.patient_id = p.id AND a.doctor_id = d.id 
    AND a.appointment_date = CURRENT_DATE + INTERVAL '2 days'
    AND a.appointment_time = '14:00'
);

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE + INTERVAL '3 days' as appointment_date,
    '09:30' as appointment_time,
    'Pediatric checkup' as reason,
    'scheduled' as status
FROM patients p, doctors d 
WHERE p.email = 'emma.thompson@email.com' AND d.email = 'sarah.johnson@clinic.com'
AND NOT EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.patient_id = p.id AND a.doctor_id = d.id 
    AND a.appointment_date = CURRENT_DATE + INTERVAL '3 days'
    AND a.appointment_time = '09:30'
);

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE + INTERVAL '4 days' as appointment_date,
    '11:00' as appointment_time,
    'Skin condition' as reason,
    'scheduled' as status
FROM patients p, doctors d 
WHERE p.email = 'david.miller@email.com' AND d.email = 'emily.davis@clinic.com'
AND NOT EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.patient_id = p.id AND a.doctor_id = d.id 
    AND a.appointment_date = CURRENT_DATE + INTERVAL '4 days'
    AND a.appointment_time = '11:00'
);

INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE + INTERVAL '5 days' as appointment_date,
    '15:30' as appointment_time,
    'Headache consultation' as reason,
    'scheduled' as status
FROM patients p, doctors d 
WHERE p.email = 'sophie.anderson@email.com' AND d.email = 'robert.wilson@clinic.com'
AND NOT EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.patient_id = p.id AND a.doctor_id = d.id 
    AND a.appointment_date = CURRENT_DATE + INTERVAL '5 days'
    AND a.appointment_time = '15:30'
);

-- Insert sample medical records
INSERT INTO medical_records (patient_id, doctor_id, visit_date, chief_complaint, diagnosis, treatment, medications, notes)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE - INTERVAL '7 days' as visit_date,
    'Chest pain and shortness of breath' as chief_complaint,
    'Mild hypertension' as diagnosis,
    'Lifestyle modifications and medication' as treatment,
    '[{"name": "Lisinopril", "dosage": "10mg", "frequency": "Once daily", "duration": "30 days"}]'::jsonb as medications,
    'Patient advised to monitor blood pressure daily and follow up in 2 weeks' as notes
FROM patients p, doctors d 
WHERE p.email = 'alice.brown@email.com' AND d.email = 'john.smith@clinic.com'
AND NOT EXISTS (
    SELECT 1 FROM medical_records mr 
    WHERE mr.patient_id = p.id AND mr.doctor_id = d.id 
    AND mr.visit_date = CURRENT_DATE - INTERVAL '7 days'
);

-- Insert sample invoices
INSERT INTO invoices (patient_id, doctor_id, issue_date, due_date, items, subtotal, tax_amount, total_amount, status)
SELECT 
    p.id as patient_id,
    d.id as doctor_id,
    CURRENT_DATE as issue_date,
    CURRENT_DATE + INTERVAL '30 days' as due_date,
    '[{"description": "Consultation Fee", "quantity": 1, "unit_price": 200.00, "total": 200.00}, {"description": "ECG Test", "quantity": 1, "unit_price": 50.00, "total": 50.00}]'::jsonb as items,
    250.00 as subtotal,
    20.00 as tax_amount,
    270.00 as total_amount,
    'sent' as status
FROM patients p, doctors d 
WHERE p.email = 'alice.brown@email.com' AND d.email = 'john.smith@clinic.com'
AND NOT EXISTS (
    SELECT 1 FROM invoices i 
    WHERE i.patient_id = p.id AND i.doctor_id = d.id 
    AND i.issue_date = CURRENT_DATE
);