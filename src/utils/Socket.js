// socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  query: {
    token: localStorage.getItem('token'), // Include the user's token in the query
  },
});// Replace with your server URL

export default socket;
