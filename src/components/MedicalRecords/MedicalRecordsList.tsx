import React, { useEffect, useState } from 'react';
import { FileText, Search, User, UserCheck, Calendar } from 'lucide-react';
import { getMedicalRecords } from '../../services/supabaseApi';

const MedicalRecordsList: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getMedicalRecords();
      setRecords(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch medical records. Please try again later.');
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter(record =>
    searchTerm === '' ||
    (record.patients && 
      `${record.patients.first_name} ${record.patients.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (record.doctors && 
      `${record.doctors.first_name} ${record.doctors.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
    record.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Medical Records</h1>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '1rem'
      }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6b7280'
          }} />
          <input
            type="text"
            placeholder="Search medical records by patient, doctor, complaint, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: '1rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <FileText size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
            No medical records found.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              style={{
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <User size={16} style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      Patient
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {record.patients ? 
                      `${record.patients.first_name} ${record.patients.last_name}` : 
                      'Unknown Patient'
                    }
                  </p>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <UserCheck size={16} style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      Doctor
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {record.doctors ? 
                      `Dr. ${record.doctors.first_name} ${record.doctors.last_name}` : 
                      'Unknown Doctor'
                    }
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {record.doctors?.specialization || 'No specialization'}
                  </p>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Calendar size={16} style={{ color: '#6b7280' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      Visit Date
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {new Date(record.visit_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Chief Complaint
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {record.chief_complaint}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Diagnosis
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {record.diagnosis}
                  </p>
                </div>

                <div>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Treatment
                  </h4>
                  <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {record.treatment}
                  </p>
                </div>

                {record.notes && (
                  <div>
                    <h4 style={{
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: '#111827',
                      marginBottom: '0.5rem'
                    }}>
                      Notes
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                      {record.notes}
                    </p>
                  </div>
                )}
              </div>

              {record.medications && record.medications.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '0.5rem'
                  }}>
                    Medications
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {record.medications.map((med: any, index: number) => (
                      <span
                        key={index}
                        style={{
                          display: 'inline-flex',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          borderRadius: '0.375rem',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af'
                        }}
                      >
                        {med.name} - {med.dosage}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsList;