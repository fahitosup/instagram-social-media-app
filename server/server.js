const express = require("express");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authorize = require("./middleware/authorization.js");

const db = require("./db");
const jwtGenerator = require("./utils/jwtgen");

const app = express();

app.use(cors());
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

app.post(
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
);

app.post(
  "/api/create-profile",
  authorize,
  upload.single("image"),
  async (req, res) => {
    const { full_name, bio } = req.body;
    // Assuming the authorize middleware adds the user ID to req.user
    const user_id = req.user.id; // Adjust based on how user ID is stored in req.user
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
      return res.status(401).json("You've entered invalid credentials.");
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

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
