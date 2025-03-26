import apiClient from './client';
import { AxiosResponse } from 'axios';

export interface University {
  _id: string;
  name: string;
  country: string;
  isCustom?: boolean;
}

export const universitiesApi = {
  // Get all universities
  getAll: async (): Promise<University[]> => {
    const response: AxiosResponse<University[]> = await apiClient.get('/universities');
    return response.data;
  },

  // Get university by ID
  getById: async (id: string): Promise<University> => {
    const response: AxiosResponse<University> = await apiClient.get(`/universities/${id}`);
    return response.data;
  },

  // Create university
  create: async (data: Partial<University>): Promise<University> => {
    const response: AxiosResponse<University> = await apiClient.post('/universities', data);
    return response.data;
  }
}; 