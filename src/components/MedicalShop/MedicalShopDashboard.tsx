import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, TrendingUp, Users, Plus, Search, Filter } from 'lucide-react';

const MedicalShopDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todaySales: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading medical shop stats
    setTimeout(() => {
      setStats({
        todaySales: 45000,
        totalCustomers: 125,
        lowStockItems: 8,
        totalRevenue: 1250000
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
      title: "Today's Sales",
      value: formatCurrency(stats.todaySales),
      icon: TrendingUp,
      color: '#10b981',
      onClick: () => navigate('/medical-shop/sales'),
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: '#3b82f6',
      onClick: () => navigate('/medical-shop/customers'),
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: Package,
      color: '#f59e0b',
      onClick: () => navigate('/inventory'),
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: ShoppingCart,
      color: '#8b5cf6',
      onClick: () => navigate('/medical-shop/sales'),
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Medical Shop</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => navigate('/medical-shop/new-sale')}
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
            <Plus size={16} />
            New Sale
          </button>
          <button
            onClick={() => navigate('/medical-shop/pos')}
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
            <ShoppingCart size={16} />
            POS System
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
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem'
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
            onClick={() => navigate('/medical-shop/pos')}
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
              Point of Sale (POS)
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Quick medicine sales without prescription
            </div>
          </button>
          
          <button
            onClick={() => navigate('/medical-shop/customers')}
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
              Customer Management
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Manage walk-in customers and loyalty
            </div>
          </button>
          
          <button
            onClick={() => navigate('/medical-shop/sales')}
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
              Sales History
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              View all medical shop transactions
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
              Inventory Check
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Monitor stock levels and expiry dates
            </div>
          </button>
        </div>
      </div>

      {/* Recent Sales */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: 0
          }}>
            Recent Sales
          </h3>
          <button
            onClick={() => navigate('/medical-shop/sales')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            View All
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Sale ID
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Customer
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Items
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Amount
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Payment
                </th>
                <th style={{
                  padding: '0.75rem',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#6b7280',
                  textTransform: 'uppercase'
                }}>
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'MS-001', customer: 'Walk-in Customer', items: 3, amount: 450, payment: 'Cash', time: '10:30 AM' },
                { id: 'MS-002', customer: 'Rajesh Kumar', items: 2, amount: 280, payment: 'UPI', time: '11:15 AM' },
                { id: 'MS-003', customer: 'Walk-in Customer', items: 1, amount: 125, payment: 'Card', time: '12:00 PM' },
                { id: 'MS-004', customer: 'Priya Sharma', items: 4, amount: 680, payment: 'Cash', time: '2:30 PM' },
                { id: 'MS-005', customer: 'Walk-in Customer', items: 2, amount: 340, payment: 'UPI', time: '3:45 PM' }
              ].map((sale) => (
                <tr key={sale.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', fontWeight: '500' }}>
                    {sale.id}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                    {sale.customer}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                    {sale.items} items
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', textAlign: 'right', fontWeight: '500' }}>
                    {formatCurrency(sale.amount)}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      backgroundColor: sale.payment === 'Cash' ? '#d1fae5' : sale.payment === 'UPI' ? '#fef3c7' : '#dbeafe',
                      color: sale.payment === 'Cash' ? '#065f46' : sale.payment === 'UPI' ? '#92400e' : '#1e40af'
                    }}>
                      {sale.payment}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                    {sale.time}
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

export default MedicalShopDashboard;