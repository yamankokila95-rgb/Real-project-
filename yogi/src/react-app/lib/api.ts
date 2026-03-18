export const API_BASE = "";

export const getToken = () => localStorage.getItem("mindcareToken");

export const authFetch = async (path: string, options: RequestInit = {}) => {
  const token = getToken();
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
};
