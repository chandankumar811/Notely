import React, { useEffect, useState } from "react";
import LandingPage from "./LandingPage.jsx";
import AppLayout from "./components/layouts/AppLayout.jsx";
import { setUser } from "./redux/slices/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./index.css";

const checkIsAuthenticated = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/users/fetch-user",
      { withCredentials: true }
    );

    console.log("User data:", response.data.user);

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
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkIsAuthenticated();
      console.log("User data in App:", user);
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
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
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to={"/chat"} replace /> : <LandingPage />
        }
      />
      
      <Route path="/chat" element={!isAuthenticated ? <Navigate to={"/"} replace /> : <AppLayout />} />
    </Routes>
  );
}

export default App;
