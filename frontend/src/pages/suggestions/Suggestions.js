import { Avatar } from "@mui/material";
import "./Suggestions.sass";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { base } from "../../constants.js";

const Suggestions = () => {
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);
  useEffect(() => {
    const getUsernames = async () => {
      const response = await axios.get(`${base}/usernames`);
      if (response) {
        setUsernames(response.data.data.usernames);
      }
    };
    getUsernames();
  }, []);

  return (
    <div className="suggestions">
      <div className="suggestions_title">Suggestions for you</div>
      <div className="suggestions_usernames">
        {usernames.map((user, index) => (
          <div className="suggestion_username">
            <div className="username_left">
              <span
                className="avatar"
                onClick={() => navigate(`/${user.username}`)}
              >
                <Avatar>{user.username[0]}</Avatar>
              </span>
              <div className="username_info">
                <span
                  className="username"
                  onClick={() => navigate(`/${user.username}`)}
                >
                  {user.username}
                </span>
                <span className="relation">New to Instagram</span>
              </div>
            </div>
            <button className="follow_button">Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
