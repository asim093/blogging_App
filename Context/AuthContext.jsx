import { createContext, useState } from 'react';

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLike, setIsLike] = useState([]);
  const [darkmode, Setdarkmode] = useState(false);
  const [typography, setTypography] = useState('font-sans'); 

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      isLike, 
      setIsLike, 
      darkmode, 
      Setdarkmode, 
      typography, 
      setTypography 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
