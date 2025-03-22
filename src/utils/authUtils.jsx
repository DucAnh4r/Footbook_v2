export const getUserIdFromLocalStorage = () => {
    const user = localStorage.getItem("user");
    if (!user) return null;
  
    try {
      const parsedUser = JSON.parse(user); // Parse JSON thành object
      return parsedUser?.data?.id || null; // Trả về `id` hoặc null nếu không có
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  };
  