import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Eye, Package, Calendar, User } from 'lucide-react';

const PurchaseList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Sample purchase data
  const purchases = [
    {
      id: '1',
      purchase_number: 'PUR-000001',
      supplier_name: 'MediCorp Pharmaceuticals',
      purchase_date: '2024-01-15',
      invoice_number: 'INV-2024-001',
      total_amount: 25000.00,
      tax_amount: 3000.00,
      net_amount: 28000.00,
      payment_status: 'pending',
      status: 'received',
      items_count: 5
    },
    {
      id: '2',
      purchase_number: 'PUR-000002',
      supplier_name: 'HealthPlus Distributors',
      purchase_date: '2024-01-14',
      invoice_number: 'INV-2024-002',
      total_amount: 15000.00,
      tax_amount: 1800.00,
      net_amount: 16800.00,
      payment_status: 'paid',
      status: 'received',
      items_count: 3
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return { bg: '#f3f4f6', text: '#374151' };
      case 'ordered':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'received':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'partial':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'paid':
        return { bg: '#d1fae5', text: '#065f46' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = searchTerm === '' ||
      purchase.purchase_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || purchase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + purchase.net_amount, 0);

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Purchase Management</h1>
        <button
          onClick={() => navigate('/purchases/new')}
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
          Create Purchase Order
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Total Purchases
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#3b82f6'
              }}>
                {formatCurrency(totalPurchases)}
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
              <Package size={20} style={{ color: '#3b82f6' }} />
            </div>
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
            justifyContent: 'space-between'
          }}>
            <div>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                Total Orders
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#10b981'
              }}>
                {filteredPurchases.length}
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
              <User size={20} style={{ color: '#10b981' }} />
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
              placeholder="Search by purchase number, supplier, or invoice number..."
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="ordered">Ordered</option>
            <option value="received">Received</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Purchase List */}
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
                  Purchase Details
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
                  Supplier
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
                  Payment
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
              {filteredPurchases.map((purchase) => {
                const statusColors = getStatusColor(purchase.status);
                const paymentColors = getPaymentStatusColor(purchase.payment_status);
                return (
                  <tr key={purchase.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem'
                        }}>
                          <Package size={14} style={{ color: '#6b7280' }} />
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {purchase.purchase_number}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          Invoice: {purchase.invoice_number}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          {purchase.items_count} items
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <User size={14} style={{ color: '#6b7280' }} />
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: '#111827'
                        }}>
                          {purchase.supplier_name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <Calendar size={14} style={{ color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                          {new Date(purchase.purchase_date).toLocaleDateString('en-IN')}
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
                          {formatCurrency(purchase.net_amount)}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: '#6b7280'
                        }}>
                          Tax: {formatCurrency(purchase.tax_amount)}
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
                        color: statusColors.text,
                        textTransform: 'capitalize'
                      }}>
                        {purchase.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '0.375rem',
                        backgroundColor: paymentColors.bg,
                        color: paymentColors.text,
                        textTransform: 'capitalize'
                      }}>
                        {purchase.payment_status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => navigate(`/purchases/${purchase.id}`)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            color: '#3b82f6'
                          }}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/purchases/${purchase.id}`)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            color: '#10b981'
                          }}
                        >
                          <Edit size={16} />
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
    </div>
  );
};

export default PurchaseList;