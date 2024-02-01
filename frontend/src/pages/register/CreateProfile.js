import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.sass";
import instagramlogo from "../../assets/login/instalogo-black.png";

import { Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthProvider";
import { useProfile } from "../../context/ProfileContext";

const CreateProfile = ({ children }) => {
  const { createProfile, updateProfile, username } = useAuth();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profileMade) {
      updateProfile(fullName, bio, profilePic, pk);
    } else {
      createProfile(fullName, bio, profilePic);
    }
  };

  return (
    <div id="register">
      <div className="login-container">
        <div className="auth-form-container">
          <div className="login-form-container">
            <img
              className="sidenav__logo"
              src={instagramlogo}
              alt="Instagram Logo"
            />
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="profile-pic">
                  <Avatar
                    className="pfp"
                    onClick={() => document.getElementById("pfp-input").click()}
                    src={profilePicURL ? profilePicURL : null}
                  ></Avatar>
                  <input
                    id="pfp-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setProfilePicURL(URL.createObjectURL(e.target.files[0]));
                      setProfilePic(e.target.files[0]);
                    }}
                    style={{ display: "none" }}
                  />
                  {profileMade ? (
                    <div>
                      Welcome back {username}!, update things if necessary.
                    </div>
                  ) : (
                    <div>
                      Welcome {username}!, tell us a bit more about yourself!
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  className="form-control"
                  id="full_name"
                  name="full_name"
                  value={fullName}
                  onChange={(event) => setfullName(event.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <textarea
                  type="text"
                  className="form-control"
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Biography"
                ></textarea>
                {profileMade ? (
                  <button type="submit" className="btn btn-primary">
                    Update profile
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Create profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
