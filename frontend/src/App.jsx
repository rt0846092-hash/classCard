import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import Layout from './components/Layout';
import PinnedQuiz from './pages/PinnedQuiz';
import ReviewQuiz from './pages/ReviewQuiz';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudyMode from './pages/StudyMode';
import QuizMode from './pages/QuizMode';
import ReviewMode from './pages/ReviewMode';
import PinnedWords from './pages/PinnedWords';
import TeacherDashboard from './pages/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';
import './styles/main.css';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, loading } = useContext(AuthContext);

  // 🔥 SAFETY CHECK (prevents crash loops)
  const isAuthValid = user && typeof user === 'object';

  return (
    <Router>
      {/* GLOBAL LOADING ONLY */}
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div style={{ fontSize: '24px', color: 'white' }}>
            Loading...
          </div>
        </div>
      ) : (
        <>
          <Layout>
            <Routes>

              {/* PUBLIC ROUTES */}
              <Route
                path="/login"
                element={
                  !isAuthValid
                    ? <Login />
                    : <Navigate to="/dashboard" replace />
                }
              />

              <Route
                path="/register"
                element={
                  !isAuthValid
                    ? <Register />
                    : <Navigate to="/dashboard" replace />
                }
              />

              {/* PROTECTED ROUTES */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/study/:level"
                element={
                  <ProtectedRoute>
                    <StudyMode />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/quiz/:level"
                element={
                  <ProtectedRoute>
                    <QuizMode />
                  </ProtectedRoute>
                }
              />

             {/* 📌 PINNED */}
            <Route
               path="/pinned-study"
                element={
               <ProtectedRoute>
               <PinnedWords />
              </ProtectedRoute>
          }
           />

           <Route
           path="/pinned-quiz"
            element={
            <ProtectedRoute>
               <PinnedQuiz />
                  </ProtectedRoute>
               }
               />

              {/* 🔁 REVIEW */}
           <Route
             path="/review-study"
              element={
                <ProtectedRoute>
                  <ReviewMode />
                 </ProtectedRoute>
            }
          />

          <Route
         path="/review-quiz"
            element={
            <ProtectedRoute>
           <ReviewQuiz />
         </ProtectedRoute>
            }
               />

              <Route
                path="/teacher"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <TeacherDashboard />
                  </ProtectedRoute>
                }
              />

              {/* DEFAULT */}
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />

            </Routes>
          </Layout>

          <Toaster />
        </>
      )}
    </Router>
  );
}

export default App;