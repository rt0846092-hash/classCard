import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [levels, setLevels] = useState([]);
  const [stats, setStats] = useState({
    totalTime: 0,
    accuracy: 0,
    wrongWords: 0,
    pinnedCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ LOAD LEVELS (student only)
        if (user?.role === 'student') {
          const levelsRes = await api.get('/vocabulary/levels');
          setLevels(Array.isArray(levelsRes.data) ? levelsRes.data : []);
        }

        // ✅ LOAD STATS
        const progressRes = await api.get('/progress/my-progress');
        const pinnedRes = await api.get('/pins');

        const progress = progressRes.data || [];
        const pinned = pinnedRes.data || [];

        const total = progress.length;
        const correct = progress.filter(p => p.correct).length;

        setStats({
          totalTime: progress.reduce((s, p) => s + (p.timeSpent || 0), 0),
          accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,

          // 🔥 REVIEW RULE
          wrongWords: progress.filter(
            p => p.wrongCount > p.correctCount
          ).length,

          pinnedCount: pinned.length
        });

      } catch (err) {
        console.error('Dashboard error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="fade-up">

      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">
          Welcome back, {user.name} 👋
        </h1>

        <p className="text-gray-400 text-sm">
          {user.section && (
            <span className="badge badge-blue mr-2">
              {user.section}
            </span>
          )}
          {user.class && <span>Class {user.class}</span>}
        </p>
      </div>

      {/* ================= STUDENT VIEW ================= */}
      {user.role === 'student' && (
        <>

          {/* ================= STATS ================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

            <div className="stat-card">
              <span className="stat-label">Study Time</span>
              <span className="stat-value">
                {loading ? '...' : `${Math.floor(stats.totalTime / 60)} min`}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">
                {loading ? '...' : `${stats.accuracy}%`}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">To Review</span>
              <span className="stat-value">
                {loading ? '...' : stats.wrongWords}
              </span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Pinned</span>
              <span className="stat-value">
                {loading ? '...' : stats.pinnedCount}
              </span>
            </div>

          </div>

          {/* ================= PIN + REVIEW ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

            {/* 📌 PINNED */}
            <div className="card flex justify-between items-center">
              <div>
                <p className="font-semibold">📌 Pinned Words</p>
                <p className="text-sm text-gray-400">
                  {stats.pinnedCount > 0
                    ? `${stats.pinnedCount} saved`
                    : 'No pinned words'}
                </p>
              </div>

              <div className="flex gap-2">
                <Link to="/pinned-study" className="btn btn-warning">
                  📖 Study
                </Link>
                <Link
                  to="/pinned-quiz"
                  className="btn"
                  style={{ background: '#8b5cf6', color: '#fff' }}
                >
                  🧠 Quiz
                </Link>
              </div>
            </div>

            {/* 🔁 REVIEW */}
            <div className="card flex justify-between items-center">
              <div>
                <p className="font-semibold">🔁 Review Words</p>
                <p className="text-sm text-gray-400">
                  {stats.wrongWords > 0
                    ? `${stats.wrongWords} to review`
                    : 'Nothing to review 🎉'}
                </p>
              </div>

              <div className="flex gap-2">
                <Link to="/review-study" className="btn btn-danger">
                  📖 Study
                </Link>
                <Link
                  to="/review-quiz"
                  className="btn"
                  style={{ background: '#8b5cf6', color: '#fff' }}
                >
                  🧠 Quiz
                </Link>
              </div>
            </div>

          </div>

          {/* ================= LEVELS ================= */}
          <h2 className="text-xl font-bold mb-4">
            Vocabulary Sections
          </h2>

          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : levels.length === 0 ? (
            <div className="text-gray-400">
              No vocabulary levels found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {levels.map((level) => (
                <div
                  key={level}
                  className="card flex justify-between items-center"
                >

                  <div>
                    <p className="font-semibold">{level}</p>
                    <p className="text-sm text-gray-400">
                      Vocabulary set
                    </p>
                  </div>

                  <div className="flex gap-2">

                    {/* STUDY */}
                    <Link
                      to={`/study/${level}`}
                      className="btn btn-primary"
                    >
                      📖 Study
                    </Link>

                    {/* QUIZ DROPDOWN */}
                    <select
                      className="btn"
                      onChange={(e) => {
                        if (!e.target.value) return;
                        navigate(`/quiz/${level}?count=${e.target.value}`);
                      }}
                    >
                      <option value="">🧠 Quiz</option>
                      <option value="10">10 Questions</option>
                      <option value="20">20 Questions</option>
                      <option value="50">50 Questions</option>
                    </select>

                  </div>

                </div>
              ))}

            </div>
          )}

        </>
      )}

      {/* ================= TEACHER VIEW ================= */}
      {user.role === 'teacher' && (
        <div className="card">
          <h2 className="text-xl font-bold mb-2">
            👨‍🏫 Teacher Dashboard
          </h2>

          <p className="text-gray-400 mb-4">
            View your students and track their progress
          </p>

          <Link to="/teacher" className="btn btn-primary">
            View Students →
          </Link>
        </div>
      )}

    </div>
  );
};

export default Dashboard;