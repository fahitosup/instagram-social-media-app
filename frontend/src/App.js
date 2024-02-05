import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import Homepage from "./homepage/Homepage";

import "./pages/login/login.sass";
import Login from "./pages/login/login";
import Register from "./pages/register/Register";
import CreateProfile from "./pages/register/CreateProfile";
import Profile from "./pages/navigation/profile/Profile";
import { jwtDecode } from "jwt-decode";
import { useProfile } from "./context/ProfileContext";
import { useAuth } from "./context/AuthProvider";
import axios from "axios";
import { base } from "./constants";

function App() {
  const { isAuthenticated, setIsAuthenticated, username, setUsername } =
    useAuth();
  const { setProfileMade, setBio, setfullName } = useProfile();

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const jwtToken = localStorage.getItem("jwtToken");

      if (jwtToken) {
        setUsername(jwtDecode(localStorage.getItem("jwtToken")).user.id);
        try {
          const response = await axios.get(`${base}/verify`, {
            headers: {
              jwtToken: jwtToken, // Adjust if you store the token differently
            },
          });
          setIsAuthenticated(true);
        } catch (err) {
          navigate("login");
        }
      } else {
        navigate("login");
      }
    };
    const checkProfile = async () => {
      try {
        const response = await axios.get(`${base}/api/check-profile`, {
          headers: {
            jwtToken: localStorage.getItem("jwtToken"),
          },
        });
        setProfileMade(true);
        setfullName(response.data.profile.full_name);
        setBio(response.data.profile.bio);
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth();
    checkProfile();
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
