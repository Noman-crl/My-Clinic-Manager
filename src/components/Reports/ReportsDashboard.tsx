import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, FileText, Download, Calendar, Filter, Users, Package, DollarSign, Eye } from 'lucide-react';

const ReportsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportType, setReportType] = useState('financial');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  // Sample report data with totals
  const financialData = {
    revenue: 950000,
    expenses: 576000,
    profit: 374000,
    profitMargin: 39.4,
    totalTransactions: 1247,
    averageTransaction: 762
  };

  const salesData = {
    totalSales: 320000,
    prescriptionSales: 240000,
    otcSales: 80000,
    averageTicket: 850,
    totalCustomers: 376,
    totalDiscounts: 15600
  };

  const inventoryData = {
    totalItems: 150,
    lowStock: 12,
    expiring: 5,
    turnoverRate: 4.2,
    totalValue: 2850000,
    purchaseValue: 1920000
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getDateRangeText = () => {
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
      case 'custom':
        if (customStartDate && customEndDate) {
          return `${new Date(customStartDate).toLocaleDateString('en-IN')} - ${new Date(customEndDate).toLocaleDateString('en-IN')}`;
        }
        return 'Custom Range';
      default:
        return 'This Month';
    }
  };

  const generateReport = (reportName: string) => {
    // Simulate report generation based on selected date range
    const baseData = {
      dateRange: getDateRangeText(),
      generatedAt: new Date().toLocaleString('en-IN'),
      period: dateRange
    };

    switch (reportName) {
      case 'Sales Report with Discounts':
        setReportData({
          ...baseData,
          title: 'Sales Report with Discounts',
          data: [
            {
              saleId: 'SAL-000001',
              date: '2024-01-15',
              patientName: 'Rajesh Kumar',
              age: 65,
              items: [
                { name: 'Paracetamol 500mg', qty: 10, price: 35.00, discount: 1.75 },
                { name: 'Vitamin D3', qty: 1, price: 22.00, discount: 1.10 }
              ],
              subtotal: 57.00,
              seniorDiscount: 2.85,
              manualDiscount: 0,
              totalDiscount: 2.85,
              discountPercent: 5.0,
              tax: 6.84,
              total: 60.99,
              paymentMethod: 'UPI'
            },
            {
              saleId: 'SAL-000002',
              date: '2024-01-15',
              patientName: 'Priya Sharma',
              age: 35,
              items: [
                { name: 'Cough Syrup', qty: 1, price: 65.00, discount: 3.25 },
                { name: 'Amoxicillin 250mg', qty: 20, price: 240.00, discount: 12.00 }
              ],
              subtotal: 305.00,
              seniorDiscount: 0,
              manualDiscount: 15.25,
              totalDiscount: 15.25,
              discountPercent: 5.0,
              tax: 34.77,
              total: 324.52,
              paymentMethod: 'Cash'
            }
          ],
          summary: {
            totalSales: 385.51,
            totalDiscount: 18.10,
            averageDiscount: 4.7,
            seniorDiscounts: 2.85,
            manualDiscounts: 15.25,
            totalTax: 41.61,
            netAmount: 385.51
          }
        });
        break;

      case 'Supplier-wise Medicine Report':
        setReportData({
          ...baseData,
          title: 'Supplier-wise Medicine Report',
          data: [
            {
              supplier: {
                name: 'MediCorp Pharmaceuticals',
                contact: 'Rajesh Kumar',
                gstin: '27ABCDE1234F1Z5',
                phone: '+91-9876543210'
              },
              medicines: [
                {
                  name: 'Paracetamol 500mg',
                  category: 'Analgesic',
                  batch: 'PAR001',
                  expiry: '2025-12-31',
                  purchasePrice: 2.50,
                  sellingPrice: 3.50,
                  mrp: 4.00,
                  currentStock: 500,
                  minStock: 50,
                  totalPurchased: 1000,
                  totalSold: 500,
                  currentValue: 1750.00,
                  gstRate: 12
                },
                {
                  name: 'Vitamin D3 60K',
                  category: 'Vitamin',
                  batch: 'VIT003',
                  expiry: '2025-08-15',
                  purchasePrice: 15.00,
                  sellingPrice: 22.00,
                  mrp: 25.00,
                  currentStock: 100,
                  minStock: 10,
                  totalPurchased: 200,
                  totalSold: 100,
                  currentValue: 2200.00,
                  gstRate: 12
                }
              ],
              totals: {
                totalMedicines: 2,
                totalPurchaseValue: 18000.00,
                totalCurrentValue: 3950.00,
                totalSoldValue: 5700.00,
                lowStockItems: 0
              }
            },
            {
              supplier: {
                name: 'HealthPlus Distributors',
                contact: 'Priya Sharma',
                gstin: '07FGHIJ5678G2Y6',
                phone: '+91-9876543211'
              },
              medicines: [
                {
                  name: 'Amoxicillin 250mg',
                  category: 'Antibiotic',
                  batch: 'AMX002',
                  expiry: '2024-06-30',
                  purchasePrice: 8.00,
                  sellingPrice: 12.00,
                  mrp: 15.00,
                  currentStock: 15,
                  minStock: 20,
                  totalPurchased: 100,
                  totalSold: 85,
                  currentValue: 180.00,
                  gstRate: 12
                }
              ],
              totals: {
                totalMedicines: 1,
                totalPurchaseValue: 800.00,
                totalCurrentValue: 180.00,
                totalSoldValue: 1020.00,
                lowStockItems: 1
              }
            }
          ],
          grandTotal: {
            totalSuppliers: 2,
            totalMedicines: 3,
            totalPurchaseValue: 18800.00,
            totalCurrentValue: 4130.00,
            totalSoldValue: 6720.00,
            totalLowStockItems: 1
          }
        });
        break;

      case 'GSTR-1 Report':
        setReportData({
          ...baseData,
          title: 'GSTR-1 Report (GST Sales Return)',
          data: {
            gstin: '27ABCDE1234F1Z5',
            legalName: 'Ultimate Clinic Pvt Ltd',
            tradeName: 'Ultimate Clinic',
            period: 'January 2024',
            b2b: [
              {
                gstin: '27XYZAB1234C1Z5',
                invoices: [
                  {
                    invoiceNo: 'INV-2024-001',
                    date: '2024-01-15',
                    value: 1180.00,
                    pos: '27',
                    reverseCharge: 'N',
                    invoiceType: 'Regular',
                    rate: 12,
                    taxableValue: 1000.00,
                    igstAmount: 0,
                    cgstAmount: 60.00,
                    sgstAmount: 60.00,
                    cessAmount: 0
                  }
                ]
              }
            ],
            b2c: [
              {
                pos: '27',
                rate: 12,
                taxableValue: 25000.00,
                igstAmount: 0,
                cgstAmount: 1500.00,
                sgstAmount: 1500.00,
                cessAmount: 0
              },
              {
                pos: '27',
                rate: 5,
                taxableValue: 5000.00,
                igstAmount: 0,
                cgstAmount: 125.00,
                sgstAmount: 125.00,
                cessAmount: 0
              }
            ],
            summary: {
              totalTaxableValue: 31000.00,
              totalIgst: 0,
              totalCgst: 1685.00,
              totalSgst: 1685.00,
              totalCess: 0,
              totalTax: 3370.00,
              totalInvoiceValue: 34370.00
            }
          }
        });
        break;

      default:
        setReportData({
          ...baseData,
          title: reportName,
          message: 'Report data will be displayed here'
        });
    }

    setSelectedReport(reportName);
  };

  const downloadReport = (format: string) => {
    if (!reportData) return;

    if (format === 'csv') {
      let csvContent = '';
      
      if (reportData.title === 'Sales Report with Discounts') {
        csvContent = 'Sale ID,Date,Patient,Age,Subtotal,Senior Discount,Manual Discount,Total Discount,Tax,Total,Payment Method\n';
        reportData.data.forEach((sale: any) => {
          csvContent += `${sale.saleId},${sale.date},${sale.patientName},${sale.age},${sale.subtotal},${sale.seniorDiscount},${sale.manualDiscount},${sale.totalDiscount},${sale.tax},${sale.total},${sale.paymentMethod}\n`;
        });
      } else if (reportData.title === 'Supplier-wise Medicine Report') {
        csvContent = 'Supplier,Medicine,Category,Purchase Price,Selling Price,Current Stock,Min Stock,Current Value\n';
        reportData.data.forEach((supplier: any) => {
          supplier.medicines.forEach((medicine: any) => {
            csvContent += `${supplier.supplier.name},${medicine.name},${medicine.category},${medicine.purchasePrice},${medicine.sellingPrice},${medicine.currentStock},${medicine.minStock},${medicine.currentValue}\n`;
          });
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportData.title.replace(/\s+/g, '_')}_${dateRange}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
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
        'GSTR-1 Report'
      ]
    },
    {
      title: 'Sales Reports',
      icon: TrendingUp,
      color: '#10b981',
      reports: [
        'Sales Report with Discounts',
        'Daily Sales Summary',
        'Medicine-wise Sales',
        'Doctor-wise Prescriptions',
        'Payment Method Analysis'
      ]
    },
    {
      title: 'Inventory Reports',
      icon: PieChart,
      color: '#f59e0b',
      reports: [
        'Supplier-wise Medicine Report',
        'Stock Level Report',
        'Expiry Analysis',
        'Purchase Analysis',
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

  if (selectedReport && reportData) {
    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <button
              onClick={() => {
                setSelectedReport(null);
                setReportData(null);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                marginBottom: '0.5rem'
              }}
            >
              ← Back to Reports
            </button>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              {reportData.title}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Period: {reportData.dateRange} | Generated: {reportData.generatedAt}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Date Selection in Report View */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Calendar size={16} style={{ color: '#6b7280' }} />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  generateReport(selectedReport);
                }}
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
                <option value="custom">Custom Range</option>
              </select>
              
              {dateRange === 'custom' && (
                <>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value);
                      if (customEndDate) generateReport(selectedReport);
                    }}
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
                    onChange={(e) => {
                      setCustomEndDate(e.target.value);
                      if (customStartDate) generateReport(selectedReport);
                    }}
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
            
            <button
              onClick={() => downloadReport('csv')}
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
              Download CSV
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {reportData.title === 'Sales Report with Discounts' && (
            <div>
              {/* Summary Cards */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#374151'
                }}>
                  Sales Summary - {reportData.dateRange}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Total Sales
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                      {formatCurrency(reportData.summary.totalSales)}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Total Discounts
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>
                      {formatCurrency(reportData.summary.totalDiscount)}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Average Discount
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
                      {reportData.summary.averageDiscount}%
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Senior Discounts
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                      {formatCurrency(reportData.summary.seniorDiscounts)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Sales Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Sale Details
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Patient (Age)
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Subtotal
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Senior Discount
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Manual Discount
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Total Discount
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Tax
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Final Total
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.map((sale: any, index: number) => (
                      <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                              {sale.saleId}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {new Date(sale.date).toLocaleDateString('en-IN')}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                              {sale.patientName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Age: {sale.age} years
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                            {formatCurrency(sale.subtotal)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: sale.seniorDiscount > 0 ? '#8b5cf6' : '#6b7280' }}>
                            {sale.seniorDiscount > 0 ? `-${formatCurrency(sale.seniorDiscount)}` : '-'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '500', color: sale.manualDiscount > 0 ? '#ef4444' : '#6b7280' }}>
                            {sale.manualDiscount > 0 ? `-${formatCurrency(sale.manualDiscount)}` : '-'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ef4444' }}>
                            -{formatCurrency(sale.totalDiscount)} ({sale.discountPercent}%)
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                            {formatCurrency(sale.tax)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10b981' }}>
                            {formatCurrency(sale.total)}
                          </span>
                        </td>
                        <td style={{ padding: '1rem 0.75rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            borderRadius: '0.375rem',
                            backgroundColor: sale.paymentMethod === 'UPI' ? '#dbeafe' : '#d1fae5',
                            color: sale.paymentMethod === 'UPI' ? '#1e40af' : '#065f46'
                          }}>
                            {sale.paymentMethod}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportData.title === 'Supplier-wise Medicine Report' && (
            <div>
              {/* Grand Total Summary */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#374151'
                }}>
                  Supplier Summary - {reportData.dateRange}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem'
                }}>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Total Suppliers
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {reportData.grandTotal.totalSuppliers}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Total Medicines
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                      {reportData.grandTotal.totalMedicines}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Current Inventory Value
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
                      {formatCurrency(reportData.grandTotal.totalCurrentValue)}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'white',
                    padding: '1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      Low Stock Items
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>
                      {reportData.grandTotal.totalLowStockItems}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supplier Details */}
              <div style={{ padding: '1.5rem' }}>
                {reportData.data.map((supplier: any, index: number) => (
                  <div key={index} style={{
                    marginBottom: index < reportData.data.length - 1 ? '2rem' : 0,
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    overflow: 'hidden'
                  }}>
                    {/* Supplier Header */}
                    <div style={{
                      backgroundColor: '#f9fafb',
                      padding: '1rem',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div>
                          <h4 style={{
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '0.25rem'
                          }}>
                            {supplier.supplier.name}
                          </h4>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Contact: {supplier.supplier.contact} | GSTIN: {supplier.supplier.gstin}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            Current Value
                          </div>
                          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#10b981' }}>
                            {formatCurrency(supplier.totals.totalCurrentValue)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Medicines Table */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ backgroundColor: '#f3f4f6' }}>
                          <tr>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                              Medicine Details
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                              Batch & Expiry
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                              Purchase Price
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                              Selling Price
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                              Stock Status
                            </th>
                            <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280' }}>
                              Current Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {supplier.medicines.map((medicine: any, medIndex: number) => (
                            <tr key={medIndex} style={{ borderTop: '1px solid #f3f4f6' }}>
                              <td style={{ padding: '0.75rem' }}>
                                <div>
                                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                    {medicine.name}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    {medicine.category} | GST: {medicine.gstRate}%
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem' }}>
                                <div>
                                  <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                                    {medicine.batch}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    Exp: {new Date(medicine.expiry).toLocaleDateString('en-IN')}
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                                  {formatCurrency(medicine.purchasePrice)}
                                </span>
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                <div>
                                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                    {formatCurrency(medicine.sellingPrice)}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    MRP: {formatCurrency(medicine.mrp)}
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                <div>
                                  <div style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: medicine.currentStock <= medicine.minStock ? '#ef4444' : '#111827'
                                  }}>
                                    {medicine.currentStock}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                    Min: {medicine.minStock}
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>
                                  {formatCurrency(medicine.currentValue)}
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
            </div>
          )}

          {reportData.title === 'GSTR-1 Report (GST Sales Return)' && (
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.375rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  GST Return Summary
                </h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  GSTIN: {reportData.data.gstin} | Period: {reportData.data.period}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Total Taxable Value
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {formatCurrency(reportData.data.summary.totalTaxableValue)}
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Total CGST
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                    {formatCurrency(reportData.data.summary.totalCgst)}
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Total SGST
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {formatCurrency(reportData.data.summary.totalSgst)}
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Total Tax
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ef4444' }}>
                    {formatCurrency(reportData.data.summary.totalTax)}
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.375rem',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  This report is ready for GSTR-1 filing. Download as CSV for import into GST portal.
                </p>
              </div>
            </div>
          )}
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
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Reports & Analytics</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
          
          <div style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: '500'
          }}>
            Period: {getDateRangeText()}
          </div>
        </div>
      </div>

      {/* Key Metrics with Totals */}
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
            {financialData.totalTransactions} transactions | Avg: {formatCurrency(financialData.averageTransaction)}
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
            {salesData.totalCustomers} customers | Discounts: {formatCurrency(salesData.totalDiscounts)}
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
                Inventory Value
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#8b5cf6'
              }}>
                {formatCurrency(inventoryData.totalValue)}
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
              <Package size={20} style={{ color: '#8b5cf6' }} />
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {inventoryData.totalItems} items | Purchase: {formatCurrency(inventoryData.purchaseValue)}
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
              <DollarSign size={20} style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {financialData.profitMargin}% margin | Expenses: {formatCurrency(financialData.expenses)}
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
                      <Eye size={14} style={{ color: '#6b7280' }} />
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