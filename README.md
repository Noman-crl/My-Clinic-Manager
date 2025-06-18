# Ultimate Clinic Management System

A modern, responsive clinic management application built with React, TypeScript, and Material-UI.

## Features

- **Patient Management** - Add, edit, and manage patient records
- **Doctor Management** - Manage doctor profiles and specializations
- **Appointment Scheduling** - Schedule and track appointments
- **Medical Records** - Maintain patient medical history
- **Billing System** - Generate and manage invoices
- **Reports & Analytics** - View clinic performance metrics
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18, TypeScript, Material-UI
- **Styling**: Tailwind CSS, Material-UI components
- **Icons**: Lucide React, Material-UI Icons
- **Routing**: React Router DOM
- **Forms**: Formik with Yup validation
- **Build Tool**: Vite

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## Demo Credentials

- **Email**: admin@admin.com
- **Password**: Admin

## Project Structure

```
src/
├── components/          # React components
│   ├── Appointments/    # Appointment management
│   ├── Billing/         # Billing and invoices
│   ├── Dashboard/       # Main dashboard
│   ├── Doctors/         # Doctor management
│   ├── Layout/          # Layout components
│   ├── MedicalRecords/  # Medical records
│   └── Patients/        # Patient management
├── pages/               # Page components
├── App.tsx              # Main app component with auth
└── main.tsx             # App entry point
```

## Features Overview

### Dashboard
- Quick overview of clinic statistics
- Clickable cards for navigation
- Real-time metrics display

### Patient Management
- Add new patients with detailed information
- Search and filter patient records
- View patient demographics and contact info

### Doctor Management
- Manage doctor profiles and specializations
- Track experience and consultation fees
- Active/inactive status management

### Appointment Scheduling
- Schedule appointments with date/time selection
- Status tracking (scheduled, confirmed, completed, etc.)
- Search and filter appointments

### Medical Records
- Maintain comprehensive patient medical history
- Link records to appointments and doctors
- Search by patient, doctor, or diagnosis

### Billing System
- Generate invoices for appointments
- Track payment status
- Revenue analytics and reporting

### Reports & Analytics
- Daily, weekly, and monthly reports
- Revenue analysis and trends
- Appointment completion rates

## Development

- **Lint code**: `npm run lint`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## License

MIT License - feel free to use this project for your clinic management needs!