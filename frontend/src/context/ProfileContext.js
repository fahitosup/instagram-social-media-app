import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { base } from "../constants";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profilePicURL, setProfilePicURL] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [pk, setpk] = useState(null);
  const [profileMade, setProfileMade] = useState(false);
  const [fullName, setfullName] = useState("");
  const [bio, setBio] = useState("");

  const follow = async (following_username) => {
    try {
      const response = await axios.post(
        `${base}/api/follow`,
        { following_username },
        {
          headers: {
            jwtToken: localStorage.getItem("jwtToken"),
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const unfollow = async (following_username) => {
    try {
      const response = await axios.delete(`${base}/api/unfollow`, {
        data: { following_username }, // Correctly placing the body in the data property
        headers: {
          // Ensure this is the expected header for your authorization token
          jwtToken: localStorage.getItem("jwtToken"),
        },
      });
      console.log(response.data); // Handle success response
    } catch (error) {
      console.log(error.response ? error.response.data : error.message); // More detailed error handling
    }
  };

  return (
    <ProfileContext.Provider
      value={{
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
        follow,
        unfollow,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
