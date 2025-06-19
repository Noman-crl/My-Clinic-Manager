import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, FileText, Download, Calendar, Filter } from 'lucide-react';

const ReportsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('financial');

  // Sample report data
  const financialData = {
    revenue: 950000,
    expenses: 576000,
    profit: 374000,
    profitMargin: 39.4
  };

  const salesData = {
    totalSales: 320000,
    prescriptionSales: 240000,
    otcSales: 80000,
    averageTicket: 850
  };

  const inventoryData = {
    totalItems: 150,
    lowStock: 12,
    expiring: 5,
    turnoverRate: 4.2
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const reportCategories = [
    {
      title: 'Financial Reports',
      icon: BarChart3,
      color: '#3b82f6',
      reports: [
        'Profit & Loss Statement',
        'Balance Sheet',
        'Cash Flow Statement',
        'Trial Balance',
        'GST Returns'
      ]
    },
    {
      title: 'Sales Reports',
      icon: TrendingUp,
      color: '#10b981',
      reports: [
        'Daily Sales Summary',
        'Medicine-wise Sales',
        'Doctor-wise Prescriptions',
        'Payment Method Analysis',
        'Customer Analysis'
      ]
    },
    {
      title: 'Inventory Reports',
      icon: PieChart,
      color: '#f59e0b',
      reports: [
        'Stock Level Report',
        'Expiry Analysis',
        'Purchase Analysis',
        'Supplier Performance',
        'ABC Analysis'
      ]
    },
    {
      title: 'Clinical Reports',
      icon: FileText,
      color: '#8b5cf6',
      reports: [
        'Patient Demographics',
        'Appointment Analytics',
        'Doctor Performance',
        'Disease Pattern Analysis',
        'Treatment Outcomes'
      ]
    }
  ];

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Reports & Analytics</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Total Revenue
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#10b981'
              }}>
                {formatCurrency(financialData.revenue)}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#d1fae5',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={20} style={{ color: '#10b981' }} />
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            +12.5% from last month
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Net Profit
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#3b82f6'
              }}>
                {formatCurrency(financialData.profit)}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dbeafe',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={20} style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {financialData.profitMargin}% profit margin
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Pharmacy Sales
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#f59e0b'
              }}>
                {formatCurrency(salesData.totalSales)}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PieChart size={20} style={{ color: '#f59e0b' }} />
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            Avg ticket: {formatCurrency(salesData.averageTicket)}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Inventory Turnover
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#8b5cf6'
              }}>
                {inventoryData.turnoverRate}x
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f3e8ff',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={20} style={{ color: '#8b5cf6' }} />
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {inventoryData.totalItems} total items
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {reportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: `${category.color}20`,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} style={{ color: category.color }} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: '#111827',
                  margin: 0
                }}>
                  {category.title}
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {category.reports.map((report) => (
                  <button
                    key={report}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      color: '#374151',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      e.currentTarget.style.borderColor = category.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{report}</span>
                      <Download size={14} style={{ color: '#6b7280' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Analytics */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#374151'
        }}>
          Quick Analytics
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Top Selling Medicine
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Paracetamol 500mg
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              1,250 units sold
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Peak Sales Hour
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              2:00 PM - 4:00 PM
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              35% of daily sales
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Most Active Doctor
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Dr. Rajesh Kumar
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              145 consultations
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Payment Method
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              UPI (45%)
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Most preferred
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;