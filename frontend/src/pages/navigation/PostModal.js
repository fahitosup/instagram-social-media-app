import React from "react";
import Modal from "@material-ui/core/Modal";
import { Avatar } from "@material-ui/core";
import Box from "@mui/material/Box";

const PostModal = ({
  isOpen,
  closeModal,
  handleNextButtonClick,
  handleCaptionChange,
  handleFormSubmit,
  handleFileUpload,
  selectedFile,
  caption,
  divVisible,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="create_post">
        <div>
          <div className="upload">
            <button
              className="upload-next"
              onClick={handleNextButtonClick}
              style={{ opacity: 0 }}
            >
              Next
            </button>
          </div>
          {selectedFile ? (
            <p id="modal-description">Edit</p>
          ) : (
            <p id="modal-description">Create new post</p>
          )}
          <div className="upload">
            {selectedFile ? (
              <button className="upload-next" onClick={handleNextButtonClick}>
                Next
              </button>
            ) : (
              <button
                className="upload-next"
                onClick={handleNextButtonClick}
                style={{ opacity: 0 }}
              >
                Next
              </button>
            )}
          </div>
        </div>
        <div className="caption-image">
          {selectedFile ? (
            <img id="modal-image" src={URL.createObjectURL(selectedFile)} />
          ) : null}
          <div
            className={`caption-holder ${divVisible ? "visible" : "hidden"}`}
          >
            <div style={{ display: "block" }}>
              <Avatar>F</Avatar> <h4>fahitosup</h4>
              <input
                onChange={handleCaptionChange}
                placeholder="Write a caption"
                name={caption}
              />
              <button onClick={handleFormSubmit}>Create Post</button>
            </div>
          </div>
        </div>
        <div>
          {selectedFile ? null : (
            <button
              onClick={() => document.getElementById("fileInput").click()}
            >
              Select from computer
            </button>
          )}

          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default PostModal;
