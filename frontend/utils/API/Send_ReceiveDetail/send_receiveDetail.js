import { apiCall } from "../apiCall";

export default async function sendDetail(
  token,
  currentPresentationId,
  presentation
) {
  try {
    const response = await apiCall(
      "PUT",
      `presentations/${currentPresentationId}`,
      presentation,
      "",
      token
    );
    console.log("PUT response:", response);
    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}

export async function getDetail(token) {
  try {
    console.log("GET request");
    const response = await apiCall("GET", "presentations", {}, "", token);
    console.log("GET response:", response);
    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}
