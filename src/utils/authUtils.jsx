export const getUserIdFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    const parsedUser = JSON.parse(user);
    const id = parsedUser?.data?.id;

    // Kiểm tra và ép kiểu sang số nguyên
    return Number.isInteger(Number(id)) ? parseInt(id, 10) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};
