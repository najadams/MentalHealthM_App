import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class OpenAIService {
  private static apiKey: string | null = null;

  static initialize() {
    // Get API key from environment variables
    this.apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || null;
    return this.apiKey !== null;
  }

  static isAvailable(): boolean {
    return this.apiKey !== null && this.apiKey !== 'your_openai_api_key_here';
  }

  /**
   * Send a message to OpenAI and get a response
   * @param message User message
   * @param conversationHistory Previous messages for context
   * @returns Promise with OpenAI response
   */
  static async sendMessage(
    message: string,
    conversationHistory: OpenAIMessage[] = []
  ): Promise<{ content: string; success: boolean }> {
    if (!this.isAvailable()) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `You are a compassionate mental health assistant. Your role is to:
          - Provide emotional support and guidance
          - Listen actively and respond empathetically
          - Offer coping strategies and mental health resources
          - Encourage professional help when appropriate
          - Maintain a warm, non-judgmental tone
          - Keep responses concise but meaningful
          - Never provide medical diagnoses or replace professional therapy
          
          Always prioritize the user's wellbeing and safety. If someone expresses thoughts of self-harm, encourage them to seek immediate professional help.`
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await axios.post<OpenAIResponse>(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 500,
          temperature: 0.7,
          presence_penalty: 0.1,
          frequency_penalty: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const content = response.data.choices[0]?.message?.content?.trim();
      
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      return {
        content,
        success: true
      };
    } catch (error: any) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      
      // Provide specific error messages for common issues
      if (error.response?.status === 401) {
        throw new Error('Invalid OpenAI API key');
      } else if (error.response?.status === 429) {
        throw new Error('OpenAI rate limit exceeded');
      } else if (error.response?.status === 503) {
        throw new Error('OpenAI service temporarily unavailable');
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Network connection failed');
      }
      
      throw new Error('OpenAI service error');
    }
  }

  /**
   * Process a message with conversation context
   * @param message User message
   * @param previousMessages Previous conversation messages
   * @returns Formatted response
   */
  static async processMessage(
    message: string,
    previousMessages: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<{ content: string; sentiment: string; categories: string[] }> {
    // Convert previous messages to OpenAI format
    const conversationHistory: OpenAIMessage[] = previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const response = await this.sendMessage(message, conversationHistory);
    
    // Simple sentiment analysis based on response content
    const sentiment = this.analyzeSentiment(response.content);
    
    // Extract categories based on message content
    const categories = this.extractCategories(message, response.content);

    return {
      content: response.content,
      sentiment,
      categories
    };
  }

  /**
   * Simple sentiment analysis
   */
  private static analyzeSentiment(text: string): string {
    const positiveWords = ['good', 'great', 'happy', 'positive', 'wonderful', 'excellent', 'amazing', 'better', 'hope', 'progress'];
    const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'difficult', 'hard', 'struggle', 'pain', 'hurt', 'crisis'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Extract categories from message content
   */
  private static extractCategories(userMessage: string, aiResponse: string): string[] {
    const categories: string[] = ['general'];
    const text = (userMessage + ' ' + aiResponse).toLowerCase();
    
    if (text.includes('anxiet') || text.includes('worry') || text.includes('panic')) {
      categories.push('anxiety');
    }
    if (text.includes('depress') || text.includes('sad') || text.includes('down')) {
      categories.push('depression');
    }
    if (text.includes('sleep') || text.includes('insomnia') || text.includes('tired')) {
      categories.push('sleep');
    }
    if (text.includes('stress') || text.includes('overwhelm') || text.includes('pressure')) {
      categories.push('stress');
    }
    if (text.includes('relationship') || text.includes('family') || text.includes('friend')) {
      categories.push('relationships');
    }
    if (text.includes('work') || text.includes('job') || text.includes('career')) {
      categories.push('work');
    }
    
    return categories;
  }
}

// Initialize the service
OpenAIService.initialize();