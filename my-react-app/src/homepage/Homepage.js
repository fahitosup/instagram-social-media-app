import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.sass";
import { Timeline } from "../pages/timeline/Timeline";
import Sidenav from "../pages/navigation/Sidenav";
import Suggestions from "../pages/suggestions/Suggestions";
import { useAuth } from "../context/AuthProvider";
import { CreateProfile } from "../pages/register/CreateProfile";
import { useProfile } from "../context/ProfileContext";

const Homepage = () => {
  const { createProfile, updateProfile, authTokens, username } = useAuth();

  return (
    <div className="homepage">
      <div className="homepage__nav">
        <Sidenav />
      </div>
      <div className="homepage__timeline">
        <Timeline />
      </div>
      <div className="homepage__nav">
        <Suggestions />
      </div>
    </div>
  );
};

export default Homepage;
