// src/services/api.js
const API_BASE_URL = "http://127.0.0.1:8000";
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
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  // get profile
  async getUserProfile(userId) {
    const res = await fetch(`${API_BASE_URL}/profiles/${userId}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  // update user profile
  async updateUserProfile(userId, profileData) {
    const res = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
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

  // all questionnaire questions
  async listQuestionnaireQuestions() {
    const res = await fetch(`${API_BASE_URL}/questionnaires/questions/`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },

  //
  async submitQuestionnaireResponse(userId, payload) {
    const res = await fetch(`${API_BASE_URL}/questionnaires/respones/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  },
};

export default ApiService;
