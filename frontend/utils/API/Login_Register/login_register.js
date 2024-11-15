import { apiCall } from "../apiCall";

export async function login(email, password) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiCall("POST", "admin/auth/login", {
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function register(email, password, name) {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await apiCall("POST", "admin/auth/register", {
      email: email,
      password: password,
      name: name,
    });
    return response;
  } catch (error) {
    throw error;
  }
}
