import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen">
      {/* ALWAYS render Navbar safely */}
      {user && <Navbar />}

      <main className="container py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;