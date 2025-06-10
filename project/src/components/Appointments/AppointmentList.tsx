import React, { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, User, UserCheck } from 'lucide-react';
import { mockAppointments, mockPatients, mockDoctors } from '../../data/mockData';
import { Appointment } from '../../types';

interface AppointmentListProps {
  onAddAppointment: () => void;
}

export default function AppointmentList({ onAddAppointment }: AppointmentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [appointments] = useState(mockAppointments);

  const filteredAppointments = appointments.filter(appointment => {
    const patient = mockPatients.find(p => p.id === appointment.patientId);
    const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
    
    const matchesSearch = patient && doctor && (
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <button
          onClick={onAddAppointment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Appointment</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments by patient, doctor, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const patient = mockPatients.find(p => p.id === appointment.patientId);
                const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
                
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {appointment.time}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">
                          {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor?.specialization}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{appointment.reason}</div>
                      {appointment.notes && (
                        <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No appointments found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}