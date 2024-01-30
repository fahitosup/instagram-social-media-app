import { Avatar } from "@mui/material";
import "./Suggestions.sass";

import React from "react";

const Suggestions = () => {
  return (
    <div className="suggestions">
      <div className="suggestions_title">Suggestions for you</div>
      <div className="suggestions_usernames">
        <div className="suggestion_username">
          <div className="username_left">
            <span className="avatar">
              <Avatar>F</Avatar>
            </span>
            <div className="username_info">
              <span className="username">fahitosup</span>
              <span className="relation">New to Instagram</span>
            </div>
          </div>
          <button className="follow_button">Follow</button>
        </div>
        <div className="suggestion_username">
          <div className="username_left">
            <span className="avatar">
              <Avatar>F</Avatar>
            </span>
            <div className="username_info">
              <span className="username">fahitosup</span>
              <span className="relation">New to Instagram</span>
            </div>
          </div>
          <button className="follow_button">Follow </button>
        </div>
        <div className="suggestion_username">
          <div className="username_left">
            <span className="avatar">
              <Avatar>F</Avatar>
            </span>
            <div className="username_info">
              <span className="username">fahitosup</span>
              <span className="relation">New to Instagram</span>
            </div>
          </div>
          <button className="follow_button">Follow</button>
        </div>
        <div className="suggestion_username">
          <div className="username_left">
            <span className="avatar">
              <Avatar>F</Avatar>
            </span>
            <div className="username_info">
              <span className="username">fahitosup</span>
              <span className="relation">New to Instagram</span>
            </div>
          </div>
          <button className="follow_button">Follow</button>
        </div>
        <div className="suggestion_username">
          <div className="username_left">
            <span className="avatar">
              <Avatar>F</Avatar>
            </span>
            <div className="username_info">
              <span className="username">fahitosup</span>
              <span className="relation">New to Instagram</span>
            </div>
          </div>
          <button className="follow_button">Follow</button>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
