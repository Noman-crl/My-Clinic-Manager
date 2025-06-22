import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, PieChart, TrendingUp, FileText, Download, Calendar, Filter, ArrowLeft, Loader } from 'lucide-react';

const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Generate realistic report data based on date range
  const generateReportData = (reportType: string, dateRange: string) => {
    const { startDate, endDate } = getDateRange();
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Base multipliers for different periods
    const multiplier = Math.max(1, Math.floor(daysDiff / 30));
    
    switch (reportType) {
      case 'Daily Sales Summary':
        return {
          summary: {
            totalSales: 45000 * multiplier + Math.floor(Math.random() * 10000),
            totalTransactions: 125 * multiplier + Math.floor(Math.random() * 50),
            totalCustomers: 98 * multiplier + Math.floor(Math.random() * 30),
            averageTicket: 360 + Math.floor(Math.random() * 100),
            totalDiscount: 2250 * multiplier + Math.floor(Math.random() * 1000),
            seniorCitizenDiscount: 1125 * multiplier + Math.floor(Math.random() * 500),
            otherDiscount: 1125 * multiplier + Math.floor(Math.random() * 500)
          },
          dailyBreakdown: Array.from({ length: Math.min(daysDiff, 31) }, (_, i) => ({
            date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
            sales: 1200 + Math.floor(Math.random() * 800),
            transactions: 3 + Math.floor(Math.random() * 8),
            customers: 2 + Math.floor(Math.random() * 6),
            discount: 60 + Math.floor(Math.random() * 120)
          }))
        };

      case 'Supplier-wise Medicine Report':
        return {
          suppliers: [
            {
              name: 'MediCorp Pharmaceuticals',
              contact: 'Rajesh Kumar - +91-9876543210',
              email: 'rajesh@medicorp.com',
              gstin: '27ABCDE1234F1Z5',
              medicines: [
                {
                  name: 'Paracetamol 500mg',
                  batch: 'PAR001',
                  stock: 500,
                  minStock: 50,
                  purchasePrice: 2.50,
                  sellingPrice: 3.50,
                  mrp: 4.00,
                  expiry: '2025-12-31',
                  gstRate: 12,
                  status: 'Good Stock'
                },
                {
                  name: 'Amoxicillin 250mg',
                  batch: 'AMX002',
                  stock: 15,
                  minStock: 20,
                  purchasePrice: 8.00,
                  sellingPrice: 12.00,
                  mrp: 15.00,
                  expiry: '2024-06-30',
                  gstRate: 12,
                  status: 'Low Stock'
                }
              ]
            },
            {
              name: 'HealthPlus Distributors',
              contact: 'Priya Sharma - +91-9876543211',
              email: 'priya@healthplus.com',
              gstin: '07FGHIJ5678G2Y6',
              medicines: [
                {
                  name: 'Cetirizine 10mg',
                  batch: 'CET003',
                  stock: 300,
                  minStock: 30,
                  purchasePrice: 1.80,
                  sellingPrice: 2.50,
                  mrp: 3.00,
                  expiry: '2025-08-15',
                  gstRate: 12,
                  status: 'Good Stock'
                },
                {
                  name: 'Vitamin D3 60K',
                  batch: 'VIT004',
                  stock: 8,
                  minStock: 10,
                  purchasePrice: 15.00,
                  sellingPrice: 22.00,
                  mrp: 25.00,
                  expiry: '2024-03-20',
                  gstRate: 12,
                  status: 'Low Stock'
                }
              ]
            }
          ]
        };

      case 'GSTR-1 Report':
        return {
          summary: {
            totalTaxableValue: 380000 * multiplier,
            totalCGST: 22800 * multiplier,
            totalSGST: 22800 * multiplier,
            totalIGST: 0,
            totalTax: 45600 * multiplier,
            totalInvoiceValue: 425600 * multiplier
          },
          b2bTransactions: [
            {
              gstin: '27ABCDE1234F1Z5',
              partyName: 'City Hospital',
              invoiceNo: 'INV-001',
              invoiceDate: '2024-01-15',
              taxableValue: 50000,
              cgst: 3000,
              sgst: 3000,
              igst: 0,
              total: 56000
            },
            {
              gstin: '24KLMNO9012H3X7',
              partyName: 'Metro Clinic',
              invoiceNo: 'INV-002',
              invoiceDate: '2024-01-16',
              taxableValue: 35000,
              cgst: 2100,
              sgst: 2100,
              igst: 0,
              total: 39200
            }
          ],
          b2cTransactions: {
            taxableValue: 295000 * multiplier,
            cgst: 17700 * multiplier,
            sgst: 17700 * multiplier,
            total: 330400 * multiplier
          }
        };

      default:
        return {
          message: 'Report data not available',
          period: getFormattedPeriod()
        };
    }
  };

  const getDateRange = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    switch (dateRange) {
      case 'today':
        return {
          startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)
        };
      case 'week':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59);
        return { startDate: startOfWeek, endDate: endOfWeek };
      case 'month':
        return {
          startDate: new Date(currentYear, today.getMonth(), 1),
          endDate: new Date(currentYear, today.getMonth() + 1, 0, 23, 59, 59)
        };
      case 'quarter':
        const quarterStart = Math.floor(today.getMonth() / 3) * 3;
        return {
          startDate: new Date(currentYear, quarterStart, 1),
          endDate: new Date(currentYear, quarterStart + 3, 0, 23, 59, 59)
        };
      case 'year':
        return {
          startDate: new Date(currentYear, 0, 1),
          endDate: new Date(currentYear, 11, 31, 23, 59, 59)
        };
      case 'financial-year':
        // Indian Financial Year: April 1 to March 31
        const fyStart = today.getMonth() >= 3 ? currentYear : currentYear - 1;
        return {
          startDate: new Date(fyStart, 3, 1), // April 1
          endDate: new Date(fyStart + 1, 2, 31, 23, 59, 59) // March 31
        };
      case 'custom':
        return {
          startDate: customStartDate ? new Date(customStartDate) : new Date(),
          endDate: customEndDate ? new Date(customEndDate) : new Date()
        };
      default:
        return {
          startDate: new Date(currentYear, today.getMonth(), 1),
          endDate: new Date(currentYear, today.getMonth() + 1, 0, 23, 59, 59)
        };
    }
  };

  const getFormattedPeriod = () => {
    const { startDate, endDate } = getDateRange();
    
    switch (dateRange) {
      case 'today':
        return 'Today';
      case 'week':
        return 'This Week';
      case 'month':
        return 'This Month';
      case 'quarter':
        return 'This Quarter';
      case 'year':
        return 'This Year';
      case 'financial-year':
        return 'This Financial Year';
      case 'custom':
        return `${startDate.toLocaleDateString('en-IN')} - ${endDate.toLocaleDateString('en-IN')}`;
      default:
        return 'This Month';
    }
  };

  const generateReport = async (reportType: string) => {
    setLoading(true);
    setSelectedReport(reportType);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = generateReportData(reportType, dateRange);
    setReportData(data);
    setLoading(false);
  };

  const downloadCSV = (reportType: string, data: any) => {
    let csvContent = '';
    
    switch (reportType) {
      case 'Daily Sales Summary':
        csvContent = 'Date,Sales,Transactions,Customers,Discount\n';
        data.dailyBreakdown.forEach((row: any) => {
          csvContent += `${row.date},${row.sales},${row.transactions},${row.customers},${row.discount}\n`;
        });
        break;
      case 'Supplier-wise Medicine Report':
        csvContent = 'Supplier,Medicine,Batch,Stock,Min Stock,Purchase Price,Selling Price,MRP,Expiry,GST Rate,Status\n';
        data.suppliers.forEach((supplier: any) => {
          supplier.medicines.forEach((medicine: any) => {
            csvContent += `${supplier.name},${medicine.name},${medicine.batch},${medicine.stock},${medicine.minStock},${medicine.purchasePrice},${medicine.sellingPrice},${medicine.mrp},${medicine.expiry},${medicine.gstRate}%,${medicine.status}\n`;
          });
        });
        break;
      case 'GSTR-1 Report':
        csvContent = 'GSTIN,Party Name,Invoice No,Invoice Date,Taxable Value,CGST,SGST,IGST,Total\n';
        data.b2bTransactions.forEach((txn: any) => {
          csvContent += `${txn.gstin},${txn.partyName},${txn.invoiceNo},${txn.invoiceDate},${txn.taxableValue},${txn.cgst},${txn.sgst},${txn.igst},${txn.total}\n`;
        });
        break;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType.replace(/\s+/g, '_')}_${getFormattedPeriod().replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
        'Supplier-wise Medicine Report',
        'ABC Analysis'
      ]
    },
    {
      title: 'Tax Reports',
      icon: FileText,
      color: '#8b5cf6',
      reports: [
        'GSTR-1 Report',
        'GSTR-3B Report',
        'TDS Report',
        'HSN Summary',
        'Tax Analysis'
      ]
    }
  ];

  if (selectedReport) {
    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => {
                setSelectedReport(null);
                setReportData(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <ArrowLeft size={16} />
              Back to Reports
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              {selectedReport}
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Calendar size={16} style={{ color: '#6b7280' }} />
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
              <option value="financial-year">This Financial Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            {dateRange === 'custom' && (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
                <span style={{ color: '#6b7280' }}>to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    outline: 'none'
                  }}
                />
              </>
            )}
            
            <button
              onClick={() => generateReport(selectedReport)}
              style={{
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
              Generate
            </button>
            
            {reportData && (
              <button
                onClick={() => downloadCSV(selectedReport, reportData)}
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
                <Download size={16} />
                Download CSV
              </button>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '1rem'
        }}>
          <p style={{
            fontSize: '0.875rem',
            color: '#6b7280',
            margin: 0
          }}>
            Period: {getFormattedPeriod()} | Generated: {new Date().toLocaleString('en-IN')}
          </p>
        </div>

        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Loader size={32} style={{ 
                color: '#3b82f6',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ color: '#6b7280' }}>Generating report...</p>
            </div>
          </div>
        ) : reportData ? (
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            {selectedReport === 'Daily Sales Summary' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Total Sales
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                      {formatCurrency(reportData.summary.totalSales)}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Total Transactions
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {reportData.summary.totalTransactions}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Total Discount
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                      {formatCurrency(reportData.summary.totalDiscount)}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Average Ticket
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                      {formatCurrency(reportData.summary.averageTicket)}
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Daily Breakdown
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Date</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Sales</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Transactions</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Customers</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Discount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.dailyBreakdown.map((row: any, index: number) => (
                        <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{row.date}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{formatCurrency(row.sales)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{row.transactions}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{row.customers}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{formatCurrency(row.discount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReport === 'Supplier-wise Medicine Report' && (
              <div>
                {reportData.suppliers.map((supplier: any, index: number) => (
                  <div key={index} style={{ marginBottom: '2rem' }}>
                    <div style={{
                      backgroundColor: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      marginBottom: '1rem'
                    }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        {supplier.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                        Contact: {supplier.contact} | Email: {supplier.email} | GSTIN: {supplier.gstin}
                      </p>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f9fafb' }}>
                          <tr>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Medicine</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Batch</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Stock</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Purchase Price</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Selling Price</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>MRP</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Expiry</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplier.medicines.map((medicine: any, medIndex: number) => (
                            <tr key={medIndex} style={{ borderTop: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{medicine.name}</td>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{medicine.batch}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                {medicine.stock}/{medicine.minStock}
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                ₹{medicine.purchasePrice}
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                ₹{medicine.sellingPrice}
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>
                                ₹{medicine.mrp}
                              </td>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{medicine.expiry}</td>
                              <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>
                                <span style={{
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500',
                                  backgroundColor: medicine.status === 'Low Stock' ? '#fee2e2' : '#d1fae5',
                                  color: medicine.status === 'Low Stock' ? '#991b1b' : '#065f46'
                                }}>
                                  {medicine.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedReport === 'GSTR-1 Report' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Total Taxable Value
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {formatCurrency(reportData.summary.totalTaxableValue)}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Total Tax
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
                      {formatCurrency(reportData.summary.totalTax)}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.375rem',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Total Invoice Value
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                      {formatCurrency(reportData.summary.totalInvoiceValue)}
                    </div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  B2B Transactions
                </h3>
                <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>GSTIN</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Party Name</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Invoice No</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Date</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Taxable Value</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>CGST</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>SGST</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.b2bTransactions.map((txn: any, index: number) => (
                        <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{txn.gstin}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{txn.partyName}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{txn.invoiceNo}</td>
                          <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{txn.invoiceDate}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{formatCurrency(txn.taxableValue)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{formatCurrency(txn.cgst)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{formatCurrency(txn.sgst)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem' }}>{formatCurrency(txn.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                  B2C Summary
                </h3>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Taxable Value</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600' }}>{formatCurrency(reportData.b2cTransactions.taxableValue)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>CGST</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600' }}>{formatCurrency(reportData.b2cTransactions.cgst)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>SGST</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600' }}>{formatCurrency(reportData.b2cTransactions.sgst)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total</div>
                      <div style={{ fontSize: '1rem', fontWeight: '600' }}>{formatCurrency(reportData.b2cTransactions.total)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            padding: '3rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <FileText size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Click "Generate" to create the report for the selected period.
            </p>
          </div>
        )}
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
            <option value="financial-year">This Financial Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {dateRange === 'custom' && (
            <>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <span style={{ color: '#6b7280' }}>to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </>
          )}
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
                    onClick={() => generateReport(report)}
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
    </div>
  );
};

export default ReportsDashboard;