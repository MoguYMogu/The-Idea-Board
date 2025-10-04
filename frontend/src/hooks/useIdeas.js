import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/api';

export const useIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIdeas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getIdeas();
      if (response.success) {
        setIdeas(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch ideas');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching ideas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createIdea = useCallback(async (content) => {
    try {
      setError(null);
      const response = await apiClient.createIdea(content);
      if (response.success) {
        // Add the new idea to the beginning of the list
        setIdeas(prevIdeas => [response.data, ...prevIdeas]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create idea');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const upvoteIdea = useCallback(async (ideaId) => {
    try {
      setError(null);
      const response = await apiClient.upvoteIdea(ideaId);
      if (response.success) {
        // Update the idea in the list
        setIdeas(prevIdeas =>
          prevIdeas.map(idea =>
            idea.id === ideaId ? response.data : idea
          ).sort((a, b) => b.upvotes - a.upvotes || new Date(b.createdAt) - new Date(a.createdAt))
        );
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to upvote idea');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    upvoteIdea,
  };
};