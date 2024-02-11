import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Timeline.sass";
import Post from "./posts/post";
import { base } from "../../constants";

export const Timeline = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${base}/api/timeline`, {
        headers: {
          jwtToken: localStorage.getItem("jwtToken"),
        },
      })
      .then((res) => {
        const currentTimestamp = new Date();
        const baseURL = base;
        const modifiedData = res.data.data.posts.map((entry) => {
          const publishedTime = new Date(entry.time);
          const timedifferenceMs = currentTimestamp - publishedTime;
          const updatedLink = entry.link.replace(
            /^public\\images\\/,
            `${base}/images/`
          );
          const timedifferenceMins = Math.floor(timedifferenceMs / (1000 * 60));
          if (timedifferenceMins >= 1440) {
            const timmedifferenceDays = Math.floor(timedifferenceMins / 1440);
            return {
              ...entry,
              timedifference: `${timmedifferenceDays}d`,
              link: updatedLink,
            };
          } else if (timedifferenceMins >= 60) {
            const timedifferenceHours = Math.floor(timedifferenceMins / 60);
            return {
              ...entry,
              timedifference: `${timedifferenceHours}h`,
              link: updatedLink,
            };
          } else {
            return {
              ...entry,
              timedifference: `${timedifferenceMins}m`,
              link: updatedLink,
            };
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
            user={p.user_id}
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
