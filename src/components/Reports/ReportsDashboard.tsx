import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, FileText, Download, Calendar, Filter, ArrowLeft, Users, DollarSign, Package, ShoppingCart } from 'lucide-react';

const ReportsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [reportType, setReportType] = useState('financial');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Calculate date range based on selection
  const getDateRange = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    switch (dateRange) {
      case 'today':
        return {
          start: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          end: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
          label: 'Today'
        };
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return {
          start: weekStart,
          end: weekEnd,
          label: 'This Week'
        };
      case 'month':
        return {
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0),
          label: 'This Month'
        };
      case 'quarter':
        const quarterStart = Math.floor(currentMonth / 3) * 3;
        return {
          start: new Date(currentYear, quarterStart, 1),
          end: new Date(currentYear, quarterStart + 3, 0),
          label: 'This Quarter'
        };
      case 'year':
        return {
          start: new Date(currentYear, 0, 1),
          end: new Date(currentYear, 11, 31),
          label: 'This Year'
        };
      case 'custom':
        return {
          start: customStartDate ? new Date(customStartDate) : new Date(),
          end: customEndDate ? new Date(customEndDate) : new Date(),
          label: `${customStartDate || 'Today'} to ${customEndDate || 'Today'}`
        };
      default:
        return {
          start: new Date(currentYear, currentMonth, 1),
          end: new Date(currentYear, currentMonth + 1, 0),
          label: 'This Month'
        };
    }
  };

  const currentDateRange = getDateRange();

  // Generate sample data based on date range and report type
  const generateReportData = (reportName: string) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const { start, end } = currentDateRange;
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      switch (reportName) {
        case 'Daily Sales Summary':
          setReportData({
            type: 'sales',
            summary: {
              totalSales: daysDiff * 15000 + Math.random() * 5000,
              totalTransactions: daysDiff * 25 + Math.random() * 10,
              totalCustomers: daysDiff * 20 + Math.random() * 8,
              totalDiscounts: daysDiff * 500 + Math.random() * 200,
              averageTicket: 600 + Math.random() * 200
            },
            details: Array.from({ length: Math.min(daysDiff, 10) }, (_, i) => ({
              date: new Date(start.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
              sales: 12000 + Math.random() * 8000,
              transactions: 20 + Math.random() * 15,
              customers: 18 + Math.random() * 12,
              discounts: 400 + Math.random() * 300,
              seniorCitizenDiscount: 150 + Math.random() * 100,
              otherDiscount: 250 + Math.random() * 200
            }))
          });
          break;
          
        case 'Supplier-wise Medicine Report':
          setReportData({
            type: 'supplier',
            summary: {
              totalSuppliers: 5,
              totalMedicines: 150,
              totalPurchaseValue: daysDiff * 25000,
              totalCurrentValue: daysDiff * 35000,
              lowStockItems: 12
            },
            details: [
              {
                supplier: 'MediCorp Pharmaceuticals',
                contactPerson: 'Rajesh Kumar',
                phone: '+91-9876543210',
                gstin: '27ABCDE1234F1Z5',
                medicines: [
                  {
                    name: 'Paracetamol 500mg',
                    category: 'Analgesic',
                    batchNumber: 'PAR001',
                    expiryDate: '2025-12-31',
                    purchasePrice: 2.50,
                    sellingPrice: 3.50,
                    mrp: 4.00,
                    currentStock: 500,
                    minimumStock: 50,
                    totalPurchased: daysDiff * 100,
                    totalSold: daysDiff * 80,
                    gstRate: 12
                  },
                  {
                    name: 'Amoxicillin 250mg',
                    category: 'Antibiotic',
                    batchNumber: 'AMX002',
                    expiryDate: '2024-06-30',
                    purchasePrice: 8.00,
                    sellingPrice: 12.00,
                    mrp: 15.00,
                    currentStock: 15,
                    minimumStock: 20,
                    totalPurchased: daysDiff * 50,
                    totalSold: daysDiff * 45,
                    gstRate: 12
                  }
                ]
              },
              {
                supplier: 'HealthPlus Distributors',
                contactPerson: 'Priya Sharma',
                phone: '+91-9876543211',
                gstin: '07FGHIJ5678G2Y6',
                medicines: [
                  {
                    name: 'Cetirizine 10mg',
                    category: 'Antihistamine',
                    batchNumber: 'CET003',
                    expiryDate: '2025-08-15',
                    purchasePrice: 1.80,
                    sellingPrice: 2.50,
                    mrp: 3.00,
                    currentStock: 300,
                    minimumStock: 30,
                    totalPurchased: daysDiff * 120,
                    totalSold: daysDiff * 100,
                    gstRate: 12
                  }
                ]
              }
            ]
          });
          break;
          
        case 'GSTR-1 Report':
          setReportData({
            type: 'gstr1',
            summary: {
              totalB2BSales: daysDiff * 45000,
              totalB2CSales: daysDiff * 25000,
              totalCGST: daysDiff * 4200,
              totalSGST: daysDiff * 4200,
              totalIGST: daysDiff * 1400,
              totalTaxableValue: daysDiff * 70000
            },
            b2bTransactions: [
              {
                gstin: '27ABCDE1234F1Z5',
                partyName: 'ABC Hospital',
                invoiceNumber: 'INV-001',
                invoiceDate: start.toLocaleDateString('en-IN'),
                taxableValue: 10000,
                cgst: 600,
                sgst: 600,
                igst: 0,
                totalValue: 11200
              }
            ],
            b2cTransactions: [
              {
                description: 'Retail Sales - 12% GST',
                taxableValue: daysDiff * 20000,
                cgst: daysDiff * 1200,
                sgst: daysDiff * 1200,
                totalValue: daysDiff * 22400
              },
              {
                description: 'Retail Sales - 5% GST',
                taxableValue: daysDiff * 5000,
                cgst: daysDiff * 125,
                sgst: daysDiff * 125,
                totalValue: daysDiff * 5250
              }
            ]
          });
          break;
          
        default:
          setReportData({
            type: 'general',
            summary: {
              totalRevenue: daysDiff * 50000,
              totalExpenses: daysDiff * 30000,
              netProfit: daysDiff * 20000,
              profitMargin: 40
            }
          });
      }
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const downloadCSV = (reportName: string) => {
    if (!reportData) return;
    
    let csvContent = `${reportName}\nPeriod: ${currentDateRange.label}\nGenerated: ${new Date().toLocaleString('en-IN')}\n\n`;
    
    if (reportData.type === 'sales') {
      csvContent += 'Date,Sales Amount,Transactions,Customers,Total Discounts,Senior Citizen Discount,Other Discount\n';
      reportData.details.forEach((row: any) => {
        csvContent += `${row.date},${row.sales},${row.transactions},${row.customers},${row.discounts},${row.seniorCitizenDiscount},${row.otherDiscount}\n`;
      });
    } else if (reportData.type === 'supplier') {
      csvContent += 'Supplier,Contact Person,Phone,GSTIN,Medicine,Category,Purchase Price,Selling Price,MRP,Current Stock,Min Stock,Total Purchased,Total Sold,GST Rate\n';
      reportData.details.forEach((supplier: any) => {
        supplier.medicines.forEach((medicine: any) => {
          csvContent += `${supplier.supplier},${supplier.contactPerson},${supplier.phone},${supplier.gstin},${medicine.name},${medicine.category},${medicine.purchasePrice},${medicine.sellingPrice},${medicine.mrp},${medicine.currentStock},${medicine.minimumStock},${medicine.totalPurchased},${medicine.totalSold},${medicine.gstRate}%\n`;
        });
      });
    } else if (reportData.type === 'gstr1') {
      csvContent += 'Transaction Type,Party Name,GSTIN,Invoice Number,Invoice Date,Taxable Value,CGST,SGST,IGST,Total Value\n';
      reportData.b2bTransactions.forEach((txn: any) => {
        csvContent += `B2B,${txn.partyName},${txn.gstin},${txn.invoiceNumber},${txn.invoiceDate},${txn.taxableValue},${txn.cgst},${txn.sgst},${txn.igst},${txn.totalValue}\n`;
      });
      reportData.b2cTransactions.forEach((txn: any) => {
        csvContent += `B2C,${txn.description},,,,${txn.taxableValue},${txn.cgst},${txn.sgst},0,${txn.totalValue}\n`;
      });
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_${currentDateRange.label.replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderReportContent = () => {
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

    if (!reportData) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          <FileText size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
          <p>Select a report to view data</p>
        </div>
      );
    }

    if (reportData.type === 'sales') {
      return (
        <div>
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Sales
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {formatCurrency(reportData.summary.totalSales)}
                  </p>
                </div>
                <DollarSign size={24} style={{ color: '#10b981' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Transactions
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {Math.round(reportData.summary.totalTransactions)}
                  </p>
                </div>
                <ShoppingCart size={24} style={{ color: '#3b82f6' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Customers
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {Math.round(reportData.summary.totalCustomers)}
                  </p>
                </div>
                <Users size={24} style={{ color: '#8b5cf6' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Discounts
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {formatCurrency(reportData.summary.totalDiscounts)}
                  </p>
                </div>
                <Package size={24} style={{ color: '#f59e0b' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Average Ticket
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                    {formatCurrency(reportData.summary.averageTicket)}
                  </p>
                </div>
                <TrendingUp size={24} style={{ color: '#ef4444' }} />
              </div>
            </div>
          </div>

          {/* Detailed Table */}
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
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Date</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Sales Amount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Transactions</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Customers</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Senior Discount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Other Discount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Total Discount</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.details.map((row: any, index: number) => (
                    <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem' }}>{row.date}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>
                        {formatCurrency(row.sales)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{Math.round(row.transactions)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{Math.round(row.customers)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b' }}>
                        {formatCurrency(row.seniorCitizenDiscount)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', color: '#8b5cf6' }}>
                        {formatCurrency(row.otherDiscount)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500', color: '#ef4444' }}>
                        {formatCurrency(row.discounts)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (reportData.type === 'supplier') {
      return (
        <div>
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Suppliers
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {reportData.summary.totalSuppliers}
                  </p>
                </div>
                <Users size={24} style={{ color: '#3b82f6' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Medicines
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {reportData.summary.totalMedicines}
                  </p>
                </div>
                <Package size={24} style={{ color: '#10b981' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Purchase Value
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {formatCurrency(reportData.summary.totalPurchaseValue)}
                  </p>
                </div>
                <ShoppingCart size={24} style={{ color: '#f59e0b' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Current Value
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {formatCurrency(reportData.summary.totalCurrentValue)}
                  </p>
                </div>
                <DollarSign size={24} style={{ color: '#8b5cf6' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Low Stock Items
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                    {reportData.summary.lowStockItems}
                  </p>
                </div>
                <TrendingUp size={24} style={{ color: '#ef4444' }} />
              </div>
            </div>
          </div>

          {/* Supplier Details */}
          {reportData.details.map((supplier: any, supplierIndex: number) => (
            <div key={supplierIndex} style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              marginBottom: '1.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {supplier.supplier}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Contact Person: </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{supplier.contactPerson}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Phone: </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{supplier.phone}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>GSTIN: </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{supplier.gstin}</span>
                  </div>
                </div>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f3f4f6' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Medicine</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Category</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Batch/Expiry</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Purchase Price</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Selling Price</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>MRP</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Stock</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Purchased</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Sold</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.medicines.map((medicine: any, medicineIndex: number) => (
                      <tr key={medicineIndex} style={{ borderTop: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.75rem' }}>
                          <div>
                            <div style={{ fontWeight: '500' }}>{medicine.name}</div>
                            {medicine.currentStock <= medicine.minimumStock && (
                              <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
                                ⚠️ Low Stock
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem' }}>{medicine.category}</td>
                        <td style={{ padding: '0.75rem' }}>
                          <div style={{ fontSize: '0.875rem' }}>
                            <div>{medicine.batchNumber}</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{medicine.expiryDate}</div>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{medicine.purchasePrice.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>₹{medicine.sellingPrice.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>₹{medicine.mrp.toFixed(2)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <span style={{ 
                            color: medicine.currentStock <= medicine.minimumStock ? '#ef4444' : '#10b981',
                            fontWeight: '500'
                          }}>
                            {medicine.currentStock}/{medicine.minimumStock}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{medicine.totalPurchased}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{medicine.totalSold}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{medicine.gstRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (reportData.type === 'gstr1') {
      return (
        <div>
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total Taxable Value
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                    {formatCurrency(reportData.summary.totalTaxableValue)}
                  </p>
                </div>
                <DollarSign size={24} style={{ color: '#3b82f6' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total CGST
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                    {formatCurrency(reportData.summary.totalCGST)}
                  </p>
                </div>
                <TrendingUp size={24} style={{ color: '#10b981' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total SGST
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {formatCurrency(reportData.summary.totalSGST)}
                  </p>
                </div>
                <Package size={24} style={{ color: '#f59e0b' }} />
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
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Total IGST
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {formatCurrency(reportData.summary.totalIGST)}
                  </p>
                </div>
                <ShoppingCart size={24} style={{ color: '#8b5cf6' }} />
              </div>
            </div>
          </div>

          {/* B2B Transactions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            marginBottom: '1.5rem',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>B2B Transactions</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Party Name</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>GSTIN</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Invoice</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Taxable Value</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>CGST</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>SGST</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>IGST</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.b2bTransactions.map((txn: any, index: number) => (
                    <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem' }}>{txn.partyName}</td>
                      <td style={{ padding: '0.75rem' }}>{txn.gstin}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <div>
                          <div>{txn.invoiceNumber}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{txn.invoiceDate}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(txn.taxableValue)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(txn.cgst)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(txn.sgst)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(txn.igst)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(txn.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* B2C Transactions */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>B2C Transactions</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f3f4f6' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '500' }}>Description</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Taxable Value</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>CGST</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>SGST</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '500' }}>Total Value</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.b2cTransactions.map((txn: any, index: number) => (
                    <tr key={index} style={{ borderTop: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem' }}>{txn.description}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(txn.taxableValue)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(txn.cgst)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>{formatCurrency(txn.sgst)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>{formatCurrency(txn.totalValue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Report data will be displayed here</p>
      </div>
    );
  };

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
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                {selectedReport}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                Period: {currentDateRange.label} | Generated: {new Date().toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Date Selection in Report View */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Calendar size={16} style={{ color: '#6b7280' }} />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  if (selectedReport) {
                    generateReportData(selectedReport);
                  }
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
                      if (selectedReport && customEndDate) {
                        generateReportData(selectedReport);
                      }
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
                      if (selectedReport && customStartDate) {
                        generateReportData(selectedReport);
                      }
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
              onClick={() => downloadCSV(selectedReport)}
              disabled={!reportData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: reportData ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: reportData ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              <Download size={16} />
              Download CSV
            </button>
          </div>
        </div>

        {renderReportContent()}
      </div>
    );
  }

  // Sample report data
  const financialData = {
    revenue: 950000,
    expenses: 576000,
    profit: 374000,
    profitMargin: 39.4,
    totalTransactions: 1250,
    averageTransaction: 760,
    totalCustomers: 890,
    repeatCustomers: 340
  };

  const salesData = {
    totalSales: 320000,
    prescriptionSales: 240000,
    otcSales: 80000,
    averageTicket: 850,
    totalDiscounts: 15000,
    seniorCitizenDiscounts: 8000,
    otherDiscounts: 7000,
    totalTransactions: 376
  };

  const inventoryData = {
    totalItems: 150,
    lowStock: 12,
    expiring: 5,
    turnoverRate: 4.2,
    totalPurchaseValue: 450000,
    currentInventoryValue: 380000,
    totalSuppliers: 8,
    activeSuppliers: 6
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
      title: 'GST & Compliance',
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
            Period: {currentDateRange.label}
          </div>
        </div>
      </div>

      {/* Key Metrics with Enhanced Totals */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <div>Transactions: {financialData.totalTransactions}</div>
            <div>Avg: {formatCurrency(financialData.averageTransaction)}</div>
            <div>Customers: {financialData.totalCustomers}</div>
            <div>Repeat: {financialData.repeatCustomers}</div>
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
              <BarChart3 size={20} style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <div>Margin: {financialData.profitMargin}%</div>
            <div>Expenses: {formatCurrency(financialData.expenses)}</div>
            <div>Revenue: {formatCurrency(financialData.revenue)}</div>
            <div>Growth: +12.5%</div>
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
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <div>Prescription: {formatCurrency(salesData.prescriptionSales)}</div>
            <div>OTC: {formatCurrency(salesData.otcSales)}</div>
            <div>Discounts: {formatCurrency(salesData.totalDiscounts)}</div>
            <div>Avg Ticket: {formatCurrency(salesData.averageTicket)}</div>
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
                {formatCurrency(inventoryData.currentInventoryValue)}
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
              <FileText size={20} style={{ color: '#8b5cf6' }} />
            </div>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <div>Purchase: {formatCurrency(inventoryData.totalPurchaseValue)}</div>
            <div>Turnover: {inventoryData.turnoverRate}x</div>
            <div>Low Stock: {inventoryData.lowStock}</div>
            <div>Suppliers: {inventoryData.activeSuppliers}/{inventoryData.totalSuppliers}</div>
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
                    onClick={() => {
                      setSelectedReport(report);
                      generateReportData(report);
                    }}
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

      {/* Quick Analytics */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#374151'
        }}>
          Quick Analytics - {currentDateRange.label}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Top Selling Medicine
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Paracetamol 500mg
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              1,250 units sold
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Peak Sales Hour
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              2:00 PM - 4:00 PM
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              35% of daily sales
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Most Active Doctor
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              Dr. Rajesh Kumar
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              145 consultations
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '0.375rem',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.5rem'
            }}>
              Payment Method
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              UPI (45%)
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              Most preferred
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;