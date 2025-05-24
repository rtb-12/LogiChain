import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Navigation */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Optional Footer */}
      {/* You can add a footer here if needed */}
    </div>
  );
};

export default Layout;