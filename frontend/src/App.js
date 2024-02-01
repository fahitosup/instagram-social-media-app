import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import Homepage from "./homepage/Homepage";

import "./pages/login/login.sass";
import Login from "./pages/login/login";
import Register from "./pages/register/Register";
import CreateProfile from "./pages/register/CreateProfile";
import Profile from "./pages/navigation/profile/Profile";
import { useProfile } from "./context/ProfileContext";
import { useAuth } from "./context/AuthProvider";
import axios from "axios";
import { base } from "./constants";

function App() {
  const { isAuthenticated, setIsAutheticated, username } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    /* if (typeof username != "string") {
      navigate("login");
    } */
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${base}/verify`, {
          headers: {
            jwtToken: localStorage.getItem("jwtToken"), // Adjust if you store the token differently
          },
        });

        if (response.status === 200) {
          // Token is valid, user is authenticated
          setIsAutheticated(true); // Uncomment or use similar based on your auth context
        }
      } catch (error) {
        // Handle 401 Unauthorized or other errors
        if (error.response && error.response.status === 401) {
          // setIsAuthenticated(false); // Uncomment or use similar based on your auth context
          navigate("/login");
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route element={<Homepage />} path="" />
        <Route element={<CreateProfile />} path="profile" />
        <Route element={<Profile />} path=":userid" />
        <Route element={<Login />} path="login" />
        <Route element={<Register />} path="register" />
      </Routes>
    </div>
  );
}

export default App;
