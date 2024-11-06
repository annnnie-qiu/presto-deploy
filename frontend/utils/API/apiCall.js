export async function apiCall(
  method,
  endpoint,
  body = {},
  queryString = "",
  token = ""
) {
  // Use environment variables for the backend URL
  const BASE_URL = "http://localhost:5005";

  // Set the target address with query string for GET and DELETE
  const targetAddress = `${BASE_URL}/${endpoint}`;
  // method === "GET"
  //   ? `${BASE_URL}/${endpoint}?${queryString}`
  //   : `${BASE_URL}/${endpoint}`;

  // Set the headers and method for the request
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(targetAddress, fetchOptions);
    if (!response.ok) {
      // Throw an error if the response is not OK
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error; // Rethrow error for further handling in React components
  }
}
