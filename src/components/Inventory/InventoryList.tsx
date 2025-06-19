import React, { useState } from 'react';
import { Package, AlertTriangle, Search, Filter, TrendingDown, TrendingUp } from 'lucide-react';

const InventoryList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  // Sample inventory data
  const inventory = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'Analgesic',
      current_stock: 500,
      minimum_stock: 50,
      maximum_stock: 1000,
      unit: 'tablet',
      location: 'Shelf A-1',
      last_updated: '2024-01-15',
      expiry_date: '2025-12-31',
      batch_number: 'PAR001',
      supplier: 'MediCorp Pharmaceuticals'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'Antibiotic',
      current_stock: 15,
      minimum_stock: 20,
      maximum_stock: 200,
      unit: 'capsule',
      location: 'Shelf B-2',
      last_updated: '2024-01-14',
      expiry_date: '2024-06-30',
      batch_number: 'AMX002',
      supplier: 'HealthPlus Distributors'
    },
    {
      id: '3',
      name: 'Vitamin D3 60K',
      category: 'Vitamin',
      current_stock: 100,
      minimum_stock: 10,
      maximum_stock: 150,
      unit: 'capsule',
      location: 'Shelf C-3',
      last_updated: '2024-01-13',
      expiry_date: '2025-08-15',
      batch_number: 'VIT003',
      supplier: 'Wellness Pharma Ltd'
    }
  ];

  const getStockStatus = (current: number, minimum: number, maximum: number) => {
    if (current <= minimum) {
      return { status: 'Low Stock', color: '#ef4444', icon: TrendingDown };
    } else if (current >= maximum * 0.9) {
      return { status: 'Overstock', color: '#f59e0b', icon: TrendingUp };
    } else if (current <= minimum * 1.5) {
      return { status: 'Medium Stock', color: '#f59e0b', icon: AlertTriangle };
    }
    return { status: 'Good Stock', color: '#10b981', icon: Package };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expiring within 3 months
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = item.current_stock <= item.minimum_stock;
    } else if (stockFilter === 'overstock') {
      matchesStock = item.current_stock >= item.maximum_stock * 0.9;
    } else if (stockFilter === 'expiring') {
      matchesStock = isExpiringSoon(item.expiry_date);
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockCount = inventory.filter(item => item.current_stock <= item.minimum_stock).length;
  const expiringCount = inventory.filter(item => isExpiringSoon(item.expiry_date)).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.current_stock * 10), 0); // Assuming avg price of 10

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Inventory Management</h1>
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
                Total Items
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#3b82f6'
              }}>
                {inventory.length}
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
                Low Stock Items
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ef4444'
              }}>
                {lowStockCount}
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
              <AlertTriangle size={20} style={{ color: '#ef4444' }} />
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
                Expiring Soon
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#f59e0b'
              }}>
                {expiringCount}
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
              <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
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
                Inventory Value
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#10b981'
              }}>
                ₹{totalValue.toLocaleString('en-IN')}
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
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '300px' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }} />
            <input
              type="text"
              placeholder="Search by medicine name, category, or supplier..."
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            <option value="">All Categories</option>
            <option value="Analgesic">Analgesic</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Vitamin">Vitamin</option>
          </select>
          
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            <option value="">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="overstock">Overstock</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Inventory List */}
      <div style={{
        display: 'grid',
        gap: '1rem'
      }}>
        {filteredInventory.map((item) => {
          const stockStatus = getStockStatus(item.current_stock, item.minimum_stock, item.maximum_stock);
          const expiringSoon = isExpiringSoon(item.expiry_date);
          const StatusIcon = stockStatus.icon;
          
          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    {item.category} • {item.supplier}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <StatusIcon size={16} style={{ color: stockStatus.color }} />
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      color: stockStatus.color
                    }}>
                      {stockStatus.status}
                    </span>
                    {expiringSoon && (
                      <>
                        <span style={{ color: '#d1d5db' }}>•</span>
                        <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: '#f59e0b'
                        }}>
                          Expiring Soon
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Current Stock
                  </div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#111827'
                  }}>
                    {item.current_stock} {item.unit}s
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Min: {item.minimum_stock} • Max: {item.maximum_stock}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Location & Batch
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827'
                  }}>
                    {item.location}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Batch: {item.batch_number}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Expiry Date
                  </div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: expiringSoon ? '#f59e0b' : '#111827'
                  }}>
                    {new Date(item.expiry_date).toLocaleDateString('en-IN')}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Updated: {new Date(item.last_updated).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min((item.current_stock / item.maximum_stock) * 100, 100)}%`,
                      height: '100%',
                      backgroundColor: stockStatus.color,
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredInventory.length === 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <Package size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            No inventory items found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryList;