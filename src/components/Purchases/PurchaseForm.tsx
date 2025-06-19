import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

interface PurchaseFormData {
  supplier_id: string;
  purchase_date: string;
  invoice_number: string;
  invoice_date: string;
  status: 'draft' | 'ordered' | 'received' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid';
  notes: string;
}

interface PurchaseItem {
  medicine_id: string;
  medicine_name: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_percent: number;
}

const PurchaseForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<PurchaseFormData>({
    defaultValues: {
      purchase_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      payment_status: 'pending'
    }
  });

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      medicine_id: '',
      medicine_name: '',
      quantity: 1,
      unit_price: 0,
      discount_percent: 0,
      tax_percent: 12
    }
  ]);

  // Sample suppliers and medicines
  const suppliers = [
    { id: '1', name: 'MediCorp Pharmaceuticals', gstin: '27ABCDE1234F1Z5' },
    { id: '2', name: 'HealthPlus Distributors', gstin: '07FGHIJ5678G2Y6' },
    { id: '3', name: 'Wellness Pharma Ltd', gstin: '24KLMNO9012H3X7' }
  ];

  const medicines = [
    { id: '1', name: 'Paracetamol 500mg', unit_price: 2.50 },
    { id: '2', name: 'Amoxicillin 250mg', unit_price: 8.00 },
    { id: '3', name: 'Cetirizine 10mg', unit_price: 1.80 },
    { id: '4', name: 'Omeprazole 20mg', unit_price: 4.50 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateItemTotal = (item: PurchaseItem) => {
    const subtotal = item.quantity * item.unit_price;
    const discountAmount = (subtotal * item.discount_percent) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * item.tax_percent) / 100;
    return taxableAmount + taxAmount;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    items.forEach(item => {
      const itemSubtotal = item.quantity * item.unit_price;
      const discountAmount = (itemSubtotal * item.discount_percent) / 100;
      const taxableAmount = itemSubtotal - discountAmount;
      const taxAmount = (taxableAmount * item.tax_percent) / 100;

      subtotal += itemSubtotal;
      totalDiscount += discountAmount;
      totalTax += taxAmount;
    });

    const netAmount = subtotal - totalDiscount + totalTax;

    return { subtotal, totalDiscount, totalTax, netAmount };
  };

  const addItem = () => {
    setItems([...items, {
      medicine_id: '',
      medicine_name: '',
      quantity: 1,
      unit_price: 0,
      discount_percent: 0,
      tax_percent: 12
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof PurchaseItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Auto-fill medicine name and price when medicine is selected
    if (field === 'medicine_id') {
      const selectedMedicine = medicines.find(m => m.id === value);
      if (selectedMedicine) {
        updatedItems[index].medicine_name = selectedMedicine.name;
        updatedItems[index].unit_price = selectedMedicine.unit_price;
      }
    }

    setItems(updatedItems);
  };

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      setLoading(true);
      setError('');

      // Validate items
      if (items.length === 0 || items.some(item => !item.medicine_id || item.quantity <= 0)) {
        setError('Please add at least one valid item to the purchase order');
        return;
      }

      const totals = calculateTotals();
      const purchaseData = {
        ...data,
        items,
        total_amount: totals.subtotal,
        discount_amount: totals.totalDiscount,
        tax_amount: totals.totalTax,
        net_amount: totals.netAmount
      };

      console.log('Purchase data:', purchaseData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate('/purchases');
    } catch (err: any) {
      console.error('Error saving purchase:', err);
      setError(err.message || 'Failed to save purchase order. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        {isEdit ? 'Edit Purchase Order' : 'Create Purchase Order'}
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Information */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Purchase Information
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Supplier *
                </label>
                <select
                  {...register('supplier_id', { required: 'Supplier is required' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.gstin}
                    </option>
                  ))}
                </select>
                {errors.supplier_id && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.supplier_id.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Purchase Date *
                </label>
                <input
                  type="date"
                  {...register('purchase_date', { required: 'Purchase date is required' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                {errors.purchase_date && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.purchase_date.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Invoice Number
                </label>
                <input
                  {...register('invoice_number')}
                  placeholder="INV-2024-001"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Invoice Date
                </label>
                <input
                  type="date"
                  {...register('invoice_date')}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Status *
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="ordered">Ordered</option>
                  <option value="received">Received</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {errors.status && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Payment Status *
                </label>
                <select
                  {...register('payment_status', { required: 'Payment status is required' })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
                {errors.payment_status && (
                  <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {errors.payment_status.message}
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Additional notes about this purchase order..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Items Section */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151'
              }}>
                Purchase Items
              </h3>
              <button
                type="button"
                onClick={addItem}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
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
                Add Item
              </button>
            </div>

            <div style={{
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                        Medicine
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                        Quantity
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                        Unit Price (₹)
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                        Discount (%)
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                        Tax (%)
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                        Total
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} style={{ borderTop: index > 0 ? '1px solid #f3f4f6' : 'none' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <select
                            value={item.medicine_id}
                            onChange={(e) => updateItem(index, 'medicine_id', e.target.value)}
                            style={{
                              width: '100%',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none',
                              minWidth: '200px'
                            }}
                          >
                            <option value="">Select Medicine</option>
                            {medicines.map((medicine) => (
                              <option key={medicine.id} value={medicine.id}>
                                {medicine.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            style={{
                              width: '80px',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unit_price}
                            onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            style={{
                              width: '100px',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={item.discount_percent}
                            onChange={(e) => updateItem(index, 'discount_percent', parseFloat(e.target.value) || 0)}
                            style={{
                              width: '80px',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          />
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <select
                            value={item.tax_percent}
                            onChange={(e) => updateItem(index, 'tax_percent', parseFloat(e.target.value))}
                            style={{
                              width: '80px',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              outline: 'none'
                            }}
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {formatCurrency(calculateItemTotal(item))}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={items.length === 1}
                            style={{
                              padding: '0.25rem',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: items.length === 1 ? 'not-allowed' : 'pointer',
                              color: items.length === 1 ? '#9ca3af' : '#ef4444'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Totals Section */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Order Summary
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Subtotal</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {formatCurrency(totals.subtotal)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Discount</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ef4444' }}>
                  -{formatCurrency(totals.totalDiscount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tax</div>
                <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                  {formatCurrency(totals.totalTax)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Net Amount</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                  {formatCurrency(totals.netAmount)}
                </div>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem'
          }}>
            <button
              type="button"
              onClick={() => navigate('/purchases')}
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'transparent',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {loading && (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              )}
              {isEdit ? 'Update Purchase Order' : 'Create Purchase Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;