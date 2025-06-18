import React, { useState } from 'react';
import { FileText, Search, Plus, Eye, User, UserCheck, Calendar } from 'lucide-react';

// Mock data for demo
const mockPatients = [
  { id: '1', firstName: 'Alice', lastName: 'Brown' },
  { id: '2', firstName: 'Michael', lastName: 'Davis' },
  { id: '3', firstName: 'Emma', lastName: 'Thompson' },
];

const mockDoctors = [
  { id: '1', firstName: 'John', lastName: 'Smith', specialization: 'Cardiology' },
  { id: '2', firstName: 'Sarah', lastName: 'Johnson', specialization: 'Pediatrics' },
  { id: '3', firstName: 'Michael', lastName: 'Brown', specialization: 'Orthopedics' },
];

const mockRecords = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    visitDate: '2025-01-15',
    chiefComplaint: 'Chest pain and shortness of breath',
    diagnosis: 'Mild hypertension',
    treatment: 'Lifestyle modifications and medication',
  },
  {
    id: '2',
    patientId: '2',
    doctorId: '3',
    visitDate: '2025-01-14',
    chiefComplaint: 'Knee pain after exercise',
    diagnosis: 'Minor ligament strain',
    treatment: 'Rest, ice, and physical therapy',
  },
  {
    id: '3',
    patientId: '3',
    doctorId: '2',
    visitDate: '2025-01-13',
    chiefComplaint: 'Routine pediatric checkup',
    diagnosis: 'Healthy development',
    treatment: 'Continue regular checkups',
  },
];

export default function MedicalRecordsList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = mockRecords.filter(record => {
    const patient = mockPatients.find(p => p.id === record.patientId);
    const doctor = mockDoctors.find(d => d.id === record.doctorId);
    
    return (
      (patient && `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doctor && `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search medical records by patient, doctor, diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chief Complaint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const patient = mockPatients.find(p => p.id === record.patientId);
                const doctor = mockDoctors.find(d => d.id === record.doctorId);
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
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
                            {doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {doctor?.specialization || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="text-sm text-gray-900">
                          {new Date(record.visitDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {record.chiefComplaint}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {record.diagnosis}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No medical records found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}