import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input, Spin, Avatar, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaChevronRight } from "react-icons/fa";
import { debounce } from "lodash";
import styles from "./SearchBar.module.scss";
import { userSearchService } from "../services/userService";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(true);

  const resultsRef = useRef(null);
  const searchBarRef = useRef(null);
  const navigate = useNavigate();

  const performSearch = async (keyword) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHasResults(true);
      return;
    }
    
    try {
      setIsLoading(true);
      setShowSuggestions(true);
      
      const response = await userSearchService({
        keyword,
        page: 0,
        size: 100,
      });
      
      // Đảm bảo trích xuất dữ liệu đúng cách từ response
      const users = response?.data?.results || response?.data?.data || [];
      
      // Chuẩn hóa dữ liệu người dùng để phù hợp với cả 2 API
      const normalizedUsers = users.map(user => ({
        id: user.id || user.userId,
        userId: user.id || user.userId,
        name: user.name || user.fullName || "Unknown User",
        fullName: user.name || user.fullName || "Unknown User",
        avatar_url: user.avatar_url || user.profilePictureUrl || "https://via.placeholder.com/50",
        profilePictureUrl: user.avatar_url || user.profilePictureUrl || "https://via.placeholder.com/50"
      }));
      
      setSuggestions(normalizedUsers);
      setHasResults(normalizedUsers.length > 0);
      setShowSuggestions(true); // Luôn hiển thị dropdown để xem kết quả hoặc "không có kết quả"
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSuggestions([]);
      setHasResults(false);
      setShowSuggestions(true); // Vẫn hiển thị dropdown để hiện thông báo lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // Sử dụng useCallback để tạo hàm debouncedSearch
  const debouncedSearch = useCallback(
    debounce((value) => {
      performSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHasResults(true);
      return;
    }
    
    // Hiển thị loading ngay khi người dùng nhập
    setIsLoading(true);
    setShowSuggestions(true);
    
    debouncedSearch(query);
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
      // Hủy debounce khi component unmount
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSuggestionClick = (userId) => {
    if (userId) {
      setSearchQuery("");
      setShowSuggestions(false);
      setSuggestions([]);
      setHasResults(true);
      navigate(`/friendprofile/${userId}`);
    }
  };
  
  const handleViewAll = () => {
    if (searchQuery.trim()) {
      navigate(`/search/users?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setSuggestions([]);
      setHasResults(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (searchQuery.trim()) {
        navigate(`/search/users?query=${encodeURIComponent(searchQuery)}`);
        setSearchQuery("");
        setShowSuggestions(false);
        setSuggestions([]);
      }
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
          onKeyPress={handleKeyPress}
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
              <span>Đang tìm kiếm...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {suggestions.slice(0, 5).map((user) => (
                <div
                  key={user.id || user.userId}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(user.id || user.userId)}
                >
                  <Avatar 
                    src={user.avatar_url || user.profilePictureUrl} 
                    size="small"
                    className={styles.avatar}
                  />
                  <span>{user.name || user.fullName}</span>
                </div>
              ))}
              
              {/* Nút Xem tất cả */}
              <div className={styles.viewAllContainer} onClick={handleViewAll}>
                <Button 
                  type="link" 
                  className={styles.viewAllButton}
                  icon={<FaChevronRight style={{ fontSize: '12px' }} />}
                >
                  Xem tất cả kết quả cho "{searchQuery}"
                </Button>
              </div>
            </>
          ) : !hasResults ? (
            <div className={styles.noResultsContainer}>
              <p className={styles.noResultsMessage}>Không tìm thấy kết quả phù hợp cho "{searchQuery}"</p>
              <div className={styles.viewAllContainer} onClick={handleViewAll}>
                <Button 
                  type="link" 
                  className={styles.viewAllButton}
                  icon={<FaChevronRight style={{ fontSize: '12px' }} />}
                >
                  Tìm kiếm trên toàn hệ thống
                </Button>
              </div>
            </div>
          ) : (
            <p className={styles.noResultsMessage}>Không tìm thấy kết quả phù hợp.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;