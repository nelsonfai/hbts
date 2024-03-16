import axios from 'axios';

const signup = async (userData) => {
  try {
    const response = await axios.post('https://your-django-backend.com/api/signup/', userData);

    // Handle the response accordingly
    console.log(response.data); // Assuming your backend returns some data upon successful signup

    return response.data; // You might want to return the response data or use it for further actions
  } catch (error) {
    // Handle errors
    //('Error during signup:', error);
    throw error;
  }
};

// Example usage
const userData = {
  username: 'example_user',
  email: 'user@example.com',
  password: 'password123',
  // Include any other required fields
};

signup(userData);
