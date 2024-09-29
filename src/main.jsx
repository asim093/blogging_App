import { createRoot } from 'react-dom/client';
import AppRouter from '../Routes/Routes.jsx'; 
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../Context/AuthContext';  
import './index.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider> 
    <RouterProvider router={AppRouter} /> 
  </AuthProvider>
);
