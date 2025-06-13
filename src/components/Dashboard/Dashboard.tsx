import React from 'react';
import { Users, UserCheck, Calendar, DollarSign, TrendingUp, Activity } from 'lucide-react';

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

export default function Dashboard() {
  // TODO: Fetch real stats from API
  const stats = [
    { title: 'Total Patients', value: 0, icon: Users },
    { title: 'Total Doctors', value: 0, icon: UserCheck },
    { title: 'Total Appointments', value: 0, icon: Calendar },
    { title: 'Total Revenue', value: '$0', icon: DollarSign },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}