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

  const [profile_deets, setProfile_deets] = useState({
    followers: 0,
    following: 0,
    post_count: 0,
    posts: [],
  });
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
    const profileDetails = async () => {
      try {
        const response = await axios.get(
          `${base}/api/profile-details/${userid}`,
          {
            headers: {
              jwtToken: localStorage.getItem("jwtToken"),
            },
          }
        );
        const modifiedPosts = response.data.userPosts.map((post) => ({
          ...post,
          link: post.link.replace(/^public\\images\\/, `${base}/images/`),
        }));
        setProfile_deets((values) => ({
          ...values,
          followers: response.data.followerCount,
          following: response.data.followingCount,
          post_count: response.data.userPosts.length,
          posts: modifiedPosts,
        }));
      } catch (error) {
        console.error("Failed to fetch profile data", error);
      }
    };
    profileDetails();
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
            <div>{profile_deets.post_count} posts</div>
            <div>{profile_deets.followers} followers</div>
            <div>{profile_deets.following} following</div>
          </div>
          <div style={{ fontWeight: "bold", marginBottom: 10 }}>{fullName}</div>
          <div>{bio}</div>
        </div>
      </div>
      <div className="profile-posts">
        <div>POSTS</div>
        <div className="profile-posts-collage">
          {profile_deets.posts?.map((post) => (
            <img src={post.link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
