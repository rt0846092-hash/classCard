import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-3xl font-bold text-center mb-8">Login to ClassCard</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            Login
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#60a5fa' }}>
            Register
          </Link>
        </p>

        <div className="mt-6" style={{ background: '#1f2937', padding: '16px', borderRadius: '8px' }}>
          <p className="text-sm text-gray-400">Demo Accounts:</p>
          <p className="text-sm text-gray-300">Student: student@classcard.com / password123</p>
          <p className="text-sm text-gray-300">Teacher: teacher@classcard.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;