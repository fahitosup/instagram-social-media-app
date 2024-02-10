const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authorize = require("./middleware/authorization.js");

const db = require("./db");
const jwtGenerator = require("./utils/jwtgen");

const app = express();

const isDevMode = process.env.NODE_ENV == "development";

const corsOptions = {
  origin: isDevMode
    ? "http://localhost:3000"
    : "https://instagram-social-media-app.vercel.app",
};
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/profile_pictures");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });
const profileUpload = multer({ profileStorage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const posts = await db.query(
      "INSERT INTO posts (user_id, caption, link, time) values ($1, $2, $3, $4)",
      [req.body.userId, req.body.caption, req.file.path, req.body.time]
    );
    res.status(201).json({
      message: "Post uploaded sucessfully.",
    });
  } catch (err) {
    console.log(err);
  }
});

/* app.post(
  "/upload/profile-picture",
  profileUpload.single("file"),
  async (req, res) => {
    try {
      const posts = await db.query(
        "INSERT INTO posts (user_id, caption, link, time) values ($1, $2, $3, $4)",
        [req.body.userId, req.body.caption, req.file.path, req.body.time]
      );
      res.status(201).json({
        message: "Post uploaded sucessfully.",
      });
    } catch (err) {
      console.log(err);
    }
  }
); */

app.post(
  "/api/create-profile",
  authorize,
  upload.single("image"),
  async (req, res) => {
    const { full_name, bio } = req.body;
    // Assuming the authorize middleware adds the user ID to req.user
    const user_id = req.user.id;
    const profile_picture = req.file
      ? req.file.path.replace("public", "")
      : null;

    try {
      const newProfile = await db.query(
        "INSERT INTO profile (username, full_name, bio, profile_picture) VALUES ($1, $2, $3, $4) RETURNING *",
        [user_id, full_name, bio, profile_picture]
      );
      res.status(201).json({
        message: "Profile created successfully.",
        profile: newProfile.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to create profile",
        error: err.message,
      });
    }
  }
);

app.get("/api/check-profile", authorize, async (req, res) => {
  // Assuming the authorize middleware adds the user ID to req.user
  const user_id = req.user.id;
  try {
    const response = await db.query(
      "SELECT * FROM profile WHERE username = $1",
      [user_id]
    );

    if (response.rows.length > 0) {
      res.json({
        hasProfile: true,
        profile: response.rows[0],
      });
    } else {
      res.json({
        hasProfile: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.put(
  "/api/update-profile",
  authorize,
  upload.single("image"),
  async (req, res) => {
    const { full_name, bio } = req.body;
    // Assuming the authorize middleware adds the user ID to req.user
    const user_id = req.user.id;
    const profile_picture = req.file
      ? req.file.path.replace("public", "")
      : null;

    try {
      // Update profile only if full_name or bio or profile_picture is provided
      const updateQuery = [];
      const queryParams = [];

      if (full_name) {
        queryParams.push(full_name);
        updateQuery.push(`full_name = $${queryParams.length}`);
      }

      if (bio) {
        queryParams.push(bio);
        updateQuery.push(`bio = $${queryParams.length}`);
      }

      if (profile_picture) {
        queryParams.push(profile_picture);
        updateQuery.push(`profile_picture = $${queryParams.length}`);
      }

      queryParams.push(user_id); // Always include user_id as the last parameter for the WHERE clause

      if (queryParams.length > 1) {
        // Check if there's anything to update
        const updateStatement = `
        UPDATE profile
        SET ${updateQuery.join(", ")}
        WHERE username = $${queryParams.length}
        RETURNING *;
      `;

        const updatedProfile = await db.query(updateStatement, queryParams);

        if (updatedProfile.rows.length > 0) {
          res.json({
            message: "Profile updated successfully.",
            profile: updatedProfile.rows[0],
          });
        } else {
          res.status(404).json({ message: "Profile not found." });
        }
      } else {
        res.status(400).json({ message: "No update parameters provided." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Failed to update profile",
        error: err.message,
      });
    }
  }
);

// Authen and Author procedures

app.post("/api/register", async (req, res) => {
  // Works really well but we still
  const { email, username, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exists!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert into PostgreSQL
    const newUser = await db.query(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *",
      [email, username, hashedPassword]
    );
    const jwtToken = jwtGenerator(newUser.rows[0].username);
    return res.json({ jwtToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res
        .status(401)
        .json(
          "Sorry, your password was incorrect. Please double-check your password."
        );
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Password or email is incorrect.");
    }

    const jwtToken = jwtGenerator(user.rows[0].username);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("There was an error with the server.");
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await db.query("select * from posts");
    res.status(200).json({
      data: {
        posts: posts.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/usernames", async (req, res) => {
  try {
    const usernames = await db.query("select username from users");
    res.status(200).json({
      data: {
        usernames: usernames.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});
app.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/results", async (req, res) => {
  try {
    const results = await db.query("select * from users");
    res.json({
      data: {
        results: results.rows[0],
      },
    });
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/isFollowing/:userid", authorize, async (req, res) => {
  const follower_username = req.user.id; // The ID of the current, logged-in user (set by your authentication middleware)
  const following_username = req.params.userid; // The ID of the user whose follow status you're checking

  try {
    const result = await db.query(
      "SELECT COUNT(*) FROM followers WHERE follower_username = $1 AND following_username = $2",
      [follower_username, following_username]
    );

    const isFollowing = result.rows[0].count > 0;
    res.json({ isFollowing });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/follow", authorize, async (req, res) => {
  const follower_username = req.user.id; // Assuming you have a way to identify the logged-in user
  const { following_username } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO followers (follower_username, following_username) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [follower_username, following_username]
    );
    res.status(201).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/unfollow", authorize, async (req, res) => {
  const follower_username = req.user.id; // Logged-in user's ID
  const { following_username } = req.body; // ID of the user to unfollow

  try {
    const result = await db.query(
      "DELETE FROM followers WHERE follower_username = $1 AND following_username = $2",
      [follower_username, following_username]
    );
    if (result.rowCount > 0) {
      res.json({ message: "Unfollowed successfully" });
    } else {
      res.status(404).json({ message: "Follow relationship not found" });
    }
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
