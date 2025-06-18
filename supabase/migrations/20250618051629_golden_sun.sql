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