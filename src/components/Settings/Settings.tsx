import React, { useState } from 'react';
import { Settings as SettingsIcon, Users, Shield, Bell, Database, Printer, Globe, Percent, Check, X } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [userPermissions, setUserPermissions] = useState({
    doctor: {
      dashboard: true,
      patients: true,
      appointments: true,
      medicalRecords: true,
      pharmacy: false,
      inventory: false,
      billing: false,
      accounts: false,
      reports: true,
      settings: false
    },
    pharmacist: {
      dashboard: true,
      patients: true,
      appointments: false,
      medicalRecords: false,
      pharmacy: true,
      inventory: true,
      billing: true,
      accounts: false,
      reports: true,
      settings: false
    },
    accountant: {
      dashboard: true,
      patients: false,
      appointments: false,
      medicalRecords: false,
      pharmacy: false,
      inventory: false,
      billing: true,
      accounts: true,
      reports: true,
      settings: false
    },
    receptionist: {
      dashboard: true,
      patients: true,
      appointments: true,
      medicalRecords: false,
      pharmacy: false,
      inventory: false,
      billing: false,
      accounts: false,
      reports: false,
      settings: false
    }
  });

  const modules = [
    { key: 'dashboard', name: 'Dashboard', description: 'View clinic overview and statistics' },
    { key: 'patients', name: 'Patient Management', description: 'Add, edit, and manage patient records' },
    { key: 'appointments', name: 'Appointments', description: 'Schedule and manage appointments' },
    { key: 'medicalRecords', name: 'Medical Records', description: 'Access patient medical history' },
    { key: 'pharmacy', name: 'Pharmacy', description: 'Manage medicine sales and prescriptions' },
    { key: 'inventory', name: 'Inventory', description: 'Medicine stock and inventory management' },
    { key: 'billing', name: 'Billing & Invoices', description: 'Generate bills and manage payments' },
    { key: 'accounts', name: 'Accounts & Finance', description: 'Financial reports and accounting' },
    { key: 'reports', name: 'Reports & Analytics', description: 'Generate and view reports' },
    { key: 'settings', name: 'Settings', description: 'System configuration and preferences' }
  ];

  const updatePermission = (role: string, module: string, value: boolean) => {
    setUserPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [module]: value
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'discounts', label: 'Discount Settings', icon: Percent },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'printing', label: 'Printing', icon: Printer },
    { id: 'localization', label: 'Localization', icon: Globe }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              General Settings
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
                  Clinic Name
                </label>
                <input
                  type="text"
                  defaultValue="Ultimate Clinic"
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
                  Contact Number
                </label>
                <input
                  type="text"
                  defaultValue="+91 98765 43210"
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
                  Email Address
                </label>
                <input
                  type="email"
                  defaultValue="info@ultimateclinic.com"
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
                  GST Number
                </label>
                <input
                  type="text"
                  defaultValue="27ABCDE1234F1Z5"
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

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Clinic Address
                </label>
                <textarea
                  rows={3}
                  defaultValue="123 Medical Street, Healthcare District, Mumbai, Maharashtra 400001"
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
          </div>
        );

      case 'discounts':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Discount Settings
            </h3>
            
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderRadius: '0.375rem',
              marginBottom: '2rem',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Configure automatic discounts based on patient age and other criteria.
              </p>
            </div>

            {/* Age-based Discounts */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Age-based Discounts
              </h4>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0
                    }}>
                      Senior Citizen Discount (Age 60+)
                    </h5>
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '44px',
                      height: '24px'
                    }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#10b981',
                        borderRadius: '24px',
                        transition: '0.4s'
                      }}></span>
                    </label>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Minimum Age
                      </label>
                      <input
                        type="number"
                        defaultValue="60"
                        min="0"
                        max="120"
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
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Discount %
                      </label>
                      <input
                        type="number"
                        defaultValue="5"
                        min="0"
                        max="100"
                        step="0.1"
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
                  </div>
                  
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Automatically applies 5% discount for patients aged 60 and above
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0
                    }}>
                      Super Senior Discount (Age 70+)
                    </h5>
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '44px',
                      height: '24px'
                    }}>
                      <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#10b981',
                        borderRadius: '24px',
                        transition: '0.4s'
                      }}></span>
                    </label>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Minimum Age
                      </label>
                      <input
                        type="number"
                        defaultValue="70"
                        min="0"
                        max="120"
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
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Discount %
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        min="0"
                        max="100"
                        step="0.1"
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
                  </div>
                  
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Higher discount for patients aged 70 and above (overrides 60+ discount)
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem'
                  }}>
                    <h5 style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#374151',
                      margin: 0
                    }}>
                      Child Discount (Age 0-12)
                    </h5>
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '44px',
                      height: '24px'
                    }}>
                      <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#d1d5db',
                        borderRadius: '24px',
                        transition: '0.4s'
                      }}></span>
                    </label>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Maximum Age
                      </label>
                      <input
                        type="number"
                        defaultValue="12"
                        min="0"
                        max="18"
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
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        color: '#6b7280',
                        marginBottom: '0.25rem'
                      }}>
                        Discount %
                      </label>
                      <input
                        type="number"
                        defaultValue="3"
                        min="0"
                        max="100"
                        step="0.1"
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
                  </div>
                  
                  <div style={{
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                  }}>
                    Special discount for children (currently disabled)
                  </div>
                </div>
              </div>
            </div>

            {/* Other Discount Settings */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                General Discount Settings
              </h4>
              
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
                    Maximum Discount Allowed (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="25"
                    min="0"
                    max="100"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: '0.25rem'
                  }}>
                    Maximum discount that can be applied to any sale
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Bulk Purchase Discount Threshold (₹)
                  </label>
                  <input
                    type="number"
                    defaultValue="2000"
                    min="0"
                    step="100"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: '0.25rem'
                  }}>
                    Minimum amount for bulk purchase discount eligibility
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Bulk Purchase Discount (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="2"
                    min="0"
                    max="20"
                    step="0.1"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none'
                    }}
                  />
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    marginTop: '0.25rem'
                  }}>
                    Discount percentage for bulk purchases
                  </div>
                </div>
              </div>
            </div>

            {/* Discount Rules */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Discount Application Rules
              </h4>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <input type="checkbox" defaultChecked />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Age-based discounts take priority over manual discounts
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <input type="checkbox" defaultChecked />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Apply highest applicable age-based discount only
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <input type="checkbox" />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Allow stacking of age-based and bulk purchase discounts
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <input type="checkbox" defaultChecked />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Show discount breakdown on receipts
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              User Management & Module Access
            </h3>
            
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderRadius: '0.375rem',
              marginBottom: '2rem',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{
                fontSize: '0.875rem',
                color: '#6b7280',
                margin: 0
              }}>
                Configure which modules each user role can access. Customize permissions to ensure users only see relevant features.
              </p>
            </div>

            {/* Role-based Module Access */}
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
                      <th style={{
                        padding: '1rem',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        minWidth: '250px'
                      }}>
                        Module / Feature
                      </th>
                      <th style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        minWidth: '120px'
                      }}>
                        Doctor
                      </th>
                      <th style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        minWidth: '120px'
                      }}>
                        Pharmacist
                      </th>
                      <th style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        minWidth: '120px'
                      }}>
                        Accountant
                      </th>
                      <th style={{
                        padding: '1rem',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151',
                        minWidth: '120px'
                      }}>
                        Receptionist
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {modules.map((module, index) => (
                      <tr key={module.key} style={{ 
                        borderTop: index > 0 ? '1px solid #f3f4f6' : 'none',
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                      }}>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: '#111827',
                              marginBottom: '0.25rem'
                            }}>
                              {module.name}
                            </div>
                            <div style={{
                              fontSize: '0.75rem',
                              color: '#6b7280'
                            }}>
                              {module.description}
                            </div>
                          </div>
                        </td>
                        
                        {/* Doctor Column */}
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => updatePermission('doctor', module.key, !userPermissions.doctor[module.key as keyof typeof userPermissions.doctor])}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.375rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              backgroundColor: userPermissions.doctor[module.key as keyof typeof userPermissions.doctor] ? '#10b981' : '#ef4444',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {userPermissions.doctor[module.key as keyof typeof userPermissions.doctor] ? 
                              <Check size={16} style={{ color: 'white' }} /> : 
                              <X size={16} style={{ color: 'white' }} />
                            }
                          </button>
                        </td>
                        
                        {/* Pharmacist Column */}
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => updatePermission('pharmacist', module.key, !userPermissions.pharmacist[module.key as keyof typeof userPermissions.pharmacist])}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.375rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              backgroundColor: userPermissions.pharmacist[module.key as keyof typeof userPermissions.pharmacist] ? '#10b981' : '#ef4444',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {userPermissions.pharmacist[module.key as keyof typeof userPermissions.pharmacist] ? 
                              <Check size={16} style={{ color: 'white' }} /> : 
                              <X size={16} style={{ color: 'white' }} />
                            }
                          </button>
                        </td>
                        
                        {/* Accountant Column */}
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => updatePermission('accountant', module.key, !userPermissions.accountant[module.key as keyof typeof userPermissions.accountant])}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.375rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              backgroundColor: userPermissions.accountant[module.key as keyof typeof userPermissions.accountant] ? '#10b981' : '#ef4444',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {userPermissions.accountant[module.key as keyof typeof userPermissions.accountant] ? 
                              <Check size={16} style={{ color: 'white' }} /> : 
                              <X size={16} style={{ color: 'white' }} />
                            }
                          </button>
                        </td>
                        
                        {/* Receptionist Column */}
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button
                            onClick={() => updatePermission('receptionist', module.key, !userPermissions.receptionist[module.key as keyof typeof userPermissions.receptionist])}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '0.375rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              backgroundColor: userPermissions.receptionist[module.key as keyof typeof userPermissions.receptionist] ? '#10b981' : '#ef4444',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {userPermissions.receptionist[module.key as keyof typeof userPermissions.receptionist] ? 
                              <Check size={16} style={{ color: 'white' }} /> : 
                              <X size={16} style={{ color: 'white' }} />
                            }
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Permission Summary */}
            <div style={{
              marginTop: '2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(userPermissions).map(([role, permissions]) => {
                const enabledCount = Object.values(permissions).filter(Boolean).length;
                const totalCount = Object.keys(permissions).length;
                
                return (
                  <div
                    key={role}
                    style={{
                      backgroundColor: 'white',
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: '#111827',
                      textTransform: 'capitalize'
                    }}>
                      {role}
                    </h4>
                    <div style={{
                      fontSize: '0.875rem',
                      color: '#6b7280',
                      marginBottom: '0.5rem'
                    }}>
                      {enabledCount} of {totalCount} modules enabled
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(enabledCount / totalCount) * 100}%`,
                        height: '100%',
                        backgroundColor: enabledCount > totalCount * 0.7 ? '#10b981' : enabledCount > totalCount * 0.4 ? '#f59e0b' : '#ef4444',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div style={{
              marginTop: '2rem',
              backgroundColor: '#f9fafb',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#374151'
              }}>
                Quick Actions
              </h4>
              
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Enable All for Doctors
                </button>
                
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Reset to Defaults
                </button>
                
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Copy Permissions
                </button>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Security Settings
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    Two-Factor Authentication
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Add an extra layer of security to your account
                  </div>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '44px',
                  height: '24px'
                }}>
                  <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#d1d5db',
                    borderRadius: '24px',
                    transition: '0.4s'
                  }}></span>
                </label>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    Session Timeout
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Automatically log out inactive users
                  </div>
                </div>
                <select style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    Password Policy
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Enforce strong password requirements
                  </div>
                </div>
                <button style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}>
                  Configure
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Notification Settings
            </h3>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {[
                { title: 'Low Stock Alerts', description: 'Get notified when medicine stock is low' },
                { title: 'Expiry Reminders', description: 'Alerts for medicines nearing expiry' },
                { title: 'Appointment Reminders', description: 'Send reminders to patients' },
                { title: 'Payment Notifications', description: 'Alerts for pending payments' },
                { title: 'System Updates', description: 'Notifications about system updates' }
              ].map((notification) => (
                <div
                  key={notification.title}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                      {notification.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {notification.description}
                    </div>
                  </div>
                  <label style={{
                    position: 'relative',
                    display: 'inline-block',
                    width: '44px',
                    height: '24px'
                  }}>
                    <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: '#10b981',
                      borderRadius: '24px',
                      transition: '0.4s'
                    }}></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'backup':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Backup & Restore
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  Automatic Backup
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  Schedule automatic backups of your clinic data
                </p>
                <select style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none',
                  marginBottom: '1rem'
                }}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Enable Auto Backup
                </button>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem'
              }}>
                <h4 style={{
                  fontSize: '1rem',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  color: '#111827'
                }}>
                  Manual Backup
                </h4>
                <p style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  Create a backup of your data right now
                </p>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  marginBottom: '1rem'
                }}>
                  Last backup: January 15, 2024 at 2:30 PM
                </div>
                <button style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Create Backup Now
                </button>
              </div>
            </div>
          </div>
        );

      case 'printing':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Printing Settings
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
                  Default Printer
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="">Select Printer</option>
                  <option value="hp-laserjet">HP LaserJet Pro</option>
                  <option value="canon-pixma">Canon PIXMA</option>
                  <option value="epson-ecotank">Epson EcoTank</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Paper Size
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="a4">A4</option>
                  <option value="letter">Letter</option>
                  <option value="a5">A5</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Print Quality
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="draft">Draft</option>
                  <option value="normal">Normal</option>
                  <option value="high">High Quality</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Auto Print
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <input type="checkbox" />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    Auto print prescriptions
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'localization':
        return (
          <div>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#374151'
            }}>
              Localization Settings
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
                  Language
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Currency
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="INR">₹ Indian Rupee (INR)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Date Format
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  Time Zone
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Settings</h1>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar */}
        <div style={{
          width: '250px',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '1rem',
          height: 'fit-content'
        }}>
          <nav>
            <ul style={{ listStyle: 'none',  padding: 0, margin: 0 }}>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <li key={tab.id} style={{ marginBottom: '0.25rem' }}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: isActive ? '#3b82f6' : 'transparent',
                        color: isActive ? 'white' : '#374151',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: isActive ? '600' : '400',
                        textAlign: 'left',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Icon size={18} />
                      {tab.label}
                      {tab.id === 'discounts' && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '0.75rem',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#10b981',
                          color: isActive ? 'white' : 'white',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          NEW
                        </span>
                      )}
                      {tab.id === 'users' && (
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '0.75rem',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#f59e0b',
                          color: isActive ? 'white' : 'white',
                          padding: '0.125rem 0.375rem',
                          borderRadius: '0.25rem'
                        }}>
                          UPD
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '2rem'
        }}>
          {renderTabContent()}
          
          {/* Save Button */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;