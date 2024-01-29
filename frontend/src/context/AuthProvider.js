import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useProfile } from "./ProfileContext";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { profileMade } = useProfile;
  /*   const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("jwtToken")
      ? JSON.parse(localStorage.getItem("jwtToken"))
      : null
  ); */

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

  const navigate = useNavigate();

  const login = async (username, password) => {
    try {
      const body = { username: username, password: password };
      const response = await fetch("http://localhost:3001/api/login/", {
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

    /*
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
    */
  };

  /* const isAuth = async () => {
    try {
      const response = await fetch("http://localhost:3001/verify", {
        method: "GET",
        headers: { jwtToken: localStorage.jwtToken },
      });

      const parseRes = await response.json();

      if (parseRes === true) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
 */
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
      const response = await fetch("http://localhost:3001/api/register", {
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
    }
  };

  /*  const createProfile = async (full_name, bio, image) => {
    const formData = new FormData();

    formData.append("full_name", full_name);
    formData.append("bio", bio);
    formData.append("image", image);

    try {
      const response = await fetch(
        "http://localhost:8000S/api/register/create-profile",
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
 */
  /*  const updateProfile = async (full_name, bio, image, pk) => {
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
  }; */
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
        login,
        logout,
        //authTokens,
        //user,
        registerUser,
        // isAuth,
        // createProfile,
        //  updateProfile,
        username,
        // fetchData,
        results,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
