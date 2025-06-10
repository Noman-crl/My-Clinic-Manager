import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Download, Filter } from 'lucide-react';
import { mockPatients, mockAppointments, mockInvoices, mockDoctors } from '../../data/mockData';

export default function Reports() {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Calculate statistics
  const totalPatients = mockPatients.length;
  const totalDoctors = mockDoctors.length;
  const totalAppointments = mockAppointments.length;
  const completedAppointments = mockAppointments.filter(apt => apt.status === 'completed').length;
  const totalRevenue = mockInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);

  const appointmentsByStatus = {
    scheduled: mockAppointments.filter(apt => apt.status === 'scheduled').length,
    completed: mockAppointments.filter(apt => apt.status === 'completed').length,
    cancelled: mockAppointments.filter(apt => apt.status === 'cancelled').length,
    'no-show': mockAppointments.filter(apt => apt.status === 'no-show').length
  };

  const doctorPerformance = mockDoctors.map(doctor => {
    const doctorAppointments = mockAppointments.filter(apt => apt.doctorId === doctor.id);
    const completedCount = doctorAppointments.filter(apt => apt.status === 'completed').length;
    const revenue = mockInvoices
      .filter(inv => inv.status === 'paid')
      .filter(inv => mockAppointments.find(apt => apt.id === inv.appointmentId && apt.doctorId === doctor.id))
      .reduce((sum, inv) => sum + inv.total, 0);
    
    return {
      doctor: `${doctor.firstName} ${doctor.lastName}`,
      specialization: doctor.specialization,
      appointments: doctorAppointments.length,
      completed: completedCount,
      revenue
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-blue-600">{totalPatients}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-green-600">{totalAppointments}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {totalAppointments > 0 ? Math.round((completedAppointments / totalAppointments) * 100) : 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-orange-600">${totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Appointment Status</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {Object.entries(appointmentsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${totalAppointments > 0 ? (count / totalAppointments) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Performance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Doctor Performance</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {doctorPerformance.map((performance, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{performance.doctor}</p>
                    <p className="text-xs text-gray-500">{performance.specialization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${performance.revenue.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{performance.completed}/{performance.appointments} completed</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-green-600"
                    style={{ width: `${performance.appointments > 0 ? (performance.completed / performance.appointments) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Patient Growth</h3>
            <p className="text-2xl font-bold text-blue-600">+12%</p>
            <p className="text-sm text-blue-700">vs last month</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Revenue Growth</h3>
            <p className="text-2xl font-bold text-green-600">+8%</p>
            <p className="text-sm text-green-700">vs last month</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900">Efficiency Rate</h3>
            <p className="text-2xl font-bold text-purple-600">94%</p>
            <p className="text-sm text-purple-700">appointment completion</p>
          </div>
        </div>
      </div>
    </div>
  );
}