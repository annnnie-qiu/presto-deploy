import { apiCall } from "../apiCall";

export default async function sendDetail(token, updatedPresentation) {
  try {
    const response = await apiCall("GET", "store", {}, "", token);
    if (!response.store) {
      throw new Error("Failed to retrieve the current store data");
    }

    const { store } = response;

    // Find the existing presentation by ID and update it
    const presentations = store.presentations || [];
    const updatedPresentations = presentations.map((presentation) =>
      presentation.id === updatedPresentation.id ? updatedPresentation : presentation
    );

    // Update the store with the modified presentations list
    store.presentations = updatedPresentations;

    // Send the updated store to the backend
    const updateResponse = await apiCall("PUT", "store", { store }, "", token);
    console.log("PUT response:", updateResponse);
    return updateResponse;
  } catch (error) {
    console.error("Failed to update the presentation:", error.message);
    throw error;
  }
}

export async function getDetail(token) {
  try {
    console.log("GET request");
    const response = await apiCall("GET", "store", {}, "", token);
    console.log("GET response:", response);
    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}
