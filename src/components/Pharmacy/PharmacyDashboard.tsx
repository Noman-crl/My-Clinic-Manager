import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pill, Package, TrendingUp, AlertTriangle, Plus, Eye } from 'lucide-react';

const PharmacyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockItems: 0,
    expiringSoon: 0,
    todaySales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading pharmacy stats
    setTimeout(() => {
      setStats({
        totalMedicines: 150,
        lowStockItems: 12,
        expiringSoon: 5,
        todaySales: 25000
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Medicines',
      value: stats.totalMedicines,
      icon: Pill,
      color: '#3b82f6',
      onClick: () => navigate('/pharmacy/medicines'),
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: AlertTriangle,
      color: '#f59e0b',
      onClick: () => navigate('/inventory'),
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      icon: Package,
      color: '#ef4444',
      onClick: () => navigate('/inventory'),
    },
    {
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      icon: TrendingUp,
      color: '#10b981',
      onClick: () => navigate('/pharmacy/sales'),
    },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid #3b82f6',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Pharmacy Dashboard</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/pharmacy/medicines/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <Plus size={16} />
            Add Medicine
          </button>
          <button
            onClick={() => navigate('/pharmacy/sales')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <Eye size={16} />
            View Sales
          </button>
        </div>
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

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Quick Actions
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/pharmacy/medicines')}
            style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              Manage Medicines
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Add, edit, and manage medicine inventory
            </div>
          </button>
          
          <button
            onClick={() => navigate('/purchases/new')}
            style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              Create Purchase Order
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Order medicines from suppliers
            </div>
          </button>
          
          <button
            onClick={() => navigate('/inventory')}
            style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          >
            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
              Check Inventory
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Monitor stock levels and expiry dates
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;