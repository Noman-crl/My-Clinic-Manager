import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, FileText, Download, Calendar, Filter, Eye, IndianRupee, CalendarDays, Users } from 'lucide-react';

const ReportsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [reportType, setReportType] = useState('financial');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Sample report data
  const financialData = {
    revenue: 950000,
    expenses: 576000,
    profit: 374000,
    profitMargin: 39.4
  };

  const salesData = {
    totalSales: 320000,
    prescriptionSales: 240000,
    otcSales: 80000,
    averageTicket: 850
  };

  const inventoryData = {
    totalItems: 150,
    lowStock: 12,
    expiring: 5,
    turnoverRate: 4.2
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
    if (dateRange === 'custom' && customDateFrom && customDateTo) {
      return `From ${new Date(customDateFrom).toLocaleDateString('en-IN')} to ${new Date(customDateTo).toLocaleDateString('en-IN')}`;
    }
    
    const today = new Date();
    switch (dateRange) {
      case 'today':
        return `For ${today.toLocaleDateString('en-IN')}`;
      case 'week':
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        return `For the week starting ${weekStart.toLocaleDateString('en-IN')}`;
      case 'month':
        return `For ${today.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3) + 1;
        return `For Q${quarter} ${today.getFullYear()}`;
      case 'year':
        return `For the year ${today.getFullYear()}`;
      default:
        return `For ${dateRange}`;
    }
  };

  const generateReportData = (reportName: string) => {
    switch (reportName) {
      case 'Supplier-wise Medicine Report':
        return {
          title: 'Supplier-wise Medicine Report',
          period: getDateRangeText(),
          data: {
            suppliers: [
              {
                name: 'MediCorp Pharmaceuticals',
                contact: 'Rajesh Kumar',
                gstin: '27ABCDE1234F1Z5',
                medicines: [
                  {
                    name: 'Paracetamol 500mg',
                    category: 'Analgesic',
                    batchNo: 'PAR001',
                    expiryDate: '2025-12-31',
                    purchasePrice: 2.50,
                    sellingPrice: 3.50,
                    mrp: 4.00,
                    currentStock: 500,
                    minStock: 50,
                    totalPurchased: 1000,
                    totalSold: 500,
                    totalValue: 2500,
                    gstRate: 12
                  },
                  {
                    name: 'Amoxicillin 250mg',
                    category: 'Antibiotic',
                    batchNo: 'AMX002',
                    expiryDate: '2024-06-30',
                    purchasePrice: 8.00,
                    sellingPrice: 12.00,
                    mrp: 15.00,
                    currentStock: 200,
                    minStock: 20,
                    totalPurchased: 500,
                    totalSold: 300,
                    totalValue: 4000,
                    gstRate: 12
                  }
                ],
                totals: {
                  totalMedicines: 2,
                  totalPurchaseValue: 6500,
                  totalCurrentValue: 3500,
                  totalSoldValue: 5250
                }
              },
              {
                name: 'HealthPlus Distributors',
                contact: 'Priya Sharma',
                gstin: '07FGHIJ5678G2Y6',
                medicines: [
                  {
                    name: 'Cetirizine 10mg',
                    category: 'Antihistamine',
                    batchNo: 'CET003',
                    expiryDate: '2025-08-15',
                    purchasePrice: 1.80,
                    sellingPrice: 2.50,
                    mrp: 3.00,
                    currentStock: 300,
                    minStock: 30,
                    totalPurchased: 600,
                    totalSold: 300,
                    totalValue: 1080,
                    gstRate: 12
                  },
                  {
                    name: 'Vitamin D3 60K',
                    category: 'Vitamin',
                    batchNo: 'VIT004',
                    expiryDate: '2025-10-20',
                    purchasePrice: 15.00,
                    sellingPrice: 22.00,
                    mrp: 25.00,
                    currentStock: 100,
                    minStock: 10,
                    totalPurchased: 200,
                    totalSold: 100,
                    totalValue: 3000,
                    gstRate: 12
                  }
                ],
                totals: {
                  totalMedicines: 2,
                  totalPurchaseValue: 4080,
                  totalCurrentValue: 2040,
                  totalSoldValue: 2950
                }
              }
            ],
            grandTotals: {
              totalSuppliers: 2,
              totalMedicines: 4,
              totalPurchaseValue: 10580,
              totalCurrentValue: 5540,
              totalSoldValue: 8200
            }
          }
        };

      case 'Sales Report with Discounts':
        return {
          title: 'Sales Report with Discounts',
          period: getDateRangeText(),
          data: {
            sales: [
              {
                invoiceNo: 'SAL-000001',
                date: '2024-01-15',
                patientName: 'Rajesh Kumar',
                patientAge: 65,
                items: [
                  { medicine: 'Paracetamol 500mg', qty: 10, unitPrice: 3.50, discount: 5, discountAmount: 1.75, total: 33.25 }
                ],
                subtotal: 35.00,
                seniorDiscount: 5, // 5% for age > 60
                seniorDiscountAmount: 1.75,
                otherDiscount: 0,
                totalDiscount: 1.75,
                taxAmount: 4.20,
                netAmount: 37.45,
                paymentMethod: 'cash'
              },
              {
                invoiceNo: 'SAL-000002',
                date: '2024-01-15',
                patientName: 'Priya Sharma',
                patientAge: 35,
                items: [
                  { medicine: 'Cetirizine 10mg', qty: 20, unitPrice: 2.50, discount: 0, discountAmount: 0, total: 50.00 }
                ],
                subtotal: 50.00,
                seniorDiscount: 0,
                seniorDiscountAmount: 0,
                otherDiscount: 2, // Manual discount
                totalDiscount: 1.00,
                taxAmount: 5.88,
                netAmount: 54.88,
                paymentMethod: 'upi'
              },
              {
                invoiceNo: 'SAL-000003',
                date: '2024-01-15',
                patientName: 'Mohan Lal',
                patientAge: 72,
                items: [
                  { medicine: 'Vitamin D3 60K', qty: 2, unitPrice: 22.00, discount: 10, discountAmount: 4.40, total: 39.60 }
                ],
                subtotal: 44.00,
                seniorDiscount: 10, // 10% for age > 70
                seniorDiscountAmount: 4.40,
                otherDiscount: 0,
                totalDiscount: 4.40,
                taxAmount: 4.75,
                netAmount: 44.35,
                paymentMethod: 'card'
              }
            ],
            summary: {
              totalSales: 3,
              totalSubtotal: 129.00,
              totalSeniorDiscount: 10.15,
              totalOtherDiscount: 1.00,
              totalDiscount: 11.15,
              totalTax: 14.83,
              totalNetAmount: 136.68,
              averageDiscount: 8.6
            }
          }
        };

      case 'Profit & Loss Statement':
        return {
          title: 'Profit & Loss Statement',
          period: getDateRangeText(),
          data: {
            income: [
              { account: 'Consultation Income', amount: 450000 },
              { account: 'Pharmacy Sales', amount: 320000 },
              { account: 'Diagnostic Income', amount: 180000 },
              { account: 'Other Income', amount: 25000 }
            ],
            expenses: [
              { account: 'Medicine Purchase', amount: 180000 },
              { account: 'Staff Salary', amount: 240000 },
              { account: 'Rent Expense', amount: 120000 },
              { account: 'Electricity Expense', amount: 36000 },
              { account: 'Other Expenses', amount: 50000 }
            ],
            totals: {
              totalIncome: 975000,
              totalExpenses: 626000,
              netProfit: 349000
            }
          }
        };

      case 'Balance Sheet':
        return {
          title: 'Balance Sheet',
          period: `As on ${new Date().toLocaleDateString('en-IN')}`,
          data: {
            assets: [
              { account: 'Cash in Hand', amount: 50000 },
              { account: 'Bank Account', amount: 500000 },
              { account: 'Accounts Receivable', amount: 75000 },
              { account: 'Medicine Inventory', amount: 200000 },
              { account: 'Medical Equipment', amount: 1000000 }
            ],
            liabilities: [
              { account: 'Accounts Payable', amount: 45000 },
              { account: 'GST Payable', amount: 25000 },
              { account: 'TDS Payable', amount: 8000 },
              { account: 'Salary Payable', amount: 120000 }
            ],
            equity: [
              { account: 'Owner Equity', amount: 1500000 },
              { account: 'Retained Earnings', amount: 127000 }
            ],
            totals: {
              totalAssets: 1825000,
              totalLiabilities: 198000,
              totalEquity: 1627000
            }
          }
        };

      case 'GSTR1 Report':
        return {
          title: 'GSTR1 - Outward Supplies Report',
          period: getDateRangeText(),
          gstin: '27ABCDE1234F1Z5',
          data: {
            b2b: [
              { 
                recipient: 'ABC Hospital Pvt Ltd',
                gstin: '27FGHIJ5678G2Y6',
                invoiceNo: 'INV-000001',
                invoiceDate: '2024-01-15',
                invoiceValue: 11800,
                taxableValue: 10000,
                cgst: 900,
                sgst: 900,
                igst: 0,
                gstRate: 18
              },
              {
                recipient: 'XYZ Medical Center',
                gstin: '29KLMNO9012H3X7',
                invoiceNo: 'INV-000002',
                invoiceDate: '2024-01-16',
                invoiceValue: 5600,
                taxableValue: 5000,
                cgst: 300,
                sgst: 300,
                igst: 0,
                gstRate: 12
              }
            ],
            b2c: [
              {
                description: 'Retail Sales - 5% GST',
                taxableValue: 50000,
                cgst: 1250,
                sgst: 1250,
                igst: 0,
                gstRate: 5
              },
              {
                description: 'Retail Sales - 12% GST',
                taxableValue: 80000,
                cgst: 4800,
                sgst: 4800,
                igst: 0,
                gstRate: 12
              }
            ],
            summary: {
              totalTaxableValue: 145000,
              totalCGST: 7250,
              totalSGST: 7250,
              totalIGST: 0,
              totalTax: 14500,
              totalInvoiceValue: 159500
            }
          }
        };

      case 'Daily Sales Summary':
        return {
          title: 'Daily Sales Summary',
          period: getDateRangeText(),
          data: {
            sales: [
              { time: '09:00-10:00', transactions: 5, amount: 2500, discount: 125 },
              { time: '10:00-11:00', transactions: 8, amount: 4200, discount: 210 },
              { time: '11:00-12:00', transactions: 12, amount: 6800, discount: 340 },
              { time: '12:00-13:00', transactions: 6, amount: 3200, discount: 160 },
              { time: '14:00-15:00', transactions: 15, amount: 8500, discount: 425 },
              { time: '15:00-16:00', transactions: 18, amount: 9200, discount: 460 },
              { time: '16:00-17:00', transactions: 10, amount: 5400, discount: 270 },
              { time: '17:00-18:00', transactions: 7, amount: 3800, discount: 190 }
            ],
            summary: {
              totalTransactions: 81,
              totalAmount: 43600,
              totalDiscount: 2180,
              averageTicket: 538,
              averageDiscount: 27
            }
          }
        };

      case 'Stock Level Report':
        return {
          title: 'Stock Level Report',
          period: `As on ${new Date().toLocaleDateString('en-IN')}`,
          data: {
            items: [
              { name: 'Paracetamol 500mg', currentStock: 500, minStock: 50, maxStock: 1000, status: 'Good' },
              { name: 'Amoxicillin 250mg', currentStock: 15, minStock: 20, maxStock: 200, status: 'Low' },
              { name: 'Cetirizine 10mg', currentStock: 300, minStock: 30, maxStock: 500, status: 'Good' },
              { name: 'Omeprazole 20mg', currentStock: 8, minStock: 15, maxStock: 150, status: 'Critical' },
              { name: 'Vitamin D3 60K', currentStock: 100, minStock: 10, maxStock: 150, status: 'Good' }
            ],
            summary: {
              totalItems: 150,
              lowStockItems: 12,
              criticalStockItems: 3,
              overstockItems: 2
            }
          }
        };

      default:
        return null;
    }
  };

  const viewReport = (reportName: string) => {
    setLoading(true);
    setSelectedReport(reportName);
    
    // Simulate API call
    setTimeout(() => {
      const data = generateReportData(reportName);
      setReportData(data);
      setLoading(false);
    }, 1000);
  };

  const downloadReport = (reportName: string, format: 'pdf' | 'excel' | 'csv' = 'pdf') => {
    const data = generateReportData(reportName);
    if (!data) return;

    if (format === 'csv') {
      downloadCSV(data, reportName);
    } else if (format === 'excel') {
      downloadExcel(data, reportName);
    } else {
      downloadPDF(data, reportName);
    }
  };

  const downloadCSV = (data: any, reportName: string) => {
    let csvContent = `${data.title}\n${data.period}\n\n`;
    
    if (reportName === 'Supplier-wise Medicine Report') {
      data.data.suppliers.forEach((supplier: any) => {
        csvContent += `\nSupplier: ${supplier.name}\n`;
        csvContent += `Contact: ${supplier.contact}\n`;
        csvContent += `GSTIN: ${supplier.gstin}\n\n`;
        csvContent += 'Medicine,Category,Batch No,Expiry Date,Purchase Price,Selling Price,MRP,Current Stock,Min Stock,Total Purchased,Total Sold,Total Value,GST Rate\n';
        supplier.medicines.forEach((medicine: any) => {
          csvContent += `${medicine.name},${medicine.category},${medicine.batchNo},${medicine.expiryDate},${medicine.purchasePrice},${medicine.sellingPrice},${medicine.mrp},${medicine.currentStock},${medicine.minStock},${medicine.totalPurchased},${medicine.totalSold},${medicine.totalValue},${medicine.gstRate}%\n`;
        });
        csvContent += `\nSupplier Totals:,,,,,,,,,,,${supplier.totals.totalPurchaseValue},\n\n`;
      });
    } else if (reportName === 'Sales Report with Discounts') {
      csvContent += 'Invoice No,Date,Patient Name,Age,Subtotal,Senior Discount %,Senior Discount Amount,Other Discount,Total Discount,Tax Amount,Net Amount,Payment Method\n';
      data.data.sales.forEach((sale: any) => {
        csvContent += `${sale.invoiceNo},${sale.date},${sale.patientName},${sale.patientAge},${sale.subtotal},${sale.seniorDiscount}%,${sale.seniorDiscountAmount},${sale.otherDiscount},${sale.totalDiscount},${sale.taxAmount},${sale.netAmount},${sale.paymentMethod}\n`;
      });
    } else if (reportName === 'GSTR1 Report') {
      csvContent += 'B2B Transactions\n';
      csvContent += 'Recipient,GSTIN,Invoice No,Invoice Date,Taxable Value,CGST,SGST,IGST,Total\n';
      data.data.b2b.forEach((item: any) => {
        csvContent += `${item.recipient},${item.gstin},${item.invoiceNo},${item.invoiceDate},${item.taxableValue},${item.cgst},${item.sgst},${item.igst},${item.invoiceValue}\n`;
      });
      
      csvContent += '\nB2C Transactions\n';
      csvContent += 'Description,Taxable Value,CGST,SGST,IGST,GST Rate\n';
      data.data.b2c.forEach((item: any) => {
        csvContent += `${item.description},${item.taxableValue},${item.cgst},${item.sgst},${item.igst},${item.gstRate}%\n`;
      });
    } else if (data.data.income) {
      csvContent += 'Income\n';
      csvContent += 'Account,Amount\n';
      data.data.income.forEach((item: any) => {
        csvContent += `${item.account},${item.amount}\n`;
      });
      
      csvContent += '\nExpenses\n';
      csvContent += 'Account,Amount\n';
      data.data.expenses.forEach((item: any) => {
        csvContent += `${item.account},${item.amount}\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadExcel = (data: any, reportName: string) => {
    alert(`Excel download for ${reportName} would be implemented with a library like xlsx`);
  };

  const downloadPDF = (data: any, reportName: string) => {
    alert(`PDF download for ${reportName} would be implemented with a library like jsPDF`);
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
        'GSTR1 Report'
      ]
    },
    {
      title: 'Sales Reports',
      icon: TrendingUp,
      color: '#10b981',
      reports: [
        'Daily Sales Summary',
        'Sales Report with Discounts',
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
        'Stock Level Report',
        'Supplier-wise Medicine Report',
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

  const renderReportView = () => {
    if (!reportData) return null;

    return (
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginTop: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '1rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '0.5rem'
            }}>
              {reportData.title}
            </h2>
            <p style={{
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              {reportData.period}
            </p>
            {reportData.gstin && (
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                GSTIN: {reportData.gstin}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => downloadReport(selectedReport!, 'csv')}
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
                fontSize: '0.875rem'
              }}
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={() => downloadReport(selectedReport!, 'excel')}
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
                fontSize: '0.875rem'
              }}
            >
              <Download size={16} />
              Excel
            </button>
            <button
              onClick={() => downloadReport(selectedReport!, 'pdf')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              <Download size={16} />
              PDF
            </button>
            <button
              onClick={() => setSelectedReport(null)}
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
              Close
            </button>
          </div>
        </div>

        {/* Supplier-wise Medicine Report */}
        {selectedReport === 'Supplier-wise Medicine Report' && (
          <div>
            {reportData.data.suppliers.map((supplier: any, supplierIndex: number) => (
              <div key={supplierIndex} style={{ marginBottom: '3rem' }}>
                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    {supplier.name}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    <div>Contact: {supplier.contact}</div>
                    <div>GSTIN: {supplier.gstin}</div>
                    <div>Total Medicines: {supplier.totals.totalMedicines}</div>
                    <div>Total Value: {formatCurrency(supplier.totals.totalPurchaseValue)}</div>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>Medicine</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>Category</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>Batch/Expiry</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>Purchase Price</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>Selling Price</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>MRP</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>Stock</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>Total Value</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem' }}>GST</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplier.medicines.map((medicine: any, index: number) => (
                        <tr key={index}>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ fontWeight: '500' }}>{medicine.name}</div>
                          </td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>{medicine.category}</td>
                          <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ fontSize: '0.875rem' }}>
                              <div>Batch: {medicine.batchNo}</div>
                              <div style={{ color: '#6b7280' }}>Exp: {new Date(medicine.expiryDate).toLocaleDateString('en-IN')}</div>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(medicine.purchasePrice)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(medicine.sellingPrice)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(medicine.mrp)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                            <div style={{ fontSize: '0.875rem' }}>
                              <div style={{ fontWeight: '500' }}>{medicine.currentStock}</div>
                              <div style={{ color: '#6b7280' }}>Min: {medicine.minStock}</div>
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(medicine.totalValue)}</td>
                          <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>{medicine.gstRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{
                  backgroundColor: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginTop: '1rem'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '1rem',
                    fontSize: '0.875rem'
                  }}>
                    <div>
                      <div style={{ color: '#6b7280' }}>Total Purchase Value</div>
                      <div style={{ fontWeight: '600', fontSize: '1rem' }}>{formatCurrency(supplier.totals.totalPurchaseValue)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280' }}>Current Stock Value</div>
                      <div style={{ fontWeight: '600', fontSize: '1rem' }}>{formatCurrency(supplier.totals.totalCurrentValue)}</div>
                    </div>
                    <div>
                      <div style={{ color: '#6b7280' }}>Total Sold Value</div>
                      <div style={{ fontWeight: '600', fontSize: '1rem', color: '#10b981' }}>{formatCurrency(supplier.totals.totalSoldValue)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '2px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Grand Summary
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Suppliers</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{reportData.data.grandTotals.totalSuppliers}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Medicines</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{reportData.data.grandTotals.totalMedicines}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Purchase Value</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>{formatCurrency(reportData.data.grandTotals.totalPurchaseValue)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Current Stock Value</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f59e0b' }}>{formatCurrency(reportData.data.grandTotals.totalCurrentValue)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Sold Value</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(reportData.data.grandTotals.totalSoldValue)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sales Report with Discounts */}
        {selectedReport === 'Sales Report with Discounts' && (
          <div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Invoice</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Patient</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Subtotal</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Senior Discount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Other Discount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Total Discount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Tax</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Net Amount</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data.sales.map((sale: any, index: number) => (
                    <tr key={index}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{sale.invoiceNo}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{sale.date}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>{sale.patientName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Age: {sale.patientAge}</div>
                        </div>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(sale.subtotal)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                        {sale.seniorDiscount > 0 && (
                          <div>
                            <div style={{ color: '#10b981', fontWeight: '500' }}>{sale.seniorDiscount}%</div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{formatCurrency(sale.seniorDiscountAmount)}</div>
                          </div>
                        )}
                        {sale.seniorDiscount === 0 && <span style={{ color: '#9ca3af' }}>-</span>}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>
                        {sale.otherDiscount > 0 ? `${sale.otherDiscount}%` : '-'}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{ color: '#ef4444', fontWeight: '500' }}>{formatCurrency(sale.totalDiscount)}</span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(sale.taxAmount)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(sale.netAmount)}</span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: sale.paymentMethod === 'cash' ? '#d1fae5' : sale.paymentMethod === 'upi' ? '#fef3c7' : '#dbeafe',
                          color: sale.paymentMethod === 'cash' ? '#065f46' : sale.paymentMethod === 'upi' ? '#92400e' : '#1e40af',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase'
                        }}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginTop: '2rem',
              border: '2px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Sales Summary
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Sales</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{reportData.data.summary.totalSales}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Subtotal</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{formatCurrency(reportData.data.summary.totalSubtotal)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Senior Discounts</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#10b981' }}>{formatCurrency(reportData.data.summary.totalSeniorDiscount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Other Discounts</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f59e0b' }}>{formatCurrency(reportData.data.summary.totalOtherDiscount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Discounts</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ef4444' }}>{formatCurrency(reportData.data.summary.totalDiscount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Net Amount</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#3b82f6' }}>{formatCurrency(reportData.data.summary.totalNetAmount)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg Discount %</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{reportData.data.summary.averageDiscount}%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GSTR1 Report */}
        {selectedReport === 'GSTR1 Report' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                B2B Transactions
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Recipient</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>GSTIN</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Invoice No</th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Taxable Value</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>CGST</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>SGST</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.b2b.map((item: any, index: number) => (
                      <tr key={index}>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>{item.recipient}</td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>{item.gstin}</td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>{item.invoiceNo}</td>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>{item.invoiceDate}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(item.taxableValue)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(item.cgst)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(item.sgst)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(item.invoiceValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                B2C Transactions
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Description</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>Taxable Value</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>CGST</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #e5e7eb' }}>SGST</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>GST Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.data.b2c.map((item: any, index: number) => (
                      <tr key={index}>
                        <td style={{ padding: '0.75rem', borderBottom: '1px solid #f3f4f6' }}>{item.description}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(item.taxableValue)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(item.cgst)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #f3f4f6' }}>{formatCurrency(item.sgst)}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>{item.gstRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '2px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Summary
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Taxable Value</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{formatCurrency(reportData.data.summary.totalTaxableValue)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total CGST</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{formatCurrency(reportData.data.summary.totalCGST)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total SGST</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600' }}>{formatCurrency(reportData.data.summary.totalSGST)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Tax</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#ef4444' }}>{formatCurrency(reportData.data.summary.totalTax)}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Invoice Value</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>{formatCurrency(reportData.data.summary.totalInvoiceValue)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'Profit & Loss Statement' && (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#10b981'
                }}>
                  Income
                </h3>
                {reportData.data.income.map((item: any, index: number) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <span>{item.account}</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem 0',
                  borderTop: '2px solid #10b981',
                  marginTop: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem'
                }}>
                  <span>Total Income</span>
                  <span style={{ color: '#10b981' }}>{formatCurrency(reportData.data.totals.totalIncome)}</span>
                </div>
              </div>

              <div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#ef4444'
                }}>
                  Expenses
                </h3>
                {reportData.data.expenses.map((item: any, index: number) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #f3f4f6'
                  }}>
                    <span>{item.account}</span>
                    <span style={{ fontWeight: '500' }}>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '1rem 0',
                  borderTop: '2px solid #ef4444',
                  marginTop: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.125rem'
                }}>
                  <span>Total Expenses</span>
                  <span style={{ color: '#ef4444' }}>{formatCurrency(reportData.data.totals.totalExpenses)}</span>
                </div>
              </div>
            </div>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              marginTop: '2rem',
              border: '2px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}>
                  Net Profit
                </span>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: reportData.data.totals.netProfit > 0 ? '#10b981' : '#ef4444'
                }}>
                  {formatCurrency(reportData.data.totals.netProfit)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Add other report renderers as needed */}
        {selectedReport && !['Supplier-wise Medicine Report', 'Sales Report with Discounts', 'GSTR1 Report', 'Profit & Loss Statement'].includes(selectedReport) && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <FileText size={48} style={{ margin: '0 auto 1rem', color: '#d1d5db' }} />
            <p>Report view for "{selectedReport}" is being prepared.</p>
            <p style={{ fontSize: '0.875rem' }}>This report contains detailed data and will be available for download.</p>
          </div>
        )}
      </div>
    );
  };

  if (selectedReport && loading) {
    return (
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Reports & Analytics</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          gap: '1rem'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Generating {selectedReport}...
          </p>
        </div>
      </div>
    );
  }

  if (selectedReport && reportData) {
    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Reports & Analytics</h1>
        </div>
        {renderReportView()}
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
      </div>

      {/* Date Range Selection */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '2rem',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CalendarDays size={20} />
          Select Date Range for Reports
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Quick Select
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
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
          </div>
          
          {dateRange === 'custom' && (
            <>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  From Date
                </label>
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
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
                  To Date
                </label>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
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
            </>
          )}
          
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              marginBottom: '0.25rem'
            }}>
              Selected Period
            </div>
            <div style={{
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#111827'
            }}>
              {getDateRangeText()}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
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
            +12.5% from last period
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
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            {financialData.profitMargin}% profit margin
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
            Avg ticket: {formatCurrency(salesData.averageTicket)}
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
                Total Discounts Given
              </p>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ef4444'
              }}>
                ₹11,150
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
              <Users size={20} style={{ color: '#ef4444' }} />
            </div>
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            8.6% avg discount rate
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
                  <div
                    key={report}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
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
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#374151',
                        fontWeight: ['GSTR1 Report', 'Supplier-wise Medicine Report', 'Sales Report with Discounts'].includes(report) ? '600' : '400'
                      }}>
                        {report}
                        {report === 'GSTR1 Report' && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.75rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem'
                          }}>
                            GST
                          </span>
                        )}
                        {report === 'Supplier-wise Medicine Report' && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.75rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem'
                          }}>
                            NEW
                          </span>
                        )}
                        {report === 'Sales Report with Discounts' && (
                          <span style={{
                            marginLeft: '0.5rem',
                            fontSize: '0.75rem',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem'
                          }}>
                            ENHANCED
                          </span>
                        )}
                      </span>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button
                          onClick={() => viewReport(report)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            color: '#3b82f6'
                          }}
                          title="View Report"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => downloadReport(report)}
                          style={{
                            padding: '0.25rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            color: '#6b7280'
                          }}
                          title="Download Report"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
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
          Quick Analytics
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
              Senior Citizen Discounts
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              ₹10,150 (91%)
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              of total discounts
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
              Top Supplier
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#111827'
            }}>
              MediCorp Pharmaceuticals
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#6b7280'
            }}>
              ₹6,500 total value
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