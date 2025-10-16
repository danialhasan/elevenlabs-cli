import axios, { AxiosInstance } from 'axios';
import {
  Conversation,
  ConversationListResponse,
  ListConversationsOptions
} from '../types/elevenlabs';

export class ElevenLabsClient {
  private client: AxiosInstance;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: 'https://api.elevenlabs.io',
      headers: {
        'xi-api-key': apiKey
      }
    });
  }

  async getConversation(conversationId: string): Promise<Conversation> {
    try {
      const response = await this.client.get(`/v1/convai/conversations/${conversationId}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async listConversations(options?: ListConversationsOptions): Promise<ConversationListResponse> {
    try {
      const response = await this.client.get(`/v1/convai/conversations`, {
        params: {
          page_size: options?.limit
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }

  async getAudio(conversationId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(`/v1/convai/conversations/${conversationId}/audio`, {
        responseType: 'arraybuffer'
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
      }
      throw error;
    }
  }
}
