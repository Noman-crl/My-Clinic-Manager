import React, { useState, useEffect } from 'react';
import { Doctor, DoctorSchedule } from '../../types';

interface DoctorFormProps {
  doctor?: Doctor;
  onSave: (doctorData: Partial<Doctor>) => void;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Doctor>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    licenseNumber: '',
    experience: 0,
    consultationFee: 0,
    schedule: [],
  });

  useEffect(() => {
    if (doctor) {
      setFormData(doctor);
    }
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleScheduleChange = (day: string, field: keyof DoctorSchedule, value: string | boolean) => {
    setFormData((prev) => {
      const schedule = [...(prev.schedule || [])];
      const dayIndex = schedule.findIndex((s) => s.day === day);

      if (dayIndex === -1) {
        schedule.push({
          day,
          startTime: '',
          endTime: '',
          isAvailable: true,
          [field]: value,
        });
      } else {
        schedule[dayIndex] = {
          ...schedule[dayIndex],
          [field]: value,
        };
      }

      return {
        ...prev,
        schedule,
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {doctor ? 'Edit Doctor' : 'Add New Doctor'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              id="specialization"
              value={formData.specialization}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
              License Number
            </label>
            <input
              type="text"
              name="licenseNumber"
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
              Years of Experience
            </label>
            <input
              type="number"
              name="experience"
              id="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">
              Consultation Fee
            </label>
            <input
              type="number"
              name="consultationFee"
              id="consultationFee"
              value={formData.consultationFee}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
          <div className="space-y-4">
            {days.map((day) => {
              const schedule = formData.schedule?.find((s) => s.day === day) || {
                day,
                startTime: '',
                endTime: '',
                isAvailable: false,
              };

              return (
                <div key={day} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      {day}
                    </label>
                    <div className="mt-1 flex space-x-2">
                      <input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => handleScheduleChange(day, 'startTime', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="flex items-center text-gray-500">to</span>
                      <input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => handleScheduleChange(day, 'endTime', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.isAvailable}
                      onChange={(e) => handleScheduleChange(day, 'isAvailable', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Available</label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {doctor ? 'Update Doctor' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm; 