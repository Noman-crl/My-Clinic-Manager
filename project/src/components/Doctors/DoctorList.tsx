import React from 'react';
import { useClinicStore } from '../../store';
import { Doctor } from '../../types';

interface DoctorListProps {
  onAddDoctor: () => void;
  onEditDoctor: (doctorId: string) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({ onAddDoctor, onEditDoctor }) => {
  const { doctors, deleteDoctor } = useClinicStore();

  const handleDeleteDoctor = (doctorId: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      deleteDoctor(doctorId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Doctors</h1>
        <button
          onClick={onAddDoctor}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add Doctor
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      License: {doctor.licenseNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.specialization}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.email}</div>
                    <div className="text-sm text-gray-500">{doctor.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doctor.experience} years</div>
                    <div className="text-sm text-gray-500">
                      Fee: ${doctor.consultationFee}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEditDoctor(doctor.id)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;