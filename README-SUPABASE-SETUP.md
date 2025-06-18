# Supabase Database Setup Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

## Step 2: Create Database Schema

Copy and paste the following SQL into the SQL Editor and click **"Run"**:

```sql
-- Copy the entire content from supabase/migrations/create_clinic_schema.sql
```

## Step 3: Insert Sample Data

After the schema is created successfully, run this second query to add sample data:

```sql
-- Copy the entire content from supabase/migrations/seed_sample_data.sql
```

## Step 4: Set Environment Variables

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Verify Setup

After running both queries, you should see:
- ✅ 5 tables created (patients, doctors, appointments, medical_records, invoices)
- ✅ 5 doctors inserted
- ✅ 5 patients inserted  
- ✅ 3+ appointments inserted
- ✅ Sample medical records and invoices

## Step 6: Test the Application

Once the database is set up, your clinic management application will be fully functional with:
- Patient management
- Doctor management
- Appointment scheduling
- Medical records
- Billing system
- Dashboard with real statistics

## Authentication Note

The application uses Supabase's built-in authentication. You can sign up new users directly in the app, and they'll be stored in Supabase's auth system automatically.

## Default Demo Credentials

For testing purposes, you can use:
- **Email**: admin@admin.com
- **Password**: Admin

Or create a new account using the sign-up form.

## Next Steps

After completing the database setup:
1. Refresh your application
2. Try signing up a new user or use the demo credentials
3. Explore all the features of your clinic management system!

## Features Available

- **Dashboard**: Real-time statistics from your database
- **Patient Management**: Add, edit, view, and delete patients
- **Doctor Management**: Manage doctor profiles and specializations
- **Appointment Scheduling**: Schedule and track appointments with status updates
- **Medical Records**: Maintain patient medical history (basic implementation)
- **Billing System**: Generate and track invoices (basic implementation)
- **Authentication**: Secure login/signup with Supabase Auth
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Troubleshooting

If you encounter any issues:

1. **Database Connection**: Ensure your environment variables are correct
2. **Authentication**: Make sure Supabase Auth is enabled in your project settings
3. **RLS Policies**: Verify that Row Level Security policies are properly set up
4. **CORS**: Check that your domain is added to the allowed origins in Supabase settings

For additional support, check the Supabase documentation or the application logs in your browser's developer console.