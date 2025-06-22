import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Minus, ShoppingCart, User, CreditCard, Trash2, Calculator, Printer, Save } from 'lucide-react';
import { createPharmacySale } from '../../services/supabaseApi';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  gstRate: number;
  discount: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  age?: number;
}

const POSSystem: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saleComplete, setSaleComplete] = useState(false);
  const [saleId, setSaleId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Sample medicines data
  const medicines = [
    { id: '1', name: 'Paracetamol 500mg', price: 3.50, stock: 500, gstRate: 12, category: 'Analgesic' },
    { id: '2', name: 'Amoxicillin 250mg', price: 12.00, stock: 200, gstRate: 12, category: 'Antibiotic' },
    { id: '3', name: 'Cetirizine 10mg', price: 2.50, stock: 300, gstRate: 12, category: 'Antihistamine' },
    { id: '4', name: 'Omeprazole 20mg', price: 6.50, stock: 150, gstRate: 12, category: 'Antacid' },
    { id: '5', name: 'Cough Syrup 100ml', price: 65.00, stock: 80, gstRate: 12, category: 'Cough Suppressant' },
    { id: '6', name: 'Vitamin D3 60K', price: 22.00, stock: 100, gstRate: 12, category: 'Vitamin' },
    { id: '7', name: 'Blood Pressure Monitor', price: 1800.00, stock: 25, gstRate: 18, category: 'Medical Device' },
    { id: '8', name: 'Thermometer Digital', price: 220.00, stock: 40, gstRate: 18, category: 'Medical Device' },
    { id: '9', name: 'Face Mask N95', price: 40.00, stock: 1000, gstRate: 12, category: 'PPE' },
    { id: '10', name: 'Hand Sanitizer 500ml', price: 85.00, stock: 200, gstRate: 18, category: 'Sanitizer' }
  ];

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (medicine: any) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    
    if (existingItem) {
      if (existingItem.quantity < medicine.stock) {
        setCart(cart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, {
        id: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        stock: medicine.stock,
        gstRate: medicine.gstRate,
        discount: 0
      }]);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    const medicine = medicines.find(m => m.id === id);
    if (medicine && newQuantity <= medicine.stock) {
      setCart(cart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateItemDiscount = (id: string, discount: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, discount: Math.max(0, Math.min(100, discount)) } : item
    ));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      const itemDiscount = (itemTotal * item.discount) / 100;
      const taxableAmount = itemTotal - itemDiscount;
      const itemTax = (taxableAmount * item.gstRate) / 100;

      subtotal += itemTotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    // Apply overall discount
    const overallDiscount = (subtotal * discount) / 100;
    totalDiscount += overallDiscount;

    // Apply senior citizen discount if applicable
    let seniorDiscount = 0;
    if (customer && customer.age && customer.age >= 60) {
      seniorDiscount = ((subtotal - totalDiscount) * 5) / 100; // 5% senior citizen discount
      totalDiscount += seniorDiscount;
    }

    const netAmount = subtotal - totalDiscount + totalTax;

    return {
      subtotal,
      totalDiscount,
      totalTax,
      netAmount,
      seniorDiscount
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const processSale = async () => {
    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const totals = calculateTotals();
      
      // Prepare sale data for API
      const saleData = {
        customer_name: customer?.name || 'Walk-in Customer',
        customer_phone: customer?.phone || '',
        customer_age: customer?.age,
        items: cart.map(item => ({
          medicine_id: item.id,
          medicine_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          discount_percent: item.discount,
          gst_rate: item.gstRate
        })),
        total_amount: totals.subtotal,
        discount_amount: totals.totalDiscount,
        tax_amount: totals.totalTax,
        net_amount: totals.netAmount,
        payment_method: paymentMethod,
        notes: customer?.age && customer.age >= 60 ? 'Senior citizen discount applied' : ''
      };

      // Save sale to database
      const result = await createPharmacySale(saleData);
      console.log('Sale processed and saved:', result);
      
      // Set sale as complete and store ID for receipt
      setSaleComplete(true);
      setSaleId(result.id);
      
    } catch (err: any) {
      console.error('Error processing sale:', err);
      setError(err.message || 'Failed to process sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    const receiptWindow = window.open('', '_blank', 'width=800,height=600');
    if (!receiptWindow) {
      alert('Please allow pop-ups to print receipt');
      return;
    }

    const totals = calculateTotals();
    
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sales Receipt</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 12px;
          }
          .receipt {
            max-width: 80mm;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 10px;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
            border-bottom: 1px dashed #ddd;
            padding-bottom: 10px;
          }
          .title {
            font-size: 16px;
            font-weight: bold;
            margin: 5px 0;
          }
          .subtitle {
            font-size: 12px;
            margin: 5px 0;
          }
          .info {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
          }
          .items {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          .items th, .items td {
            text-align: left;
            padding: 5px;
            border-bottom: 1px solid #eee;
          }
          .items th {
            font-weight: bold;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .total-section {
            border-top: 1px dashed #ddd;
            margin-top: 10px;
            padding-top: 10px;
          }
          .grand-total {
            font-weight: bold;
            font-size: 14px;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            border-top: 1px dashed #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              width: 80mm;
              margin: 0;
              padding: 0;
            }
            .receipt {
              border: none;
              width: 100%;
              max-width: none;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="title">Ultimate Clinic</div>
            <div class="subtitle">Medical Shop</div>
            <div class="subtitle">123 Medical Street, Healthcare District</div>
            <div class="subtitle">Mumbai, Maharashtra 400001</div>
            <div class="subtitle">Phone: +91 98765 43210</div>
            <div class="subtitle">GSTIN: 27ABCDE1234F1Z5</div>
          </div>
          
          <div class="info">
            <div>
              <div><strong>Receipt #:</strong> MS-${Date.now().toString().slice(-6)}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
              <div><strong>Time:</strong> ${new Date().toLocaleTimeString()}</div>
            </div>
            <div>
              <div><strong>Customer:</strong> ${customer?.name || 'Walk-in Customer'}</div>
              ${customer?.phone ? `<div><strong>Phone:</strong> ${customer.phone}</div>` : ''}
              ${customer?.age ? `<div><strong>Age:</strong> ${customer.age}</div>` : ''}
            </div>
          </div>
          
          <table class="items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Disc%</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => {
                const itemTotal = item.price * item.quantity;
                const itemDiscount = (itemTotal * item.discount) / 100;
                const itemNetTotal = itemTotal - itemDiscount;
                
                return `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.discount}%</td>
                    <td>${itemNetTotal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Discount:</span>
              <span>-${totals.totalDiscount.toFixed(2)}</span>
            </div>
            ${totals.seniorDiscount > 0 ? `
              <div class="total-row">
                <span>Senior Citizen Discount:</span>
                <span>-${totals.seniorDiscount.toFixed(2)}</span>
              </div>
            ` : ''}
            <div class="total-row">
              <span>GST:</span>
              <span>${totals.totalTax.toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span>TOTAL:</span>
              <span>${totals.netAmount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Payment Method:</span>
              <span>${paymentMethod.toUpperCase()}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your purchase!</p>
            <p>For any queries, please contact us at info@ultimateclinic.com</p>
            <p>This is a computer-generated receipt and does not require a signature.</p>
          </div>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print();" style="padding: 10px 20px; background-color: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Print Receipt
          </button>
          <button onclick="window.close();" style="padding: 10px 20px; background-color: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `);
    
    receiptWindow.document.close();
    receiptWindow.focus();
    
    // Auto print after a short delay to ensure content is loaded
    setTimeout(() => {
      receiptWindow.print();
    }, 500);
  };

  const startNewSale = () => {
    setCart([]);
    setCustomer(null);
    setDiscount(0);
    setPaymentMethod('cash');
    setSaleComplete(false);
    setSaleId(null);
    setError('');
  };

  const viewSaleDetails = () => {
    if (saleId) {
      navigate(`/medical-shop/sales/${saleId}`);
    }
  };

  const totals = calculateTotals();

  // If sale is complete, show receipt and options
  if (saleComplete) {
    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sale Complete</h1>
          <button
            onClick={() => navigate('/medical-shop')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Back to Medical Shop
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#d1fae5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Save size={32} style={{ color: '#10b981' }} />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Sale Saved Successfully!
          </h2>
          
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            The sale has been processed and saved to the database.
          </p>
          
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginBottom: '2rem',
            display: 'inline-block',
            textAlign: 'left'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>Customer:</span> {customer?.name || 'Walk-in Customer'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>Items:</span> {cart.length}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '500' }}>Total Amount:</span> {formatCurrency(totals.netAmount)}
            </div>
            <div>
              <span style={{ fontWeight: '500' }}>Payment Method:</span> {paymentMethod.toUpperCase()}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={printReceipt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <Printer size={16} />
              Print Receipt
            </button>
            
            <button
              onClick={viewSaleDetails}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <ShoppingCart size={16} />
              View Sale Details
            </button>
            
            <button
              onClick={startNewSale}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#f59e0b',
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
          </div>
        </div>
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Point of Sale (POS)</h1>
        <button
          onClick={() => navigate('/medical-shop')}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          Back to Medical Shop
        </button>
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '2rem',
        height: 'calc(100vh - 200px)'
      }}>
        {/* Left Panel - Medicine Search */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="text"
                placeholder="Search medicines..."
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
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
            alignContent: 'start'
          }}>
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                onClick={() => addToCart(medicine)}
                style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#f9fafb'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
              >
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  {medicine.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '0.5rem'
                }}>
                  {medicine.category}
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: '#10b981'
                  }}>
                    {formatCurrency(medicine.price)}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Stock: {medicine.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Customer Info */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <User size={16} />
              Customer
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Customer name (optional)"
                value={customer?.name || ''}
                onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value, id: '1', phone: prev?.phone || '' }))}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <input
                type="number"
                placeholder="Age"
                value={customer?.age || ''}
                onChange={(e) => setCustomer(prev => ({ ...prev, age: parseInt(e.target.value) || undefined, id: '1', phone: prev?.phone || '', name: prev?.name || '' }))}
                style={{
                  width: '80px',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <input
                type="text"
                placeholder="Phone number (optional)"
                value={customer?.phone || ''}
                onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value, id: '1', name: prev?.name || '' }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
            {customer?.age && customer.age >= 60 && (
              <div style={{
                fontSize: '0.75rem',
                color: '#10b981',
                marginTop: '0.25rem'
              }}>
                ✓ Senior citizen discount (5%) applicable
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            marginBottom: '1rem'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ShoppingCart size={16} />
              Cart ({cart.length} items)
            </h3>
            
            {cart.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#6b7280',
                padding: '2rem',
                fontSize: '0.875rem'
              }}>
                No items in cart
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {formatCurrency(item.price)} each
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          padding: '0.25rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#f3f4f6',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: item.quantity >= item.stock ? '#e5e7eb' : '#f3f4f6',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                      <div style={{ marginLeft: 'auto', fontWeight: '500' }}>
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Discount %:
                      </span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.discount}
                        onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                        style={{
                          width: '60px',
                          padding: '0.25rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '0.875rem' }}>Overall Discount %:</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '80px',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                  <span>Discount:</span>
                  <span>-{formatCurrency(totals.totalDiscount)}</span>
                </div>
                {totals.seniorDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', fontSize: '0.75rem' }}>
                    <span>Senior Citizen Discount:</span>
                    <span>-{formatCurrency(totals.seniorDiscount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax (GST):</span>
                  <span>{formatCurrency(totals.totalTax)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '0.5rem'
                }}>
                  <span>Total:</span>
                  <span>{formatCurrency(totals.netAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <CreditCard size={16} />
              Payment Method
            </h3>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="credit">Credit</option>
            </select>
          </div>

          {/* Process Sale Button */}
          <button
            onClick={processSale}
            disabled={cart.length === 0 || loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: cart.length === 0 || loading ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: cart.length === 0 || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Processing...
              </>
            ) : (
              <>
                <Calculator size={16} />
                Process Sale {cart.length > 0 && `- ${formatCurrency(totals.netAmount)}`}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;