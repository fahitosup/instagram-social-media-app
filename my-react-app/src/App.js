import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";

import logo from "./logo.svg";
import "./App.css";
import Homepage from "./homepage/Homepage";

import "./pages/login/Login.sass";
import Login from "./pages/login/login";
import Register from "./pages/register/Register";
import CreateProfile from "./pages/register/CreateProfile";
import Profile from "./pages/navigation/profile/Profile";
import { useProfile } from "./context/ProfileContext";
import { useAuth } from "./context/AuthProvider";

function App() {
  const { authTokens } = useAuth();
  const {
    profilePicURL,
    setProfilePicURL,
    profilePic,
    setProfilePic,
    pk,
    setpk,
    profileMade,
    setProfileMade,
    fullName,
    setfullName,
    bio,
    setBio,
  } = useProfile();

  const navigate = useNavigate();

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
