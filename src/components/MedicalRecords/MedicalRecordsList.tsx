import React, { useState } from 'react';
import { FileText, Search, Plus, Eye, User, UserCheck, Calendar } from 'lucide-react';
import { mockMedicalRecords, mockPatients, mockDoctors } from '../../data/mockData';

export default function MedicalRecordsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [records] = useState(mockMedicalRecords);

  const filteredRecords = records.filter(record => {
    const patient = mockPatients.find(p => p.id === record.patientId);
    const doctor = mockDoctors.find(d => d.id === record.doctorId);
    
    return patient && doctor && (
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Search medical records by patient, doctor, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Medical Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const patient = mockPatients.find(p => p.id === record.patientId);
          const doctor = mockDoctors.find(d => d.id === record.doctorId);
          
          return (
            <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{record.diagnosis}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                      </div>
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-1" />
                        {doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor'}
                      </div>
                    </div>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Treatment</h4>
                  <p className="text-sm text-gray-700">{record.treatment}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-700">{record.notes}</p>
                </div>
              </div>

              {record.medications.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Medications</h4>
                  <div className="flex flex-wrap gap-2">
                    {record.medications.map((medication, index) => (
                      <span
                        key={index}
                        className="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"
                      >
                        {medication.name} - {medication.dosage}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {record.followUpDate && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Follow-up scheduled for {new Date(record.followUpDate).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No medical records found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
}