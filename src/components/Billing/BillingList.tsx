import React, { useEffect, useState } from 'react';
import { Receipt, Search, DollarSign, Calendar, User, Filter, Eye, Download } from 'lucide-react';
import { getInvoices } from '../../services/supabaseApi';

const BillingList: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch invoices. Please try again later.');
      console.error('Error fetching invoices:', err);
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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = searchTerm === '' ||
      (invoice.patients && 
        `${invoice.patients.first_name} ${invoice.patients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'sent':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'draft':
        return { bg: '#f3f4f6', text: '#374151' };
      case 'overdue':
        return { bg: '#fee2e2', text: '#991b1b' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total_amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total_amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total_amount, 0);

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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Billing & Payments</h1>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {/* Revenue Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#10b981'
              }}>
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#d1fae5',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} style={{ color: '#10b981' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Pending Payments
              </p>
              <p style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#f59e0b'
              }}>
                {formatCurrency(pendingAmount)}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Receipt size={24} style={{ color: '#f59e0b' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          padding: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Overdue Amount
              </p>
              <p style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#ef4444'
              }}>
                {formatCurrency(overdueAmount)}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fee2e2',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} style={{ color: '#ef4444' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }} />
            <input
              type="text"
              placeholder="Search invoices by patient name or invoice ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '2.5rem',
                paddingRight: '1rem',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={20} style={{ color: '#6b7280' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="sent">Sent</option>
              <option value="draft">Draft</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      {filteredInvoices.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <Receipt size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            No invoices found matching your criteria.
          </p>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
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
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Invoice
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Patient
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Date
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Amount
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Status
                  </th>
                  <th style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'white' }}>
                {filteredInvoices.map((invoice) => {
                  const statusColors = getStatusColor(invoice.status);
                  return (
                    <tr key={invoice.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Receipt size={16} style={{ color: '#6b7280' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            #{invoice.invoice_number}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <User size={16} style={{ color: '#6b7280' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {invoice.patients ? 
                              `${invoice.patients.first_name} ${invoice.patients.last_name}` : 
                              'Unknown Patient'
                            }
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <Calendar size={16} style={{ color: '#6b7280' }} />
                          <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                            {new Date(invoice.issue_date).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {formatCurrency(invoice.total_amount)}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            Tax: {formatCurrency(invoice.tax_amount)}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          borderRadius: '0.375rem',
                          backgroundColor: statusColors.bg,
                          color: statusColors.text
                        }}>
                          {invoice.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            color: '#3b82f6'
                          }}>
                            <Eye size={16} />
                          </button>
                          <button style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            color: '#10b981'
                          }}>
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingList;