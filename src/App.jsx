import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LandingPage from './LandingPage';
import AppLayout from './components/layout/AppLayout';
import { ThemeProvider } from './contexts/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import ProtectedRoute from './contexts/ProtectedRoute';
import { setUser } from './redux/slices/user/userSlice';
import { useDispatch,useSelector } from 'react-redux';

const checkAuthStatus = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/auth/get-me', {
      withCredentials: true, 
    });

    console.log('User is authenticated:', response.data.user);
    return response.data.user; 
  } catch (error) {
    console.log('User is not authenticated');
    return null;
  }
};



function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
  const fetchUser = async () => {
    const data = await checkAuthStatus();
    if (data) {
      dispatch(setUser({
        userId: data.userId,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      }));
    }
    setLoading(false);
  };

  fetchUser();
}, [dispatch]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <GoogleOAuthProvider clientId="581230268677-eg6vev2epbduvi72j4btf27ca3r9ih2a.apps.googleusercontent.com">
      <ThemeProvider>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/chat" replace /> : <LandingPage />} />
            <Route element={<ProtectedRoute isAuthenticated={!!isAuthenticated} />}>
              <Route path="/chat" element={<AppLayout />} />
            </Route>
          </Routes>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
