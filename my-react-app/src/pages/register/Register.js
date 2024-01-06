import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useAuth } from "../../context/AuthProvider";

import instagramlogo from "../../assets/login/instalogo-black.png";

import "./Register.sass";
import "./CreateProfile.sass";

const cookies = new Cookies();

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { registerUser } = useAuth();
  const { user } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();

    registerUser(email, username, password, password2);
  };

  return (
    <div id="register">
      {!user ? (
        <div className="login-container">
          <div className="auth-form-container">
            <div className="login-form-container">
              <img
                className="sidenav__logo"
                src={instagramlogo}
                alt="Instagram Logo"
              />
              <form onSubmit={handleSignUp}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email address"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username"
                  />
                  <div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control"
                        id="username"
                        name="username"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Password"
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="password"
                        className="form-control"
                        id="username"
                        name="username"
                        value={password2}
                        onChange={(event) => setPassword2(event.target.value)}
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                  <p>
                    By signing up, you agree to our Terms , Privacy Policy and
                    Cookies Policy .
                  </p>
                  <button type="submit" className="btn btn-primary">
                    Sign up
                  </button>
                </div>
              </form>
            </div>
            <div className="register-form-container">
              <div className="auth-form-container">
                <p>
                  Have an account?
                  <span onClick={() => navigate("/login")}>Log in</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="login-container">
          <h1>React Cookie Auth</h1>
          <p>You are logged in!</p>
          <button className="btn btn-primary mr-2">WhoAmI</button>
          <button className="btn btn-danger">Log out</button>
        </div>
      )}
    </div>
  );
};

export default Register;
