import React, { useState } from 'react';
import { Bell, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Heart size={24} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
          Ultimate Clinic Management
        </h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button style={{
          padding: '0.5rem',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          color: '#6b7280'
        }}>
          <Bell size={20} />
        </button>
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            <User size={20} />
            <span style={{ fontSize: '0.875rem' }}>
              {user?.email || 'User'}
            </span>
          </button>
          
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minWidth: '150px',
              zIndex: 1001
            }}>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#374151'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;