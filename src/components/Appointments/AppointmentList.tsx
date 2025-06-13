import React, { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, User, UserCheck } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentListProps {
  onAddAppointment: () => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ onAddAppointment }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // TODO: Fetch appointments from API

  if (appointments.length === 0) return <div>No appointments found.</div>;

  return (
    <div>
      {/* Render appointment list here */}
    </div>
  );
};

export default AppointmentList;