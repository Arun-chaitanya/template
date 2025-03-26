import { AxiosResponse } from 'axios';
import apiClient from './client';
import { IDocument } from '@/models/Document';

export const documentsApi = {
  // Get all documents
  getAll: async (params?: { 
    type?: string | string[]; 
    university?: string; 
    recommender?: string;
  }): Promise<IDocument[]> => {
    // Handle array of types by converting to comma-separated string
    const queryParams = { ...params };
    if (Array.isArray(queryParams.type)) {
      queryParams.type = queryParams.type.join(',');
    }
    
    const response: AxiosResponse<IDocument[]> = await apiClient.get('/documents', { 
      params: queryParams
    });
    return response.data;
  },

  // Get single document
  getById: async (id: string): Promise<IDocument> => {
    const response: AxiosResponse<IDocument> = await apiClient.get(`/documents/${id}`);
    return response.data;
  },

  // Create document
  create: async (data: Partial<IDocument>): Promise<IDocument> => {
    const response: AxiosResponse<IDocument> = await apiClient.post('/documents', data);
    return response.data;
  },

  // Update document
  update: async (id: string, data: Partial<IDocument>): Promise<IDocument> => {
    const response: AxiosResponse<IDocument> = await apiClient.patch(
      `/documents/${id}`, 
      data
    );
    return response.data;
  },

  // Delete document
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Generate document content
  generateContent: async (documentId: string, questions: any[]): Promise<IDocument> => {
    const response = await apiClient.post('/documents/generate', {
      documentId,
      questions
    });
    return response.data;
  },
}; 