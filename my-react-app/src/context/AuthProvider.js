import React, { createContext, useContext, useState, useEffect } from "react";
import { useTransition } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useProfile } from "./ProfileContext";

const AuthContext = createContext();

const cookie = new Cookies();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { profileMade } = useProfile;
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  const [username, setUsername] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens")).username
      : null
  );
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const login = async (username, password) => {
    const response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ username: username, password: password }),
      credentials: "same-origin",
    });
    let data = await response.json();
    if (response.ok) {
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      setIsAuthenticated(true);
      setUsername(username);
      if (profileMade) {
        navigate("");
      } else {
        navigate("profile");
      }
    } else {
      setUsername("");
      alert("Invalid credentials, please try again!");
    }
  };

  const logout = (event) => {
    event.preventDefault();
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/login");
  };

  const registerUser = async (email, username, password, password2) => {
    const response = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        password2,
      }),
    });
    if (response.status === 201) {
      navigate("/login");
    } else {
      console.log(response.status);
      console.log("There was a server issue!");
    }
  };

  const createProfile = async (full_name, bio, image) => {
    const formData = new FormData();

    formData.append("full_name", full_name);
    formData.append("bio", bio);
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://localhost:8000/api/register/create-profile",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Profile created:", data);
      } else {
        console.error("Failed to create profile!");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  const updateProfile = async (full_name, bio, image, pk) => {
    const formData = new FormData();

    formData.append("full_name", full_name);
    formData.append("bio", bio);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/register/update-profile/${pk}/`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${authTokens.access}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Profile updated:", data);
        navigate("/");
      } else {
        console.error("Failed to update profile!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const fetchData = (value) => {
    fetch("http://localhost:8000/api/users")
      .then((response) => response.json())
      .then((json) => {
        const results1 = json.filter((user) => {
          return value && user.username.toLowerCase().includes(value);
        });
        setResults(results1);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        authTokens,
        user,
        registerUser,
        createProfile,
        updateProfile,
        username,
        fetchData,
        results,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
