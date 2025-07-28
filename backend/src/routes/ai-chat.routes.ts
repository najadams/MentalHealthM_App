import express, { Response } from "express";
import { auth } from "../middleware/auth.middleware";
import { Chat } from "../models/chat.model";
import { AuthRequest } from "../types";
import { AIService } from "../services/ai.service";

const router = express.Router();

// Get AI chat history or create new AI chat
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Find existing AI chat for this user
    let aiChat = await Chat.findOne({
      participants: req.user._id,
      chatType: "ai",
      aiAssistantId: "mental-health-ai",
    });

    // If no existing chat, create a new one
    if (!aiChat) {
      const welcomeMessage = {
        sender: "ai-assistant", // Special ID for AI
        content:
          "Hello! I'm your mental health assistant. How are you feeling today?",
        timestamp: new Date(),
        read: true,
        sentiment: "positive",
        categories: ["general"],
      };

      aiChat = new Chat({
        participants: [req.user._id, "ai-assistant"],
        messages: [welcomeMessage],
        lastMessage: welcomeMessage,
        chatType: "ai",
        aiAssistantId: "mental-health-ai",
        mentalHealthTopics: ["general"],
      });

      await aiChat.save();
    }

    res.json({
      success: true,
      chat: aiChat,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get AI chat",
    });
  }
});

// Send message to AI and get response
router.post("/message", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { content, chatId } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    // Find or create AI chat
    let aiChat;
    if (chatId) {
      aiChat = await Chat.findOne({
        _id: chatId,
        participants: req.user._id,
        chatType: "ai",
      });
    }

    if (!aiChat) {
      aiChat = await Chat.findOne({
        participants: req.user._id,
        chatType: "ai",
        aiAssistantId: "mental-health-ai",
      });
    }

    if (!aiChat) {
      // Create new AI chat if none exists
      aiChat = new Chat({
        participants: [req.user._id, "ai-assistant"],
        messages: [],
        chatType: "ai",
        aiAssistantId: "mental-health-ai",
        mentalHealthTopics: [],
      });
    }

    // Add user message to chat
    const userMessage = {
      sender: req.user._id,
      content,
      timestamp: new Date(),
      read: true,
      // Change from string to one of the allowed values
      sentiment: "neutral" as "positive" | "negative" | "neutral",
      categories: ["general"],
    };

    aiChat.messages.push(userMessage);
    aiChat.lastMessage = userMessage;

    // Get conversation history for context
    const conversationHistory = AIService.formatConversationHistory(
      aiChat.messages.slice(-10) // Last 10 messages for context
    );

    // Process message with AI service (OpenAI primary, Rasa fallback)
    const aiResponse = await AIService.processMessage(
      req.user._id.toString(),
      content,
      conversationHistory
    );

    // Update user message with sentiment and categories from AI
    userMessage.sentiment = aiResponse.sentiment;
    userMessage.categories = aiResponse.categories;

    // Update mental health topics for the chat
    if (!aiChat.mentalHealthTopics) {
      aiChat.mentalHealthTopics = [];
    }

    if (aiResponse.categories) {
      aiResponse.categories.forEach((category: string) => {
        if (!aiChat.mentalHealthTopics?.includes(category)) {
          aiChat.mentalHealthTopics?.push(category);
        }
      });
    }

    // Create AI response message
    const aiResponseMessage = {
      sender: "ai-assistant",
      content: aiResponse.content,
      timestamp: new Date(),
      read: true,
      sentiment: aiResponse.sentiment,
      categories: aiResponse.categories,
    };

    aiChat.messages.push(aiResponseMessage);
    aiChat.lastMessage = aiResponseMessage;

    await aiChat.save();

    res.json({
      success: true,
      userMessage,
      aiResponse: aiResponseMessage,
      chat: aiChat,
      provider: aiResponse.provider, // Include which AI service was used
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process AI message",
    });
  }
});

/**
 * Route to handle chat messages to Rasa
 * POST /api/ai-chat/message
 */
router.post("/message", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res
        .status(400)
        .json({ error: "User ID and message are required" });
    }

    // Process the message with AI service
    const response = await AIService.processMessage(userId, message);

    return res.json(response);
  } catch (error) {
    console.error("Error processing chat message:", error);
    return res.status(500).json({ error: "Failed to process message" });
  }
});

// Health check route for AI services
router.get("/health", async (req, res) => {
  try {
    const healthStatus = await AIService.healthCheck();
    const serviceStatus = AIService.getServiceStatus();
    
    res.json({
      success: true,
      health: healthStatus,
      services: serviceStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Health check failed",
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
