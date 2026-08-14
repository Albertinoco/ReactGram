export const api = "http://localhost:5000/api/";
export const upload = "http://localhost:5000/uploads";

export const requestConfig = (method, data, token = null, image = null) => {
  const config = {
    method,
    headers: {},
  };

  if (image) {
    config.body = data;
  } else if (method === "DELETE" || data === null) {
  } else {
    config.body = JSON.stringify(data);
    config.headers["Content-Type"] = "application/json";
  }

  if (token) {
    config.headers["Authorization"] = "Bearer " + token;
  }

  return config;
};
