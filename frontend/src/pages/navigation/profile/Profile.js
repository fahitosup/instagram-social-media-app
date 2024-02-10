import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./Profile.sass";
import { useAuth } from "../../../context/AuthProvider";
import { useNavigate, useParams } from "react-router-dom";
import { useProfile } from "../../../context/ProfileContext";
import Sidenav from "../Sidenav";
import axios from "axios";
import { base } from "../../../constants";

const Profile = () => {
  const { username } = useAuth();
  const { userid } = useParams();
  const { fullName, profilePicURL, bio, follow, unfollow } = useProfile();
  const [isFollowing, setIsFollowing] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        // Assuming you have a function to make GET requests to your API
        const response = await axios.get(`${base}/api/isFollowing/${userid}`, {
          headers: {
            jwtToken: localStorage.getItem("jwtToken"),
          },
        });

        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Failed to fetch follow status", error);
      }
    };

    checkFollowStatus();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Avatar className="pfp" src={profilePicURL}></Avatar>
        <div className="profile-info">
          <span>
            <div>{userid}</div>{" "}
            {username == userid ? (
              <button onClick={() => navigate("/profile")}>Edit profile</button>
            ) : isFollowing ? (
              <button
                onClick={() => {
                  unfollow(userid);
                }}
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={() => {
                  follow(userid);
                }}
              >
                Follow
              </button>
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
