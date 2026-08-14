import { api, requestConfig } from "../utils/config";

const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    const err = new Error(data.message || "Request failed");
    err.data = data;
    throw err;
  }
  return data;
};
const photoService = {
  getPhotos: async (token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(api + "photos", config);
    return handleResponse(response);
  },
  uploadPhoto: async (data, token) => {
    const config = requestConfig("POST", data, token, true);
    const response = await fetch(api + "photos", config);
    return handleResponse(response);
  },
  deletePhoto: async (id, token) => {
    const config = requestConfig("DELETE", null, token);
    const response = await fetch(api + "photos/" + id, config);
    return handleResponse(response);
  },
  likePhoto: async (id, token) => {
    const config = requestConfig("PUT", null, token);
    const response = await fetch(api + "photos/like/" + id, config);
    return handleResponse(response);
  },
  getUserPhotos: async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(api + "photos/user/" + id, config);
    return handleResponse(response);
  },
  updatePhoto: async ({ id, photoData }, token) => {
    const config = requestConfig("PUT", photoData, token);
    const response = await fetch(api + "photos/" + id, config);
    return handleResponse(response);
  },
  getPhoto: async (id, token) => {
    const config = requestConfig("GET", null, token);
    const response = await fetch(api + "photos/" + id, config);
    return handleResponse(response);
  },
  commentPhoto: async ({ id, comment }, token) => {
    const config = requestConfig("PUT", { comment }, token);
    const response = await fetch(`${api}photos/comment/${id}`, config);
    return handleResponse(response);
  },
};

export default photoService;
