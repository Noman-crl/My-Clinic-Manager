import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Calendar, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import { getDashboardStats } from '../../services/supabaseApi';

interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  totalRevenue: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('📊 Dashboard: Fetching stats...');
      
      const data = await getDashboardStats();
      console.log('📊 Dashboard: Stats received:', data);
      
      setStats(data);
    } catch (err: any) {
      console.error('📊 Dashboard: Error fetching stats:', err);
      
      let errorMessage = 'Failed to fetch dashboard statistics';
      
      if (err.message) {
        if (err.message.includes('Authentication required')) {
          errorMessage = 'Please sign in to view dashboard data';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Database connection failed. Please check your Supabase configuration.';
        } else if (err.message.includes('relation') && err.message.includes('does not exist')) {
          errorMessage = 'Database tables not found. Please run the database migrations.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        gap: '1rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #3b82f6',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Dashboard
        </h1>
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} style={{ marginTop: '0.125rem', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
              Dashboard Error
            </div>
            <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
              {error}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>
              <strong>Troubleshooting steps:</strong>
              <ol style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                <li>Check browser console for detailed error messages</li>
                <li>Verify your Supabase environment variables in .env file</li>
                <li>Ensure database migrations have been run</li>
                <li>Check Supabase project status and RLS policies</li>
              </ol>
            </div>
            <button
              onClick={fetchStats}
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: '#3b82f6',
      onClick: () => navigate('/patients'),
    },
    {
      title: 'Total Doctors',
      value: stats?.totalDoctors || 0,
      icon: UserCheck,
      color: '#10b981',
      onClick: () => navigate('/doctors'),
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      color: '#f59e0b',
      onClick: () => navigate('/appointments'),
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: '#8b5cf6',
      onClick: () => navigate('/billing'),
    },
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Dashboard
        </h1>
        <button
          onClick={fetchStats}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              onClick={stat.onClick}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    {stat.title}
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: `${stat.color}20`,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;