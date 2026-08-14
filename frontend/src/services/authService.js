import { api, requestConfig } from "../utils/config";

//Register an user

const register = async (data) => {
  const config = requestConfig("POST", data);

  const response = await fetch(api + "users/register", config);
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || "Registration failed");
    error.data = resData;
    throw error;
  }

  localStorage.setItem("user", JSON.stringify(resData));
  return resData;
};

//Login an user

const login = async (data) => {
  const config = requestConfig("POST", data);

  const response = await fetch(api + "users/login", config);
  const resData = await response.json();

  if (!response.ok) {
    const error = new Error(resData.message || "Login failed");
    error.data = resData;
    throw error;
  }

  localStorage.setItem("user", JSON.stringify(resData));
  return resData;
};

const authService = {
  register,
  login,
};

export default authService;
