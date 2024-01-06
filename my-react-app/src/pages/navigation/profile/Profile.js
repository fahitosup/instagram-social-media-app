import { Avatar } from "@material-ui/core";
import React, { useEffect } from "react";
import "./Profile.sass";
import { useAuth } from "../../../context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../../../context/ProfileContext";

const Profile = () => {
  const { username } = useAuth();
  const { userid } = useParams();
  const { fullName, profilePicURL, bio } = useProfile();
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Avatar className="pfp" src={profilePicURL}></Avatar>
        <div className="profile-info">
          <span>
            <div>{userid}</div>{" "}
            {username == userid ? (
              <button onClick={() => navigate("/profile")}>Edit profile</button>
            ) : (
              <button>Follow</button>
            )}
          </span>
          <div className="follow-info">
            <div>27 posts</div>
            <div>230 followers</div>
            <div>49 following</div>
          </div>
          <div style={{ fontWeight: "bold", marginBottom: 10 }}>{fullName}</div>
          <div>{bio}</div>
        </div>
      </div>
      <div className="profile-posts">
        <div>POSTS</div>
      </div>
    </div>
  );
};

export default Profile;
