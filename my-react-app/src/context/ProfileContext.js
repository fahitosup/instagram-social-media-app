import React, { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profilePicURL, setProfilePicURL] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [pk, setpk] = useState(null);
  const [profileMade, setProfileMade] = useState(false);
  const [fullName, setfullName] = useState("");
  const [bio, setBio] = useState("");

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
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
