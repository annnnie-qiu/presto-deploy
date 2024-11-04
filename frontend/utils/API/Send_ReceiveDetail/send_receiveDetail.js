import { apiCall } from "../apiCall";

export default async function sendDetail(
  token,
  id,
  name,
  description,
  thumbnail
) {
  try {
    const response = await apiCall(
      "PUT",
      "store",
      {
        store: {
          id: id,
          name: name,
          description: description,
          thumbnail: thumbnail,
        },
      },
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
    const response = await apiCall("GET", "store", {}, "", token);
    console.log("GET response:", response);
    return response;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}
