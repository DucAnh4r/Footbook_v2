import { userFindByIdService } from "../services/userService";

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

export const getUserById = async (userId) => {
  if (!userId) return null;

  try {
    const response = await userFindByIdService(userId);
    if (response?.data?.user) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
};