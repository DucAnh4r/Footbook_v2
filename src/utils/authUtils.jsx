import { userFindByIdService } from "../services/userService";

export const getAuthDataFromLocalStorage = () => {
  const authData = localStorage.getItem("authData");
  if (!authData) return null;

  try {
    return JSON.parse(authData);
  } catch (error) {
    console.error("Error parsing authData from localStorage:", error);
    return null;
  }
};

export const getUserIdFromLocalStorage = () => {
  const authData = getAuthDataFromLocalStorage();
  if (!authData) return null;

  const id = authData?.user?.id;
  return Number.isInteger(Number(id)) ? parseInt(id, 10) : null;
};

export const getAccessTokenFromLocalStorage = () => {
  const authData = getAuthDataFromLocalStorage();
  return authData?.access_token || null;
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