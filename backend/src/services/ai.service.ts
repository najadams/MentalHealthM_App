import { OpenAIService } from "./openai.service";
import { RasaService } from "./rasa.service";
import { IMessage } from "../models/chat.model";

interface ChatLink {
  text: string;
  url?: string;
  route?: string;
  category?: string;
}

interface AIResponse {
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  categories: string[];
  links?: ChatLink[];
  provider: "openai" | "rasa" | "fallback";
}

export class AIService {
  /**
   * Process a message using OpenAI as primary and Rasa as fallback
   * @param userId User identifier
   * @param messageText Message content
   * @param conversationHistory Previous messages for context
   * @returns AI response with provider information
   */
  static async processMessage(
    userId: string,
    messageText: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<AIResponse> {
    // First, try OpenAI
    try {
      console.log('Attempting to use OpenAI for message processing...');
      
      if (OpenAIService.isAvailable()) {
        const openaiResponse = await OpenAIService.processMessage(
          messageText,
          conversationHistory
        );
        
        console.log('OpenAI response successful');
        
        return {
          content: openaiResponse.content,
          sentiment: (openaiResponse.sentiment as "positive" | "negative" | "neutral") || "neutral",
          categories: openaiResponse.categories || ["general"],
          links: [],
          provider: "openai"
        };
      } else {
        console.log('OpenAI not available, falling back to Rasa...');
      }
    } catch (error: any) {
      console.error('OpenAI failed, falling back to Rasa:', error.message);
    }

    // Fallback to Rasa
    try {
      console.log('Using Rasa as fallback...');
      
      const rasaResponse = await RasaService.processMessage(userId, messageText);
      
      console.log('Rasa response successful');
      
      return {
        content: rasaResponse.content,
        sentiment: rasaResponse.sentiment || "neutral",
        categories: rasaResponse.categories || ["general"],
        links: rasaResponse.links || [],
        provider: "rasa"
      };
    } catch (error: any) {
      console.error('Rasa also failed:', error.message);
    }

    // Final fallback - generic response
    console.log('Both OpenAI and Rasa failed, using generic fallback');
    
    return {
      content: "I'm experiencing some technical difficulties right now. Please try again in a moment, or if this continues, you might want to reach out to a mental health professional for immediate support.",
      sentiment: "neutral",
      categories: ["general"],
      links: [
        {
          text: "Crisis Text Line",
          url: "https://www.crisistextline.org/",
          category: "crisis"
        },
        {
          text: "National Suicide Prevention Lifeline",
          url: "https://suicidepreventionlifeline.org/",
          category: "crisis"
        }
      ],
      provider: "fallback"
    };
  }

  /**
   * Get the status of available AI services
   * @returns Object indicating which services are available
   */
  static getServiceStatus(): {
    openai: boolean;
    rasa: boolean;
    primary: "openai" | "rasa" | "fallback";
  } {
    const openaiAvailable = OpenAIService.isAvailable();
    
    return {
      openai: openaiAvailable,
      rasa: true, // Assume Rasa is always available as fallback
      primary: openaiAvailable ? "openai" : "rasa"
    };
  }

  /**
   * Convert chat messages to conversation history format
   * @param messages Array of chat messages
   * @returns Formatted conversation history
   */
  static formatConversationHistory(
    messages: any[],
    maxMessages: number = 10
  ): { role: 'user' | 'assistant'; content: string }[] {
    // Get the last N messages for context
    const recentMessages = messages.slice(-maxMessages);
    
    return recentMessages
      .filter(msg => msg.sender && msg.content)
      .map(msg => ({
        role: msg.sender === 'ai-assistant' ? 'assistant' as const : 'user' as const,
        content: msg.content
      }));
  }

  /**
   * Health check for AI services
   * @returns Promise with service health status
   */
  static async healthCheck(): Promise<{
    openai: { available: boolean; error?: string };
    rasa: { available: boolean; error?: string };
    overall: "healthy" | "degraded" | "down";
  }> {
    const result = {
      openai: { available: false, error: undefined as string | undefined },
      rasa: { available: false, error: undefined as string | undefined },
      overall: "down" as "healthy" | "degraded" | "down"
    };

    // Check OpenAI
    try {
      if (OpenAIService.isAvailable()) {
        // Try a simple test message
        await OpenAIService.sendMessage("Hello", []);
        result.openai.available = true;
      } else {
        result.openai.error = "API key not configured";
      }
    } catch (error: any) {
      result.openai.error = error.message;
    }

    // Check Rasa
    try {
      await RasaService.sendMessage("health-check", "Hello");
      result.rasa.available = true;
    } catch (error: any) {
      result.rasa.error = error.message;
    }

    // Determine overall health
    if (result.openai.available && result.rasa.available) {
      result.overall = "healthy";
    } else if (result.openai.available || result.rasa.available) {
      result.overall = "degraded";
    } else {
      result.overall = "down";
    }

    return result;
  }
}