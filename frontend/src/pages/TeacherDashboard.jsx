import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/teacher/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students:', err);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentDetails = useCallback(async (studentId) => {
    try {
      setDetailsLoading(true);
      const res = await api.get(`/teacher/students/${studentId}`);
      setStudentDetails(res.data);
      setSelectedStudent(studentId);
    } catch (err) {
      console.error('Failed to load student details:', err);
      toast.error('Failed to load student details');
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Students</h1>
          <p className="text-sm text-gray-400">{students.length} student{students.length !== 1 ? 's' : ''} in your class</p>
        </div>
        <button onClick={fetchStudents} disabled={loading} className="btn btn-ghost" style={{ fontSize: '13px' }}>
          {loading ? 'Loading...' : '↻ Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ alignItems: 'start' }}>
        {/* Student List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Class List
          </h2>

          {loading ? (
            <div className="text-gray-400 text-sm py-4">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="card text-center">
              <p className="text-gray-400">No students found.</p>
              <p className="text-sm text-gray-500 mt-1">Students will appear here once they register with your email.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {students.map((student) => {
                const isSelected = selectedStudent === student._id;
                return (
                  <button
                    key={student._id}
                    onClick={() => fetchStudentDetails(student._id)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '14px 18px',
                      borderRadius: '10px',
                      border: `1px solid ${isSelected ? '#3b82f6' : '#2d3748'}`,
                      background: isSelected ? 'rgba(59,130,246,0.1)' : '#16213e',
                      color: isSelected ? '#93c5fd' : '#d1d5db',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: 'inherit',
                      fontSize: '14px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>{student.name}</div>
                      <div style={{ fontSize: '12px', color: isSelected ? '#60a5fa' : '#6b7280' }}>
                        Class {student.class} · {student.section}
                      </div>
                    </div>
                    {isSelected && <span style={{ fontSize: '18px' }}>→</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Student Details */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 mb-3" style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Student Progress
          </h2>

          {detailsLoading ? (
            <div className="card text-center text-gray-400">Loading progress...</div>
          ) : studentDetails ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Stats */}
              <div className="card">
                <h3 className="font-semibold mb-4">{studentDetails.student.name}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div style={{ background: '#1f2937', borderRadius: '8px', padding: '12px' }}>
                    <div className="stat-label">Study Time</div>
                    <div className="text-xl font-bold">{Math.floor(studentDetails.progress.totalTime / 60)}<span className="text-sm text-gray-400"> min</span></div>
                  </div>
                  <div style={{ background: '#1f2937', borderRadius: '8px', padding: '12px' }}>
                    <div className="stat-label">Accuracy</div>
                    <div className="text-xl font-bold"
                      style={{ color: studentDetails.progress.accuracy >= 70 ? '#4ade80' : studentDetails.progress.accuracy >= 50 ? '#fbbf24' : '#f87171' }}>
                      {studentDetails.progress.accuracy}%
                    </div>
                  </div>
                  <div style={{ background: '#1f2937', borderRadius: '8px', padding: '12px' }}>
                    <div className="stat-label">Total Attempts</div>
                    <div className="text-xl font-bold">{studentDetails.progress.totalAttempts}</div>
                  </div>
                  <div style={{ background: '#1f2937', borderRadius: '8px', padding: '12px' }}>
                    <div className="stat-label">Correct</div>
                    <div className="text-xl font-bold text-green-400">{studentDetails.progress.correctCount}</div>
                  </div>
                </div>
              </div>

              {/* Weak Words */}
              <div className="card">
                <h3 className="font-semibold mb-3">
                  Weak Words
                  {studentDetails.progress.weakWords?.length > 0 && (
                    <span className="badge badge-red ml-2">{studentDetails.progress.weakWords.length}</span>
                  )}
                </h3>

                {studentDetails.progress.weakWords?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {studentDetails.progress.weakWords.map((word, i) => (
                      <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: '#1f2937',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}>
                        <div>
                          <span style={{ fontWeight: '600', marginRight: '8px' }}>{word.word}</span>
                          <span className="text-gray-400">{word.meaning}</span>
                        </div>
                        <span className="badge badge-red">×{word.wrongCount}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No weak words detected — great performance! 🎉</p>
                )}
              </div>
            </div>
          ) : (
            <div className="card text-center" style={{ color: '#6b7280' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>👆</div>
              <p>Select a student to view their progress</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;