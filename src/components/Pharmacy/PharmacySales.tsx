import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Receipt, User, Calendar, CreditCard, Filter, Printer, Download } from 'lucide-react';
import { getPharmacySales, getPharmacySale } from '../../services/supabaseApi';

interface SaleItem {
  id: string;
  medicine_name: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
}

interface Sale {
  id: string;
  sale_number: string;
  patient_name?: string;
  sale_date: string;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  net_amount: number;
  payment_method: string;
  payment_status: string;
  items: SaleItem[];
  notes?: string;
}

const PharmacySales: React.FC = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showSaleDetails, setShowSaleDetails] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await getPharmacySales();
      
      // Transform data to match our interface
      const formattedSales = data.map((sale: any) => {
        let patientName = 'Walk-in Customer';
        if (sale.patients) {
          patientName = `${sale.patients.first_name} ${sale.patients.last_name}`;
        } else if (sale.notes) {
          const customerMatch = sale.notes.match(/Customer: ([^,]+)/);
          if (customerMatch && customerMatch[1] !== 'Walk-in') {
            patientName = customerMatch[1];
          }
        }
        
        return {
          id: sale.id,
          sale_number: sale.sale_number,
          patient_name: patientName,
          sale_date: sale.sale_date,
          total_amount: sale.total_amount,
          discount_amount: sale.discount_amount,
          tax_amount: sale.tax_amount,
          net_amount: sale.net_amount,
          payment_method: sale.payment_method,
          payment_status: sale.payment_status,
          items: sale.pharmacy_sale_items?.map((item: any) => ({
            id: item.id,
            medicine_name: item.medicines?.name || 'Unknown Medicine',
            quantity: item.quantity,
            unit_price: item.unit_price,
            discount_amount: item.discount_amount,
            tax_amount: item.tax_amount,
            total_amount: item.total_amount
          })) || [],
          notes: sale.notes
        };
      });
      
      setSales(formattedSales);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch sales. Please try again later.');
      console.error('Error fetching sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const viewSaleDetails = async (saleId: string) => {
    try {
      setLoading(true);
      
      // First check if we already have the sale details with items
      const existingSale = sales.find(s => s.id === saleId);
      if (existingSale && existingSale.items && existingSale.items.length > 0) {
        setSelectedSale(existingSale);
        setShowSaleDetails(true);
        setLoading(false);
        return;
      }
      
      // Otherwise fetch the full details
      const saleData = await getPharmacySale(saleId);
      
      // Transform to our interface
      let patientName = 'Walk-in Customer';
      if (saleData.patients) {
        patientName = `${saleData.patients.first_name} ${saleData.patients.last_name}`;
      } else if (saleData.notes) {
        const customerMatch = saleData.notes.match(/Customer: ([^,]+)/);
        if (customerMatch && customerMatch[1] !== 'Walk-in') {
          patientName = customerMatch[1];
        }
      }
      
      const formattedSale = {
        id: saleData.id,
        sale_number: saleData.sale_number,
        patient_name: patientName,
        sale_date: saleData.sale_date,
        total_amount: saleData.total_amount,
        discount_amount: saleData.discount_amount,
        tax_amount: saleData.tax_amount,
        net_amount: saleData.net_amount,
        payment_method: saleData.payment_method,
        payment_status: saleData.payment_status,
        items: saleData.pharmacy_sale_items?.map((item: any) => ({
          id: item.id,
          medicine_name: item.medicines?.name || 'Unknown Medicine',
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount_amount: item.discount_amount,
          tax_amount: item.tax_amount,
          total_amount: item.total_amount
        })) || [],
        notes: saleData.notes
      };
      
      setSelectedSale(formattedSale);
      setShowSaleDetails(true);
    } catch (err: any) {
      setError('Failed to fetch sale details. Please try again later.');
      console.error('Error fetching sale details:', err);
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = (sale: Sale) => {
    const receiptWindow = window.open('', '_blank', 'width=800,height=600');
    if (!receiptWindow) {
      alert('Please allow pop-ups to print receipt');
      return;
    }

    // Extract customer info from notes if available
    let customerName = sale.patient_name || 'Walk-in Customer';
    let customerPhone = '';
    let customerAge = '';
    
    if (sale.notes) {
      const phoneMatch = sale.notes.match(/Phone: ([^,]+)/);
      if (phoneMatch && phoneMatch[1] !== 'N/A') {
        customerPhone = phoneMatch[1];
      }
      
      const ageMatch = sale.notes.match(/Age: ([^,]+)/);
      if (ageMatch && ageMatch[1] !== 'N/A') {
        customerAge = ageMatch[1];
      }
    }
    
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
              <div><strong>Receipt #:</strong> ${sale.sale_number}</div>
              <div><strong>Date:</strong> ${new Date(sale.sale_date).toLocaleDateString()}</div>
              <div><strong>Time:</strong> ${new Date(sale.sale_date).toLocaleTimeString()}</div>
            </div>
            <div>
              <div><strong>Customer:</strong> ${customerName}</div>
              ${customerPhone ? `<div><strong>Phone:</strong> ${customerPhone}</div>` : ''}
              ${customerAge ? `<div><strong>Age:</strong> ${customerAge}</div>` : ''}
            </div>
          </div>
          
          <table class="items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.medicine_name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unit_price.toFixed(2)}</td>
                  <td>${item.total_amount.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${sale.total_amount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Discount:</span>
              <span>-${sale.discount_amount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>GST:</span>
              <span>${sale.tax_amount.toFixed(2)}</span>
            </div>
            <div class="total-row grand-total">
              <span>TOTAL:</span>
              <span>${sale.net_amount.toFixed(2)}</span>
            </div>
            <div class="total-row">
              <span>Payment Method:</span>
              <span>${sale.payment_method.toUpperCase()}</span>
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return { bg: '#d1fae5', text: '#065f46' };
      case 'card':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'upi':
        return { bg: '#fef3c7', text: '#92400e' };
      case 'credit':
        return { bg: '#fee2e2', text: '#991b1b' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch = searchTerm === '' ||
      sale.sale_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateFilter === '' || 
      new Date(sale.sale_date).toLocaleDateString().includes(dateFilter);
    
    const matchesPayment = paymentFilter === '' || 
      sale.payment_method === paymentFilter;
    
    return matchesSearch && matchesDate && matchesPayment;
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.net_amount, 0);

  // Sale details view
  if (showSaleDetails && selectedSale) {
    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Sale Details</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => printReceipt(selectedSale)}
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
              <Printer size={16} />
              Print Receipt
            </button>
            <button
              onClick={() => setShowSaleDetails(false)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Back to Sales
            </button>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280' }}>
                Sale Information
              </h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Sale Number:</span> {selectedSale.sale_number}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Date:</span> {new Date(selectedSale.sale_date).toLocaleDateString()}
              </div>
              <div>
                <span style={{ fontWeight: '500' }}>Time:</span> {new Date(selectedSale.sale_date).toLocaleTimeString()}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280' }}>
                Customer Information
              </h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Name:</span> {selectedSale.patient_name}
              </div>
              {selectedSale.notes && (
                <>
                  {selectedSale.notes.includes('Phone:') && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '500' }}>Phone:</span> {
                        selectedSale.notes.match(/Phone: ([^,]+)/)
                          ? selectedSale.notes.match(/Phone: ([^,]+)/)![1]
                          : 'N/A'
                      }
                    </div>
                  )}
                  {selectedSale.notes.includes('Age:') && (
                    <div>
                      <span style={{ fontWeight: '500' }}>Age:</span> {
                        selectedSale.notes.match(/Age: ([^,]+)/)
                          ? selectedSale.notes.match(/Age: ([^,]+)/)![1]
                          : 'N/A'
                      }
                    </div>
                  )}
                </>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280' }}>
                Payment Information
              </h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Method:</span>{' '}
                <span style={{
                  display: 'inline-flex',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  backgroundColor: getPaymentMethodColor(selectedSale.payment_method).bg,
                  color: getPaymentMethodColor(selectedSale.payment_method).text,
                  textTransform: 'uppercase'
                }}>
                  {selectedSale.payment_method}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: '500' }}>Status:</span> {selectedSale.payment_status}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#6b7280' }}>
                Amount Information
              </h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Subtotal:</span> {formatCurrency(selectedSale.total_amount)}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Discount:</span> {formatCurrency(selectedSale.discount_amount)}
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Tax:</span> {formatCurrency(selectedSale.tax_amount)}
              </div>
              <div>
                <span style={{ fontWeight: '500' }}>Total:</span> {formatCurrency(selectedSale.net_amount)}
              </div>
            </div>
          </div>

          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Items
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>
                    Medicine
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>
                    Quantity
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>
                    Unit Price
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>
                    Discount
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>
                    Tax
                  </th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.items.map((item) => (
                  <tr key={item.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                      {item.medicine_name}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                      {formatCurrency(item.discount_amount)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                      {formatCurrency(item.tax_amount)}
                    </td>
                    <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>
                      {formatCurrency(item.total_amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{ backgroundColor: '#f9fafb' }}>
                <tr>
                  <td colSpan={5} style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>
                    Grand Total:
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>
                    {formatCurrency(selectedSale.net_amount)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Pharmacy Sales</h1>
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
          <Plus size={16} />
          New Sale
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
                Total Sales
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#10b981'
              }}>
                {formatCurrency(totalSales)}
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
              <Receipt size={20} style={{ color: '#10b981' }} />
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
                Total Transactions
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#3b82f6'
              }}>
                {filteredSales.length}
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
              <CreditCard size={20} style={{ color: '#3b82f6' }} />
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
              placeholder="Search by sale number or customer name..."
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
          
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            style={{
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            <option value="">All Payments</option>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="upi">UPI</option>
            <option value="credit">Credit</option>
          </select>
        </div>
      </div>

      {/* Sales List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredSales.length === 0 ? (
          <div style={{
            padding: '3rem',
            textAlign: 'center'
          }}>
            <Receipt size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              No sales found matching your criteria.
            </p>
          </div>
        ) : (
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
                    Sale Details
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
                    Customer
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
                    Date & Time
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
                {filteredSales.map((sale) => {
                  const paymentColors = getPaymentMethodColor(sale.payment_method);
                  return (
                    <tr key={sale.id} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem'
                          }}>
                            <Receipt size={14} style={{ color: '#6b7280' }} />
                            <span style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#111827'
                            }}>
                              {sale.sale_number}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            {sale.items.length} item(s)
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
                            {sale.patient_name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.25rem'
                          }}>
                            <Calendar size={14} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                              {new Date(sale.sale_date).toLocaleDateString('en-IN')}
                            </span>
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            {new Date(sale.sale_date).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div>
                          <div style={{
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            color: '#111827'
                          }}>
                            {formatCurrency(sale.net_amount)}
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}>
                            Tax: {formatCurrency(sale.tax_amount)}
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
                          backgroundColor: paymentColors.bg,
                          color: paymentColors.text,
                          textTransform: 'uppercase'
                        }}>
                          {sale.payment_method}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => viewSaleDetails(sale.id)}
                            style={{
                              padding: '0.25rem',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              color: '#3b82f6'
                            }}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => printReceipt(sale)}
                            style={{
                              padding: '0.25rem',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              color: '#10b981'
                            }}
                            title="Print Receipt"
                          >
                            <Printer size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacySales;