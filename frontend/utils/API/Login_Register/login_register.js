import { apiCall } from "../apiCall";

export async function login(email, password) {
  try {
    const response = await apiCall("POST", "admin/auth/login", {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}

export async function register(email, password, name) {
  try {
    const response = await apiCall("POST", "admin/auth/register", {
      "email": email,
      "password": password,
      "name": name
    });
    return response;
  } catch (error) {
    console.error("Registration failed:", error.message);
    throw error;
  }
}
