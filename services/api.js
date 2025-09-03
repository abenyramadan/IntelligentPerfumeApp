// src/services/api.js
const API_BASE_URL = "http://localhost:5000/api"; // must include /api

const ApiService = {
  async createUser(userData) {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  async login(userData) {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  async getUserProfile(userId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/profile`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  async updateUserProfile(userId, profileData) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
      method: "POST", // backend expects POST for create/update
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  async listQuestionnaireResponses(userId) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/questionnaire`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  async listQuestionnaireQuestions() {
    const res = await fetch(`${API_BASE_URL}/questionnaire/questions`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  async submitQuestionnaireResponse(userId, payload) {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/questionnaire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  // You can add recommendation endpoints later once backend exists
};

export default ApiService;
