import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.js";
import Search from "@mui/icons-material/Search.js";
import { useAuth } from "../../../context/AuthProvider.js";
import "./SearchBar.sass";

const SearchBar = () => {
  const [input, setInput] = useState("");
  const { fetchData, results } = useAuth();
  const navigate = useNavigate();

  const handleChange = (value) => {
    setInput(value);
    fetchData(value);
  };
  return (
    <div className="search-bar">
      <input
        className="test"
        placeholder="Search..."
        onChange={(e) => handleChange(e.target.value)}
      />
      <div className="results">
        {results.map((results, id) => {
          return (
            <div
              onClick={() => {
                navigate(`${results.username}`);
              }}
            >
              {results.username}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBar;
