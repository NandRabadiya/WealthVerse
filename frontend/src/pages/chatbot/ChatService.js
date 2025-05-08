// ChatService.js - API service for interacting with the chatbot API

import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ChatService {
  // Start a new chat session
  startChat(userId) {
    return axios.post(`${API_URL}/chats/start`, { user_id: userId });
  }
  
  // Send a message in an existing chat
  sendMessage(chatId, userId, message) {
    return axios.post(`${API_URL}/chats/${chatId}/message`, {
      user_id: userId,
      message
    });
  }
  
  // End an active chat session
  endChat(chatId, userId) {
    return axios.post(`${API_URL}/chats/${chatId}/end`, { user_id: userId });
  }
  
  // Get list of user's chats
  getUserChats(userId) {
    return axios.get(`${API_URL}/chats?user_id=${userId}`);
  }
  
  // Get messages for a specific chat
  getChatMessages(chatId, userId) {
    return axios.get(`${API_URL}/chats/${chatId}?user_id=${userId}`);
  }
}

export default new ChatService();