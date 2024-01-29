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

function App() {
  const { authTokens, isAuthenticated, isAuth, username } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (typeof username == "string") {
      navigate("");
    } else {
      navigate("login");
    }
  }, []);

  /* 
  useEffect(() => {
    if (authTokens?.access) {
      fetch("http://localhost:8000/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authTokens?.access}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(response);
          if (response) {
            if (response.profile) {
              setProfileMade(true);
              setBio(response.profile.bio);
              setfullName(response.profile.full_name);
              setProfilePicURL(response.profile.image);
              setpk(response.profile.id);
            } else {
              setProfileMade(false);
            }
          }
        });
    } else {
      navigate("/login");
    }
  }, []);
  */

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
