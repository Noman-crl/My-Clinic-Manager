import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Eye, Package, AlertTriangle } from 'lucide-react';

const MedicineList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Sample medicine data
  const medicines = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      generic_name: 'Paracetamol',
      manufacturer: 'ABC Pharma',
      category: 'Analgesic',
      strength: '500mg',
      form: 'Tablet',
      stock_quantity: 500,
      minimum_stock: 50,
      purchase_price: 2.50,
      selling_price: 3.50,
      mrp: 4.00,
      expiry_date: '2025-12-31',
      batch_number: 'PAR001',
      gst_rate: 12,
      is_prescription_required: false
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      generic_name: 'Amoxicillin',
      manufacturer: 'XYZ Pharma',
      category: 'Antibiotic',
      strength: '250mg',
      form: 'Capsule',
      stock_quantity: 15,
      minimum_stock: 20,
      purchase_price: 8.00,
      selling_price: 12.00,
      mrp: 15.00,
      expiry_date: '2024-06-30',
      batch_number: 'AMX002',
      gst_rate: 12,
      is_prescription_required: true
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getStockStatus = (current: number, minimum: number) => {
    if (current <= minimum) {
      return { status: 'Low Stock', color: '#ef4444' };
    } else if (current <= minimum * 1.5) {
      return { status: 'Medium Stock', color: '#f59e0b' };
    }
    return { status: 'Good Stock', color: '#10b981' };
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 90; // Expiring within 3 months
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = searchTerm === '' ||
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.generic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === '' || medicine.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Medicine Inventory</h1>
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
              placeholder="Search medicines by name, generic name, or manufacturer..."
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
              minWidth: '150px'
            }}
          >
            <option value="">All Categories</option>
            <option value="Analgesic">Analgesic</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Antacid">Antacid</option>
            <option value="Vitamin">Vitamin</option>
          </select>
        </div>
      </div>

      {/* Medicine Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredMedicines.map((medicine) => {
          const stockStatus = getStockStatus(medicine.stock_quantity, medicine.minimum_stock);
          const expiringSoon = isExpiringSoon(medicine.expiry_date);
          
          return (
            <div
              key={medicine.id}
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
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.25rem'
                  }}>
                    {medicine.name}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    {medicine.generic_name} • {medicine.manufacturer}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      borderRadius: '0.375rem',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af'
                    }}>
                      {medicine.category}
                    </span>
                    {medicine.is_prescription_required && (
                      <span style={{
                        display: 'inline-flex',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        borderRadius: '0.375rem',
                        backgroundColor: '#fef3c7',
                        color: '#92400e'
                      }}>
                        Prescription Required
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => navigate(`/pharmacy/medicines/${medicine.id}`)}
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
                    onClick={() => navigate(`/pharmacy/medicines/${medicine.id}`)}
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
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Stock Quantity
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Package size={16} style={{ color: stockStatus.color }} />
                    <span style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: stockStatus.color
                    }}>
                      {medicine.stock_quantity} {medicine.form}s
                    </span>
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Min: {medicine.minimum_stock}
                  </div>
                </div>

                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Pricing
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>
                    <div>MRP: <strong>{formatCurrency(medicine.mrp)}</strong></div>
                    <div style={{ color: '#6b7280' }}>
                      Selling: {formatCurrency(medicine.selling_price)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Batch: {medicine.batch_number}
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: expiringSoon ? '#ef4444' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {expiringSoon && <AlertTriangle size={12} />}
                    Exp: {new Date(medicine.expiry_date).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.75rem',
                  color: stockStatus.color,
                  fontWeight: '500'
                }}>
                  {stockStatus.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicineList;