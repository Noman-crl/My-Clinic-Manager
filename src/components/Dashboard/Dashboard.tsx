import React from 'react';
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { mockPatients, mockDoctors, mockAppointments, mockInvoices } from '../../data/mockData';
import { Appointment, Patient, Doctor } from '../../types';

const StatCard = ({ title, value, icon: Icon, change, changeType }: {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change?: string;
  changeType?: 'positive' | 'negative';
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        {change && (
          <p className={`text-sm mt-2 flex items-center ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {change}
          </p>
        )}
      </div>
      <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const stats = {
    totalPatients: 150,
    totalDoctors: 12,
    todayAppointments: 8,
    pendingAppointments: 15,
  };

  const recentAppointments: Appointment[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: '2024-03-20',
      time: '09:00',
      status: 'scheduled',
      reason: 'Regular Checkup',
      createdAt: '2024-03-19',
    },
    // Add more mock appointments as needed
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalPatients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Doctors</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.totalDoctors}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Today's Appointments</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.todayAppointments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending Appointments</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{stats.pendingAppointments}</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Appointments</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentAppointments.map((appointment) => (
            <div key={appointment.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Appointment #{appointment.id}
                  </p>
                  <p className="text-sm text-gray-500">
                    {appointment.date} at {appointment.time}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;