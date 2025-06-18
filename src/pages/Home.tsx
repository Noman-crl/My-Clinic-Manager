import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Calendar, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Heart size={32} style={{ color: '#3b82f6', marginRight: '0.5rem' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
              Ultimate Clinic
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/signin')}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
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
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: '4rem 1rem',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '1rem'
        }}>
          Modern Clinic Management
        </h2>
        <p style={{
          fontSize: '1.25rem',
          color: '#64748b',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Streamline your healthcare practice with our comprehensive clinic management system.
          Manage patients, appointments, medical records, and billing all in one place.
        </p>
        <button
          onClick={() => navigate('/signin')}
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}
        >
          Start Managing Your Clinic
        </button>
      </section>

      {/* Features Section */}
      <section style={{
        padding: '4rem 1rem',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#1e293b'
          }}>
            Everything You Need
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <Users size={48} style={{ color: '#3b82f6', margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Patient Management
              </h4>
              <p style={{ color: '#64748b' }}>
                Comprehensive patient records with medical history, contact information, and insurance details.
              </p>
            </div>
            
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <Calendar size={48} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Appointment Scheduling
              </h4>
              <p style={{ color: '#64748b' }}>
                Easy-to-use scheduling system with automated reminders and conflict detection.
              </p>
            </div>
            
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <Shield size={48} style={{ color: '#f59e0b', margin: '0 auto 1rem' }} />
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Secure & Compliant
              </h4>
              <p style={{ color: '#64748b' }}>
                HIPAA-compliant security with role-based access control and data encryption.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1e293b',
        color: 'white',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Heart size={24} style={{ marginRight: '0.5rem' }} />
            <span style={{ fontSize: '1.125rem', fontWeight: '600' }}>Ultimate Clinic</span>
          </div>
          <p style={{ color: '#94a3b8' }}>
            © 2024 Ultimate Clinic Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;