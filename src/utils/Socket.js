// socket.js
import { io } from 'socket.io-client';
import host from "../host"

const socket = io(`${host}`, {
  query: {
    token: localStorage.getItem('token'), // Include the user's token in the query
  },
});// Replace with your server URL

export default socket;
