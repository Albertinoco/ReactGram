import { api, requestConfig } from "../utils/config";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    const message =
      data.message ||
      (Array.isArray(data.errors) ? data.errors.join(". ") : null) ||
      "Request failed";
    const error = new Error(message);
    error.data = data;
    throw error;
  }

  return data;
};

// get current authenticated user
const profile = async (token) => {
  const config = requestConfig("GET", null, token);
  const response = await fetch(api + "users/profile", config);
  return handleResponse(response);
};

// update user details
const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);
  const response = await fetch(api + "users", config);
  return handleResponse(response);
};

// get user details by id
const getUserDetails = async (id, token = null) => {
  const config = requestConfig("GET", null, token);
  const response = await fetch(api + "users/" + id, config);
  return handleResponse(response);
};

const userService = {
  profile,
  updateProfile,
  getUserDetails,
};

export default userService;
