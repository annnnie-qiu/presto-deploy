export async function apiCall(method, endpoint, body = {}, token = "") {
  // Use environment variables for the backend URL
  // const BASE_URL = "http://localhost:5005";

  const BASE_URL = "https://z5348946-presto-be-deploy.vercel.app";

  // Set the target address with query string for GET and DELETE
  const targetAddress = `${BASE_URL}/${endpoint}`;
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

  // eslint-disable-next-line no-useless-catch
  try {
    const response = await fetch(targetAddress, fetchOptions);
    if (!response.ok) {
      // Throw an error if the response is not OK
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    // Parse and return JSON response
    return await response.json();
  } catch (error) {
    throw error; // Rethrow error for further handling in React components
  }
}
