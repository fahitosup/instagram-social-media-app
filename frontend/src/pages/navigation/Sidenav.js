import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidenav.sass";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Avatar, formControlClasses, useAutocomplete } from "@mui/material";
import { useAuth } from "../../context/AuthProvider";
import PostModal from "./PostModal";
import SearchBar from "./search/SearchBar";
import { useProfile } from "../../context/ProfileContext";
import { base } from "../../constants.js";

function Sidenav() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [divVisible, setDivVisible] = useState(false);
  const [likes, setlikes] = useState(5);
  const { isAuthenticated, logout, username } = useAuth();
  const { profilePicURL } = useProfile();

  // new data

  const [selectedFile, setSelectedFile] = useState(null);
  const [isVisible, setVisible] = useState(false);
  const [userId, setUserId] = useState("fahitosup");
  const [caption, setcaption] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleCaptionChange = (e) => {
    setcaption(e.target.value);
  };

  const search = () => {
    setVisible(!isVisible);
  };
  const handleFormSubmit = () => {
    const timestamp = new Date();
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("caption", caption);
    formData.append("file", selectedFile);
    formData.append("likes", likes);
    formData.append("time", timestamp.toISOString());

    axios
      .post(`${base}/upload`, formData)
      .then((res) => {
        console.log("Post created:", res.data);
        setModalOpen(false);
        window.location.reload();
      })
      .catch((err) => {
        console.error("Error creating post:", err);
      });
  };
  const handleNextButtonClick = () => {
    // Perform actions to resize the image and place it in the corner
    // You can manipulate the image's CSS properties here
    // For this example, we'll just set a fixed width and position it in the corner
    const image = document.getElementById("modal-image");
    image.style.width = "200px"; // Adjust the size as needed

    image.style.bottom = "10px";
    image.style.right = "10px";

    image.classList.add("image-transition");

    setDivVisible(true);
  };

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="sidenav">
      <img
        className="sidenav__logo"
        src="https://www.pngkey.com/png/full/828-8286178_mackeys-work-needs-no-elaborate-presentation-or-distracting.png"
        alt="Instagram Logo"
      />
      <div className="sidenav__opened">
        <div className="sidenav__buttons">
          <button
            className="sidenav__button"
            onClick={() => {
              if (location.pathname == "/") {
                window.location.reload();
              } else {
                navigate("/");
              }
            }}
          >
            <HomeIcon />
            <span>Home</span>
          </button>
          <button className="sidenav__button" onClick={search}>
            <SearchIcon />
            <span>Search</span>
          </button>

          <button className="sidenav__button" onClick={openModal}>
            <AddCircleOutlineIcon />
            <span>Create</span>
          </button>
          <PostModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            handleNextButtonClick={handleNextButtonClick}
            handleCaptionChange={handleCaptionChange}
            handleFormSubmit={handleFormSubmit}
            handleFileUpload={handleFileUpload}
            selectedFile={selectedFile}
            caption={caption}
            divVisible={divVisible}
          />
          <button className="sidenav__button">
            <Avatar src={profilePicURL}></Avatar>
            <span>
              <span
                style={{ marginRight: "10px" }}
                onClick={() => {
                  navigate(`/${username}`);
                }}
              >
                {username}
              </span>
              <button className="logout__button" onClick={(e) => logout(e)}>
                Logout
              </button>
            </span>
          </button>
        </div>
        <div className={`sidenav__div ${isVisible ? `visible` : ``}`}>
          <SearchBar />
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
