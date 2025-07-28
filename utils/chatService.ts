import axios from 'axios';

// Update this URL to match your backend server
const API_URL = 'http://localhost:3001/api';

interface ChatResponse {
  success: boolean;
  userMessage?: any;
  aiResponse?: any;
  chat?: any;
  provider?: 'openai' | 'rasa' | 'fallback';
  error?: string;
}

interface HealthStatus {
  success: boolean;
  health?: {
    openai: { available: boolean; error?: string };
    rasa: { available: boolean; error?: string };
    overall: 'healthy' | 'degraded' | 'down';
  };
  services?: {
    openai: boolean;
    rasa: boolean;
    primary: 'openai' | 'rasa' | 'fallback';
  };
  timestamp?: string;
}

export const chatService = {
  /**
   * Send a message to the AI chatbot via the backend API
   * Now supports OpenAI as primary with Rasa as fallback
   * @param userId User identifier
   * @param message Message to send
   * @returns Promise with the chatbot response
   */
  sendMessage: async (userId: string, message: string): Promise<ChatResponse> => {
    try {
      const response = await axios.post(`${API_URL}/ai-chat/message`, {
        userId,
        message
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending message to chatbot:', error);
      
      // Return a structured error response
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to send message',
        provider: 'fallback'
      };
    }
  },

  /**
   * Check the health status of AI services
   * @returns Promise with health status
   */
  checkHealth: async (): Promise<HealthStatus> => {
    try {
      const response = await axios.get(`${API_URL}/ai-chat/health`);
      return response.data;
    } catch (error: any) {
      console.error('Error checking AI service health:', error);
      return {
        success: false,
        health: {
          openai: { available: false, error: 'Health check failed' },
          rasa: { available: false, error: 'Health check failed' },
          overall: 'down'
        }
      };
    }
  },

  /**
   * Get a user-friendly message about which AI service is being used
   * @param provider The AI service provider
   * @returns User-friendly status message
   */
  getProviderStatus: (provider?: 'openai' | 'rasa' | 'fallback'): string => {
    switch (provider) {
      case 'openai':
        return 'Powered by OpenAI';
      case 'rasa':
        return 'Using local AI assistant';
      case 'fallback':
        return 'Limited functionality - some services unavailable';
      default:
        return 'AI Assistant';
    }
  }
};
