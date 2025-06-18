import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Receipt, 
  BarChart3, 
  Menu,
  X,
  LogOut,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

// Auth Context
interface AuthContextType {
  user: any;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Mock Data
const mockPatients = [
  { id: '1', name: 'Alice Brown', email: 'alice@email.com', phone: '+1-555-0201', age: 38, gender: 'Female' },
  { id: '2', name: 'Michael Davis', email: 'michael@email.com', phone: '+1-555-0203', age: 45, gender: 'Male' },
  { id: '3', name: 'Emma Thompson', email: 'emma@email.com', phone: '+1-555-0205', age: 14, gender: 'Female' },
];

const mockDoctors = [
  { id: '1', name: 'Dr. John Smith', specialization: 'Cardiology', experience: 15, fee: 200 },
  { id: '2', name: 'Dr. Sarah Johnson', specialization: 'Pediatrics', experience: 12, fee: 180 },
  { id: '3', name: 'Dr. Michael Brown', specialization: 'Orthopedics', experience: 18, fee: 250 },
];

const mockAppointments = [
  { id: '1', patientName: 'Alice Brown', doctorName: 'Dr. John Smith', date: '2024-01-15', time: '10:00', status: 'Scheduled' },
  { id: '2', patientName: 'Emma Thompson', doctorName: 'Dr. Sarah Johnson', date: '2024-01-16', time: '14:00', status: 'Confirmed' },
  { id: '3', patientName: 'Michael Davis', doctorName: 'Dr. Michael Brown', date: '2024-01-17', time: '09:30', status: 'Completed' },
];

// Components
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { name: 'Patients', icon: Users, path: '/patients' },
    { name: 'Doctors', icon: UserCheck, path: '/doctors' },
    { name: 'Appointments', icon: Calendar, path: '/appointments' },
    { name: 'Medical Records', icon: FileText, path: '/medical-records' },
    { name: 'Billing', icon: Receipt, path: '/billing' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '0',
        backgroundColor: '#1e293b',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #334155' }}>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold' }}>Ultimate Clinic</h2>
        </div>
        <nav style={{ padding: '1rem 0' }}>
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                color: location.pathname === item.path ? '#3b82f6' : '#cbd5e1',
                backgroundColor: location.pathname === item.path ? '#1e40af20' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              <item.icon size={18} style={{ marginRight: '0.75rem' }} />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '250px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '0.5rem',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            <LogOut size={16} style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    { title: 'Total Patients', value: mockPatients.length, color: '#3b82f6', onClick: () => navigate('/patients') },
    { title: 'Total Doctors', value: mockDoctors.length, color: '#10b981', onClick: () => navigate('/doctors') },
    { title: 'Today\'s Appointments', value: mockAppointments.length, color: '#f59e0b', onClick: () => navigate('/appointments') },
    { title: 'Total Revenue', value: '$12,450', color: '#8b5cf6', onClick: () => navigate('/billing') },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard</h1>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat) => (
          <div
            key={stat.title}
            onClick={stat.onClick}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              border: '1px solid #e2e8f0'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{stat.title}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Patients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Patients</h1>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Add Patient
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Contact</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Age</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Gender</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>ID: {patient.id}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem' }}>{patient.email}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{patient.phone}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{patient.age}</td>
                <td style={{ padding: '1rem' }}>{patient.gender}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#3b82f6' }}>
                      <Eye size={16} />
                    </button>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#10b981' }}>
                      <Edit size={16} />
                    </button>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Doctors: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Doctors</h1>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Add Doctor
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Specialization</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Experience</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Fee</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockDoctors.map((doctor) => (
              <tr key={doctor.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{doctor.name}</td>
                <td style={{ padding: '1rem' }}>{doctor.specialization}</td>
                <td style={{ padding: '1rem' }}>{doctor.experience} years</td>
                <td style={{ padding: '1rem' }}>${doctor.fee}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#3b82f6' }}>
                      <Eye size={16} />
                    </button>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#10b981' }}>
                      <Edit size={16} />
                    </button>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Appointments: React.FC = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Appointments</h1>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.75rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer'
        }}>
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Schedule Appointment
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Patient</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Doctor</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Date & Time</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAppointments.map((appointment) => (
              <tr key={appointment.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{appointment.patientName}</td>
                <td style={{ padding: '1rem' }}>{appointment.doctorName}</td>
                <td style={{ padding: '1rem' }}>
                  <div>
                    <div>{appointment.date}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{appointment.time}</div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    backgroundColor: appointment.status === 'Completed' ? '#dcfce7' : appointment.status === 'Confirmed' ? '#dbeafe' : '#fef3c7',
                    color: appointment.status === 'Completed' ? '#166534' : appointment.status === 'Confirmed' ? '#1e40af' : '#92400e'
                  }}>
                    {appointment.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#3b82f6' }}>
                      <Eye size={16} />
                    </button>
                    <button style={{ padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#10b981' }}>
                      <Edit size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MedicalRecords: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Medical Records</h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '3rem', 
        borderRadius: '0.5rem', 
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <FileText size={48} style={{ margin: '0 auto 1rem', color: '#64748b' }} />
        <p style={{ color: '#64748b' }}>Medical records management coming soon...</p>
      </div>
    </div>
  );
};

const Billing: React.FC = () => {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Billing & Payments</h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '3rem', 
        borderRadius: '0.5rem', 
        textAlign: 'center',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <Receipt size={48} style={{ margin: '0 auto 1rem', color: '#64748b' }} />
        <p style={{ color: '#64748b' }}>Billing system coming soon...</p>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('Admin');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@admin.com' && password === 'Admin') {
      login(email, password);
      navigate('/dashboard');
    } else {
      alert('Invalid credentials. Use admin@admin.com / Admin');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '2rem' }}>
          Ultimate Clinic Login
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
        </form>
        
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f1f5f9',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          textAlign: 'center'
        }}>
          <strong>Demo Credentials:</strong><br />
          Email: admin@admin.com<br />
          Password: Admin
        </div>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  const login = (email: string, password: string) => {
    setUser({ email, name: 'Admin User' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;