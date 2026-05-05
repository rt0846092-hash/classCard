import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    class: '',
    section: 'Beginner',
    teacherId: ''
  });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Register clicked"); // 👈 ADD THIS

  const result = await register(formData);

  console.log("Result:", result); // 👈 ADD THIS

  if (result.success) {
    toast.success('Registration successful!');
    navigate('/dashboard');
  } else {
    toast.error(result.error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-3xl font-bold text-center mb-8">Register for ClassCard</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          
          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label className="form-label">Class</label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Section</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School Basic">High School Basic</option>
                  <option value="CSAT Level">CSAT Level</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Teacher Email</label>
                <input
                  type="email"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  placeholder="Enter teacher's email"
                  className="form-input"
                  required
                />
              </div>
            </>
          )}
          
          <button
            type="submit"
            className="btn btn-success"
            style={{ width: '100%', padding: '12px' }}
          >
            Register
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#60a5fa' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;