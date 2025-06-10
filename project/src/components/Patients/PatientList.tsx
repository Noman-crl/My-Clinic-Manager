import React, { useState } from 'react';
import { Search, Plus, Edit, Eye, Trash2, Phone, Mail } from 'lucide-react';
import { mockPatients } from '../../data/mockData';
import { Patient } from '../../types';

interface PatientListProps {
  onAddPatient: () => void;
  onEditPatient: (patient: Patient) => void;
}

const PatientList: React.FC<PatientListProps> = ({ onAddPatient, onEditPatient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState<Patient[]>(mockPatients);

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <button
          onClick={onAddPatient}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insurance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {patient.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {patient.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateAge(patient.dateOfBirth)} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900">{patient.gender}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.insuranceNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => onEditPatient(patient)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No patients found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default PatientList;