import { describe, it, expect, beforeEach, vi } from 'vitest';
import axios from 'axios';
import { ElevenLabsClient } from './api-client';

vi.mock('axios');

const mockGet = vi.fn();
const mockAxiosInstance = {
  get: mockGet,
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn()
};

(axios.create as any) = vi.fn(() => mockAxiosInstance);

describe('ElevenLabsClient', () => {
  let client: ElevenLabsClient;
  const mockApiKey = 'test-api-key-123';

  beforeEach(() => {
    client = new ElevenLabsClient(mockApiKey);
    vi.clearAllMocks();
  });

  describe('getConversation', () => {
    it('should fetch a conversation by ID', async () => {
      const mockConversationId = 'conv_abc123';
      const mockResponse = {
        data: {
          conversation_id: mockConversationId,
          agent_id: 'agent_xyz',
          messages: [
            { role: 'user', content: 'Hello' },
            { role: 'agent', content: 'Hi there!' }
          ],
          created_at: '2025-10-15T10:00:00Z'
        }
      };

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.getConversation(mockConversationId);

      expect(mockGet).toHaveBeenCalledWith(
        `/conversationalAi/conversations.get`,
        {
          params: {
            conversation_id: mockConversationId
          }
        }
      );

      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when API request fails', async () => {
      const mockConversationId = 'conv_invalid';
      const mockError = {
        isAxiosError: true,
        response: {
          status: 404,
          statusText: 'Not Found'
        }
      };

      mockGet.mockRejectedValueOnce(mockError);

      await expect(
        client.getConversation(mockConversationId)
      ).rejects.toThrow('API Error: 404 Not Found');
    });
  });

  describe('listConversations', () => {
    it('should list conversations with pagination', async () => {
      const mockResponse = {
        data: {
          conversations: [
            { conversation_id: 'conv_1', agent_id: 'agent_1', created_at: '2025-10-15T10:00:00Z' },
            { conversation_id: 'conv_2', agent_id: 'agent_2', created_at: '2025-10-14T10:00:00Z' }
          ]
        }
      };

      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.listConversations({ limit: 10, offset: 0 });

      expect(mockGet).toHaveBeenCalledWith(
        `/conversationalAi/conversations.list`,
        {
          params: {
            limit: 10,
            offset: 0
          }
        }
      );

      expect(result.conversations).toHaveLength(2);
      expect(result.conversations[0].conversation_id).toBe('conv_1');
    });
  });

  describe('getAudio', () => {
    it('should fetch audio for a conversation', async () => {
      const mockConversationId = 'conv_abc123';
      const mockAudioBuffer = Buffer.from('fake-audio-data');

      mockGet.mockResolvedValueOnce({
        data: mockAudioBuffer
      });

      const result = await client.getAudio(mockConversationId);

      expect(mockGet).toHaveBeenCalledWith(
        `/conversationalAi/conversations/audio.get`,
        {
          params: {
            conversation_id: mockConversationId
          },
          responseType: 'arraybuffer'
        }
      );

      expect(result).toEqual(mockAudioBuffer);
    });
  });
});
