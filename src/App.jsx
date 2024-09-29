import React, { useContext } from 'react';
import { AuthProvider } from '../Context/AuthContext';
import Navbar from './Components/Navbar/Navbar';
import Login from './Pages/Login/Login';
import Allblog from './Pages/AllBlog/Allblog';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthContext from '../Context/AuthContext.jsx';

const App = () => {
  const { darkmode } = useContext(AuthContext); // Retri

  return (
    <AuthProvider>
      <div className={`app ${darkmode ? 'dark' : ''}`}>
        <Navbar />
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/allblog" element={<Allblog />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
};

export default App;
