// src/services/useApi.js

import { useState, useEffect } from 'react';
import ApiService from './api.js';
import { toast } from 'sonner';

// Generic hook for any API call
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err);
        toast.error(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error };
};

// Hook for user profile
export const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getUserProfile(userId);
      setProfile(data);
    } catch (err) {
      setError(err);
      if (!err.message.includes('404')) toast.error(err.message);
      else setProfile(null); // profile not found
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.updateUserProfile(userId, profileData);
      setProfile(data);
      toast.success('Profile saved successfully!');
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to save profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) loadProfile();
  }, [userId]);

  return { profile, loading, error, saveProfile, refetch: loadProfile };
};

// Hook for questionnaire
export const useQuestionnaire = (userId) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listResponses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.listQuestionnaireResponses(userId);
      setResponses(data || []);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to load questionnaire');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.submitQuestionnaireResponse(userId, payload);
      await listResponses();
      toast.success('Response submitted');
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to submit response');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) listResponses();
  }, [userId]);

  return { responses, loading, error, listResponses, submitResponse };
};
