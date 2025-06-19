import React, { useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Search } from 'lucide-react';

const AccountsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Sample chart of accounts data
  const accounts = [
    // Assets
    { id: '1', code: '1100', name: 'Cash in Hand', type: 'asset', balance: 50000, parent: null },
    { id: '2', code: '1200', name: 'Bank Account - Current', type: 'asset', balance: 500000, parent: null },
    { id: '3', code: '1300', name: 'Accounts Receivable', type: 'asset', balance: 75000, parent: null },
    { id: '4', code: '1400', name: 'Medicine Inventory', type: 'asset', balance: 200000, parent: null },
    { id: '5', code: '1500', name: 'Medical Equipment', type: 'asset', balance: 1000000, parent: null },
    
    // Liabilities
    { id: '6', code: '2100', name: 'Accounts Payable', type: 'liability', balance: 45000, parent: null },
    { id: '7', code: '2200', name: 'GST Payable', type: 'liability', balance: 25000, parent: null },
    { id: '8', code: '2300', name: 'TDS Payable', type: 'liability', balance: 8000, parent: null },
    { id: '9', code: '2400', name: 'Salary Payable', type: 'liability', balance: 120000, parent: null },
    
    // Equity
    { id: '10', code: '3000', name: 'Owner Equity', type: 'equity', balance: 1500000, parent: null },
    { id: '11', code: '3100', name: 'Retained Earnings', type: 'equity', balance: 127000, parent: null },
    
    // Income
    { id: '12', code: '4000', name: 'Consultation Income', type: 'income', balance: 450000, parent: null },
    { id: '13', code: '4100', name: 'Pharmacy Sales', type: 'income', balance: 320000, parent: null },
    { id: '14', code: '4200', name: 'Diagnostic Income', type: 'income', balance: 180000, parent: null },
    
    // Expenses
    { id: '15', code: '5000', name: 'Medicine Purchase', type: 'expense', balance: 180000, parent: null },
    { id: '16', code: '5100', name: 'Staff Salary', type: 'expense', balance: 240000, parent: null },
    { id: '17', code: '5200', name: 'Rent Expense', type: 'expense', balance: 120000, parent: null },
    { id: '18', code: '5300', name: 'Electricity Expense', type: 'expense', balance: 36000, parent: null },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset':
        return { bg: '#dbeafe', text: '#1e40af', icon: TrendingUp };
      case 'liability':
        return { bg: '#fee2e2', text: '#991b1b', icon: TrendingDown };
      case 'equity':
        return { bg: '#f3e8ff', text: '#7c3aed', icon: DollarSign };
      case 'income':
        return { bg: '#d1fae5', text: '#065f46', icon: TrendingUp };
      case 'expense':
        return { bg: '#fef3c7', text: '#92400e', icon: TrendingDown };
      default:
        return { bg: '#f3f4f6', text: '#374151', icon: CreditCard };
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = searchTerm === '' ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.includes(searchTerm);
    
    const matchesType = typeFilter === '' || account.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const groupedAccounts = filteredAccounts.reduce((groups, account) => {
    const type = account.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(account);
    return groups;
  }, {} as Record<string, typeof accounts>);

  const calculateTotals = () => {
    const totals = {
      assets: 0,
      liabilities: 0,
      equity: 0,
      income: 0,
      expenses: 0
    };

    accounts.forEach(account => {
      if (account.type in totals) {
        totals[account.type as keyof typeof totals] += account.balance;
      }
    });

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Chart of Accounts</h1>
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
                Total Assets
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1e40af'
              }}>
                {formatCurrency(totals.assets)}
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
              <TrendingUp size={20} style={{ color: '#1e40af' }} />
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
                Total Liabilities
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#991b1b'
              }}>
                {formatCurrency(totals.liabilities)}
              </p>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#fee2e2',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingDown size={20} style={{ color: '#991b1b' }} />
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
                Total Income
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#065f46'
              }}>
                {formatCurrency(totals.income)}
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
              <TrendingUp size={20} style={{ color: '#065f46' }} />
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
                Total Expenses
              </p>
              <p style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#92400e'
              }}>
                {formatCurrency(totals.expenses)}
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
              <TrendingDown size={20} style={{ color: '#92400e' }} />
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
              placeholder="Search accounts by name or code..."
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              minWidth: '150px'
            }}
          >
            <option value="">All Types</option>
            <option value="asset">Assets</option>
            <option value="liability">Liabilities</option>
            <option value="equity">Equity</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
        </div>
      </div>

      {/* Accounts by Type */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {Object.entries(groupedAccounts).map(([type, typeAccounts]) => {
          const typeColors = getAccountTypeColor(type);
          const TypeIcon = typeColors.icon;
          
          return (
            <div key={type} style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: typeColors.bg,
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <TypeIcon size={20} style={{ color: typeColors.text }} />
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: typeColors.text,
                  textTransform: 'capitalize',
                  margin: 0
                }}>
                  {type}s
                </h3>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: typeColors.text
                }}>
                  {formatCurrency(typeAccounts.reduce((sum, acc) => sum + acc.balance, 0))}
                </span>
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
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Account Code
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
                        Account Name
                      </th>
                      <th style={{
                        padding: '0.75rem',
                        textAlign: 'right',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeAccounts.map((account) => (
                      <tr key={account.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {account.code}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            fontSize: '0.875rem',
                            color: '#111827'
                          }}>
                            {account.name}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {formatCurrency(account.balance)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Balance Sheet Summary */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginTop: '2rem',
        border: '2px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#374151'
        }}>
          Balance Sheet Summary
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Total Assets
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e40af' }}>
              {formatCurrency(totals.assets)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Total Liabilities & Equity
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#991b1b' }}>
              {formatCurrency(totals.liabilities + totals.equity)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Net Income (Income - Expenses)
            </div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: totals.income - totals.expenses >= 0 ? '#065f46' : '#991b1b'
            }}>
              {formatCurrency(totals.income - totals.expenses)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
              Balance Check
            </div>
            <div style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: Math.abs(totals.assets - (totals.liabilities + totals.equity)) < 1 ? '#065f46' : '#991b1b'
            }}>
              {Math.abs(totals.assets - (totals.liabilities + totals.equity)) < 1 ? 'Balanced' : 'Unbalanced'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsList;