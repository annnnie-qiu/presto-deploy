import { apiCall } from '../apiCall';

export default async function sendDetail(token, updatedStore) {
  try {

    const updateResponse = await apiCall(
      "PUT",
      "store",
      { store: updatedStore },
      token
    );

    return updateResponse;
  } catch (error) {
    console.error('Failed to update the store:', error.message);
    throw error;
  }
}

export async function getDetail(token) {
  try {

    const response = await apiCall("GET", "store", {}, token);

    if (!response.store) {
      throw new Error('Failed to retrieve the current store data');
    }
    return response;
  } catch (error) {
    console.error('Failed to retrieve the store data:', error.message);
    throw error;
  }
}
