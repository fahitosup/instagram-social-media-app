import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./ProfileContext";
import { toast } from "react-toastify";
import { base } from "../constants.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { profileMade } = useProfile;

  const [username, setUsername] = useState(() =>
    localStorage.getItem("jwtToken")
      ? jwtDecode(localStorage.getItem("jwtToken")).user.id
      : null
  );
  /*   const [username, setUsername] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens")).username
      : null
  );
 */
  const [results, setResults] = useState([]);

  const [error, setError] = useState();

  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const body = { username: username, password: password };
      const response = await fetch(`${base}/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      if (parseRes.jwtToken) {
        setIsAuthenticated(true);
        localStorage.setItem("jwtToken", parseRes.jwtToken);
        toast.success("Logged in!");
        navigate("");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("jwtToken");
    setIsAuthenticated(false);
    navigate("login");
  };

  const registerUser = async (email, username, password, password2) => {
    if (password != password2) {
      alert("Password's don't match!");
    } else {
      const response = await fetch(`${base}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      const parseRes = await response.json();
      localStorage.setItem("jwtToken", parseRes.jwtToken);

      if (response.ok) {
        navigate("login");
      } else {
        setError(parseRes.error);
      }
    }
  };

  const createProfile = async (full_name, bio, image) => {
    const formData = new FormData();

    formData.append("full_name", full_name);
    formData.append("bio", bio);
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://localhost:3001/api/create-profile/",
        {
          method: "POST",
          body: formData,
          headers: {
            jwtToken: localStorage.getItem("jwtToken"),
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
  /*  const fetchData = (value) => {
    fetch("http://localhost:8000/api/users")
      .then((response) => response.json())
      .then((json) => {
        const results1 = json.filter((user) => {
          return value && user.username.toLowerCase().includes(value);
        });
        setResults(results1);
      });
  }; */

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        registerUser,
        createProfile,
        //  updateProfile,
        username,

        results,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
