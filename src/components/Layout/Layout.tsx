import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <main style={{
        flexGrow: 1,
        padding: '1.5rem',
        marginTop: '64px',
        marginLeft: '240px',
        backgroundColor: '#f8fafc',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;