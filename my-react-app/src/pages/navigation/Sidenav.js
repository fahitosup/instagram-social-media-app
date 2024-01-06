import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidenav.sass";
import Modal from "@material-ui/core/Modal";
import Box from "@mui/material/Box";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ExploreIcon from "@mui/icons-material/Explore";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import MenuIcon from "@mui/icons-material/Menu";
import { Avatar, formControlClasses, useAutocomplete } from "@mui/material";
import { useAuth } from "../../context/AuthProvider";
import PostModal from "./PostModal";
import SearchBar from "./search/SearchBar";
import { useProfile } from "../../context/ProfileContext";

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
    formData.append("link", selectedFile);
    formData.append("likes", likes);
    formData.append("time", timestamp.toISOString());
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Convert the JavaScript object to a JSON string
    const formDataJSON = JSON.stringify(formDataObject);

    console.log(formDataJSON);

    fetch("http://localhost:8000/posts/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Post created:", data);
        setModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
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
          <button
            className="sidenav__button"
            onClick={() => {
              navigate(`/${username}`);
            }}
          >
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
              <button className="logout__button" onClick={logout}>
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
