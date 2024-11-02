import { apiCall } from "../apiCall";

export async function login(email, password) {
  try {
    const response = await apiCall("POST", "login", { email, password });
    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}

export async function register(email, password) {
  try {
    const response = await apiCall("POST", "register", { email, password });
    return response;
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error;
  }
}
