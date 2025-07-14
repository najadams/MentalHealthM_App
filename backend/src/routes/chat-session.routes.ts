import express, { Response } from "express";
import { auth } from "../middleware/auth.middleware";
import { Chat } from "../models/chat.model";
import { AuthRequest } from "../types";
import { NLPService } from "../services/nlp.service";
import { RasaService } from "../services/rasa.service";

const router = express.Router();

// Get all chat sessions for a user
router.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chatSessions = await Chat.find({
      participants: req.user._id,
      chatType: 'ai'
    })
      .populate("participants", "name profilePicture")
      .sort({ updatedAt: -1 });

    // Transform to session format with consistent ID usage
    const sessions = chatSessions.map(chat => ({
      _id: chat._id.toString(),
      id: chat._id.toString(),
      sessionId: chat._id.toString(),
      name: `Chat Session - ${new Date(chat.createdAt).toLocaleDateString()}`,
      lastMessage: chat.lastMessage?.content || "No messages yet",
      time: chat.updatedAt,
      messageCount: chat.messages.length,
      createdAt: chat.createdAt,
      unreadCount: chat.messages.filter(msg => !msg.read && msg.sender !== chat.participants[0]).length
    }));

    res.json({
      success: true,
      sessions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch chat sessions",
    });
  }
});

// Get messages for a specific chat session
router.get("/:sessionId/messages", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chat = await Chat.findOne({
      _id: req.params.sessionId,
      participants: req.user._id,
    }).populate("participants", "name profilePicture");

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat session not found",
      });
    }

    res.json({
      success: true,
      messages: chat.messages,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch session messages",
    });
  }
});

// Create a new chat session
router.post("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { name } = req.body;

    const chat = new Chat({
      participants: [req.user._id, 'ai-assistant'],
      messages: [],
      chatType: 'ai',
      mentalHealthTopics: [],
      aiAssistantId: 'mental-health-ai'
    });

    await chat.save();

    const populatedChat = await chat.populate("participants", "name profilePicture");

    res.status(201).json({
      success: true,
      session: {
        _id: chat._id.toString(),
        id: chat._id.toString(),
        sessionId: chat._id.toString(),
        name: name || `Chat Session - ${new Date(chat.createdAt).toLocaleDateString()}`,
        lastMessage: "No messages yet",
        time: chat.createdAt,
        messageCount: 0,
        createdAt: chat.createdAt,
        unreadCount: 0
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || "Failed to create chat session",
    });
  }
});

// Send a message in a chat session
router.post("/:sessionId/messages", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { content, sender } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: "Message content is required",
      });
    }

    const chat = await Chat.findOne({
      _id: req.params.sessionId,
      participants: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat session not found",
      });
    }

    // Create user message
    const userMessage = {
      sender: sender || req.user._id,
      content,
      timestamp: new Date(),
      read: false,
      sentiment: "neutral" as "positive" | "negative" | "neutral",
      categories: ["general"],
    };

    chat.messages.push(userMessage);
    chat.lastMessage = userMessage;

    // Process message with Rasa
    const rasaResponse = await RasaService.processMessage(
      req.user._id.toString(),
      content
    );

    // Update user message with sentiment and categories from Rasa
    userMessage.sentiment =
      (rasaResponse.sentiment as "positive" | "negative" | "neutral") ||
      "neutral";
    if (rasaResponse.categories) {
      userMessage.categories = rasaResponse.categories;
    }

    // Update mental health topics for the chat
    if (!chat.mentalHealthTopics) {
      chat.mentalHealthTopics = [];
    }

    if (rasaResponse.categories) {
      rasaResponse.categories.forEach((category) => {
        if (!chat.mentalHealthTopics?.includes(category)) {
          chat.mentalHealthTopics?.push(category);
        }
      });
    }

    // Create AI response message
    const aiResponse = {
      sender: "ai-assistant",
      content: rasaResponse.content,
      timestamp: new Date(),
      read: true,
      sentiment:
        (rasaResponse.sentiment as "positive" | "negative" | "neutral") ||
        "neutral",
      categories: rasaResponse.categories,
    };

    chat.messages.push(aiResponse);
    chat.lastMessage = aiResponse;
    
    await chat.save();

    res.json({
      success: true,
      message: userMessage,
      aiResponse: aiResponse,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to send message",
    });
  }
});

// Delete a chat session
router.delete("/:sessionId", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const chat = await Chat.findOne({
      _id: req.params.sessionId,
      participants: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        error: "Chat session not found",
      });
    }

    await Chat.findByIdAndDelete(req.params.sessionId);

    res.json({
      success: true,
      message: "Chat session deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete chat session",
    });
  }
});

export default router;