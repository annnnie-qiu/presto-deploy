import { apiCall } from "../apiCall";

export default async function sendDetail(token, updatedStore) {
  try {
    const updateResponse = await apiCall("PUT", "store", { store: updatedStore }, "", token);
    console.log("PUT response:", updateResponse);
    return updateResponse;
  } catch (error) {
    console.error("Failed to update the store:", error.message);
    throw error;
  }
}

export async function getDetail(token) {
  try {
    console.log("GET request");
    const response = await apiCall("GET", "store", {}, "", token);
    if (!response.store) {
      throw new Error("Failed to retrieve the current store data");
    }
    console.log("GET response:", response);
    return response;
  } catch (error) {
    console.error("Failed to retrieve the store data:", error.message);
    throw error;
  }
}
