import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useAuth } from "../../context/AuthProvider";
import { useForm } from "react-hook-form";
import bar1 from "../../assets/login/1.png";
import bar2 from "../../assets/login/2.png";
import bar3 from "../../assets/login/3.png";
import iphonebackground from "../../assets/login/iphone-background.png";
import instagramlogo from "../../assets/login/instalogo-black.png";

import "./Login.sass";

const Login = () => {
  const [state, setState] = useState({
    bars: [bar1, bar2, bar3],
    activeImageIndex: 0,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      let newActiveIndex =
        state.activeImageIndex === 2 ? 0 : state.activeImageIndex + 1;
      setState((prevState) => ({
        ...prevState,
        activeImageIndex: newActiveIndex,
      }));
    }, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [state.activeImageIndex]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const { login, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log(isAuthenticated);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();

    login(username, password);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  };

  return (
    <div id="login">
      {!user ? (
        <div className="login-container">
          <div className="login-img-container">
            <img
              src={state.bars[state.activeImageIndex]}
              className="overlay-image"
            />
            <img src={iphonebackground} />
          </div>
          <div className="auth-form-container">
            <div className="login-form-container">
              <img
                className="sidenav__logo"
                src={instagramlogo}
                alt="Instagram Logo"
              />
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleUserNameChange}
                    placeholder="Phone number, username, or email"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                  />
                  <div>
                    {error && <small className="text-danger">{error}</small>}
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Log in
                  </button>
                </div>
              </form>
            </div>
            <div className="register-form-container">
              <div className="auth-form-container">
                <p>
                  Don't have an account
                  <span onClick={() => navigate("/register")}>Sign up</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        navigate("")
      )}
    </div>
  );
};

export default Login;
