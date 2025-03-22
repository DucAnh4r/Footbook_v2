import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import debounce from "lodash/debounce";
import styles from "./SearchBar.module.scss";
import { userSearchService } from "../services/userService";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resultsRef = useRef(null);
  const searchBarRef = useRef(null);
  const navigate = useNavigate();

  const fetchSearchResults = async (keyword) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await userSearchService({
        keyword,
        page: 0,
        size: 100,
      });
      const users = response?.data?.data || [];
      setSuggestions(users);
      console.log("abc", suggestions);
      setShowSuggestions(users.length > 0);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = useMemo(
    () =>
      debounce((keyword) => {
        fetchSearchResults(keyword);
      }, 500),
    []
  );

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedFetchSuggestions(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleClickOutside = (event) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target) &&
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target)
    ) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (userId) => {
    if (userId) {
      setSearchQuery("");
      setShowSuggestions(false);
      setSuggestions("");
      navigate(`/friendprofile/${userId}`);
    }
  };

  return (
    <div className={styles.searchContainer} ref={searchBarRef}>
      <div className={styles.inputGroup}>
        <Input
          prefix={<FaSearch style={{ fontSize: "18px", color: "#65686c" }} />}
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm người dùng"
          className={styles.formControl}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              setSearchQuery("");
              setShowSuggestions(false);
              setSuggestions("");
              navigate(`/search/users?query=${encodeURIComponent(searchQuery)}`);
            }
          }}
        />
        {searchQuery && (
          <div className={styles.clearButton} onClick={clearSearch}>
            <FaTimes color="#777" size={20} />
          </div>
        )}
      </div>

      {showSuggestions && (
        <div className={styles.resultsContainer} ref={resultsRef}>
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <Spin size="small" />
              <span>Đang tải...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.slice(0, 5).map((user) => (
              <div
                key={user.userId}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(user.userId)}
              >
                <img
                  src={user.profilePictureUrl || "https://via.placeholder.com/50"}
                  alt={user.fullName || "User"}
                  className={styles.avatar}
                />
                <span>{user.fullName || "Unknown User"}</span>
              </div>
            ))
          ) : (
            <p className={styles.noResultsMessage}>Không tìm thấy kết quả phù hợp.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
