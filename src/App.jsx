import React, { useEffect, useState } from "react";
import LandingPage from "./LandingPage";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
 
import AppLayout from "./components/layouts/AppLayout.jsx";
import { setUser } from "./redux/slices/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Navigate, Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./contexts/ProtectedRoute.js";

const checkIsAuthenticated = async () => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/v1/users/fetch-user",
      { withCredentials: true }
    );

    return response.data.user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
};

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkIsAuthenticated();
      if (user) {
        dispatch(
          setUser({
            userId: user.userId,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            phoneNumber: user.phoneNumber,
            address: user.address,
            isAuthentication: true,
          })
        );
      }
      setLoading(false);
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
     <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <ThemeProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to={"/chat"} replace/> : <LandingPage />} />
          <Route element={<ProtectedRoute isAuthenticated={!!isAuthenticated} />}>
          <Route path="/chat" element={<AppLayout />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </ThemeProvider>
      </GoogleOAuthProvider>
  );
}

export default App;
