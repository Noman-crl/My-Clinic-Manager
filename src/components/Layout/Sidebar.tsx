import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  FileText,
  Receipt,
  Pill,
  ShoppingCart,
  TrendingUp,
  Settings,
  Package,
  CreditCard
} from 'lucide-react';

const menuItems = [
  { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { text: 'Patients', icon: Users, path: '/patients' },
  { text: 'Doctors', icon: UserCheck, path: '/doctors' },
  { text: 'Appointments', icon: Calendar, path: '/appointments' },
  { text: 'Medical Records', icon: FileText, path: '/medical-records' },
  { text: 'Pharmacy', icon: Pill, path: '/pharmacy' },
  { text: 'Purchases', icon: ShoppingCart, path: '/purchases' },
  { text: 'Inventory', icon: Package, path: '/inventory' },
  { text: 'Billing', icon: Receipt, path: '/billing' },
  { text: 'Accounts', icon: CreditCard, path: '/accounts' },
  { text: 'Reports', icon: TrendingUp, path: '/reports' },
  { text: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside style={{
      position: 'fixed',
      top: '64px',
      left: 0,
      width: '240px',
      height: 'calc(100vh - 64px)',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      padding: '1rem 0',
      overflowY: 'auto'
    }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <li key={item.text} style={{ margin: '0.25rem 0.75rem' }}>
                <button
                  onClick={() => navigate(item.path)}
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
                  {item.text}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;