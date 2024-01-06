import React, { useEffect, useState } from "react";
import "./Timeline.sass";
import Post from "./posts/post";
import jsonData from "./posts.json";
import { modalClasses } from "@mui/material";

export const Timeline = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Make an HTTP request to your Django API endpoint for posts
    fetch("http://localhost:8000/posts/")
      .then((response) => response.json())
      .then((data) => {
        const currentTimestamp = new Date();
        const modifiedData = data.map((entry) => {
          const publishedTime = new Date(entry.time);
          const timedifferenceMs = currentTimestamp - publishedTime;

          const timedifferenceMins = Math.floor(timedifferenceMs / (1000 * 60));
          if (timedifferenceMins >= 1440) {
            const timmedifferenceDays = Math.floor(timedifferenceMins / 1440);
            return { ...entry, timedifference: `${timmedifferenceDays}d` };
          } else if (timedifferenceMins >= 60) {
            const timedifferenceHours = Math.floor(timedifferenceMins / 60);
            return { ...entry, timedifference: `${timedifferenceHours}h` };
          } else {
            return { ...entry, timedifference: `${timedifferenceMins}m` };
          }
        });
        setPosts(modifiedData);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);
  return (
    <div>
      <div className="timeline__posts">
        {posts.map((p) => (
          <Post
            key={p.id}
            id={p.id}
            user={p.userId}
            caption={p.caption}
            link={p.link}
            likes={p.likes}
            time={p.timedifference}
          />
        ))}
      </div>
    </div>
  );
};
