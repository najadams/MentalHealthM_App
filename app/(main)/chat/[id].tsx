import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SectionList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Animated,
  Keyboard,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
  type?: "text" | "image" | "file";
}

// Mental health conversation starters
const mentalHealthPrompts = [
  "How are you feeling today?",
  "Would you like to talk about your symptoms?",
  "Have you been experiencing anxiety lately?",
  "Tell me about your sleep patterns",
  "How has your mood been this week?",
];

// AI responses for mental health
const aiResponses = {
  anxiety: [
    "It sounds like you're experiencing anxiety. Have you tried any relaxation techniques?",
    "Anxiety can be challenging. What triggers your anxiety most often?",
    "Deep breathing exercises can help with anxiety. Would you like to try one now?",
  ],
  depression: [
    "I'm sorry to hear you're feeling down. Have you spoken to a professional about these feelings?",
    "Depression can make everyday tasks difficult. What activities usually bring you joy?",
    "Remember that it's okay to ask for help. Would you like resources for professional support?",
  ],
  sleep: [
    "Sleep problems can significantly impact mental health. How many hours do you typically sleep?",
    "Creating a bedtime routine might help improve your sleep. Would you like some suggestions?",
    "Have you noticed any patterns in your sleep disturbances?",
  ],
  general: [
    "Thank you for sharing that with me. How does that make you feel?",
    "I'm here to listen. Would you like to tell me more about that?",
    "It's important to acknowledge your feelings. What do you think might help?",
    "Have you discussed these concerns with a healthcare provider?",
  ],
};

// Helper function to group messages by date
const groupMessagesByDate = (messages: Message[]) => {
  const grouped = messages.reduce((groups, message) => {
    const messageDate = new Date(message.timestamp);
    const dateKey = messageDate.toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return Object.entries(grouped)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([date, messages]) => {
      const messageDate = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let title = messageDate.toLocaleDateString();
      if (messageDate.toDateString() === today.toDateString()) {
        title = "Today";
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        title = "Yesterday";
      }

      return {
        title,
        data: messages,
        date: messageDate,
      };
    });
};

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const sectionListRef = useRef<SectionList>(null);
  const inputHeight = useRef(new Animated.Value(40)).current;
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [groupedMessages, setGroupedMessages] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Update grouped messages whenever messages change
  useEffect(() => {
    setGroupedMessages(groupMessagesByDate(messages));
  }, [messages]);

  useEffect(() => {
    // Load chat history or start new chat
    if (id === "new") {
      // New chat - don't show any messages initially
      setMessages([]);
      setCurrentSessionId(null);
    } else {
      // Load existing chat session
      setCurrentSessionId(id as string);
    }
  }, [id]);

  // Separate useEffect to fetch history when currentSessionId changes
  useEffect(() => {
    if (currentSessionId && id !== "new") {
      fetchSessionHistory();
    }
  }, [currentSessionId]);

  const fetchSessionHistory = async () => {
    try {
      // Don't fetch history for new chats
      if (id === "new") {
        return;
      }

      // Check if user is authenticated
      if (!user?.token) {
        const errorMessage: Message = {
          id: "auth-error",
          text: "Please log in to view your chat history.",
          sender: "other",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages([errorMessage]);
        return;
      }

      // For existing chat sessions, fetch history from API
      const response = await fetch(
        `http://localhost:3001/api/chat-sessions/${currentSessionId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error("Failed to fetch session history");
      }

      const data = await response.json();

      // Transform messages to the format needed by the UI
      const formattedMessages = data.messages.map((msg: any) => ({
        id: msg._id,
        text: msg.content,
        sender: msg.sender === user?._id ? "user" : "other",
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: msg.read ? "read" : "delivered",
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error fetching session history:", error);
      // If error, show a default message
      const errorMessage: Message = {
        id: "error",
        text: "Failed to load session history. Please try again.",
        sender: "other",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([errorMessage]);
    }
  };

  const handleSend = async () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sending",
      };

      setMessages((prev) => [...prev, userMessage]);
      setNewMessage("");
      setIsTyping(false);
      setShowSuggestions(false);

      // Reset input height
      Animated.spring(inputHeight, {
        toValue: 40,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }).start();

      // Dismiss keyboard
      Keyboard.dismiss();

      // If this is a new chat, create the session first
      if (id === "new" && !currentSessionId) {
        try {
          const response = await fetch(
            "http://localhost:3001/api/chat-sessions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                name: "Mental Health Chat",
              }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to create new session");
          }

          const data = await response.json();

          // Set the current session ID without navigation
          setCurrentSessionId(data.session.sessionId);

          // Update the message status to sent
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === userMessage.id ? { ...msg, status: "sent" } : msg
            )
          );

          // Generate AI response immediately without navigation
          // Pass the user message text and the new session ID to save messages properly
          generateAiResponseForNewSession(
            userMessage.text,
            data.session.sessionId
          );

          return;
        } catch (error) {
          console.error("Error creating new session:", error);
          // Handle error - maybe show an alert
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.id === userMessage.id ? { ...msg, status: "failed" } : msg
            )
          );
          return;
        }
      }

      // Simulate message sending status update
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "sent" } : msg
          )
        );

        // For existing chat sessions, send to API and generate AI response
        sendMessageToApi(userMessage.text);
        generateAiResponse(userMessage.text);
      }, 500);

      if (groupedMessages.length > 0) {
        const lastSection = groupedMessages[groupedMessages.length - 1];
        const lastItemIndex = lastSection.data.length - 1;
        sectionListRef.current?.scrollToLocation({
          sectionIndex: groupedMessages.length - 1,
          itemIndex: lastItemIndex,
          animated: true,
        });
      }
    }
  };

  const generateAiResponseForNewSession = async (
    userText: string,
    sessionId: string
  ) => {
    // Show AI typing indicator
    setIsAiTyping(true);

    let aiResponseText = "";
    let responseSource = "";

    try {
      // First, try to get response from online AI service (OpenAI)
      aiResponseText = await getOnlineAiResponse(userText);
      responseSource = "online";
    } catch (onlineError) {
      console.log(
        "Online AI service unavailable, falling back to Rasa:",
        onlineError
      );

      try {
        // Fallback to Rasa if online service fails
        aiResponseText = await getRasaResponse(userText);
        responseSource = "rasa";
      } catch (rasaError) {
        console.error("Both online AI and Rasa failed:", rasaError);
        aiResponseText =
          "I'm having trouble connecting to my systems right now. Please try again later.";
        responseSource = "fallback";
      }
    }

    // Add AI response to messages
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: aiResponseText,
      sender: "other",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "read",
    };

    setMessages((prev) => [...prev, aiMessage]);

    // Save messages to the new session
    await saveMessagesToNewSession(userText, aiResponseText, sessionId);

    setIsAiTyping(false);
    // Scroll to the last message
    setTimeout(() => {
      if (groupedMessages.length > 0) {
        const lastSection = groupedMessages[groupedMessages.length - 1];
        const lastItemIndex = lastSection.data.length - 1;
        sectionListRef.current?.scrollToLocation({
          sectionIndex: groupedMessages.length - 1,
          itemIndex: lastItemIndex,
          animated: true,
        });
      }
    }, 100);
  };

  const generateAiResponse = async (userText: string) => {
    // Show AI typing indicator
    setIsAiTyping(true);

    let aiResponseText = "";
    let responseSource = "";

    try {
      // First, try to get response from online AI service (OpenAI)
      aiResponseText = await getOnlineAiResponse(userText);
      responseSource = "online";
    } catch (onlineError) {
      console.log(
        "Online AI service unavailable, falling back to Rasa:",
        onlineError
      );

      try {
        // Fallback to Rasa if online service fails
        aiResponseText = await getRasaResponse(userText);
        responseSource = "rasa";
      } catch (rasaError) {
        console.error("Both online AI and Rasa failed:", rasaError);
        aiResponseText =
          "I'm having trouble connecting to my systems right now. Please try again later.";
        responseSource = "fallback";
      }
    }

    // Add AI response to messages
    const aiMessage: Message = {
      id: Date.now().toString(),
      text: aiResponseText,
      sender: "other",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "read",
    };

    setMessages((prev) => [...prev, aiMessage]);

    // Save AI message to session if we have a session ID
    if (currentSessionId) {
      await saveAiMessageToSession(aiResponseText);
    }

    setIsAiTyping(false);
    // Scroll to the last message
    setTimeout(() => {
      if (groupedMessages.length > 0) {
        const lastSection = groupedMessages[groupedMessages.length - 1];
        const lastItemIndex = lastSection.data.length - 1;
        sectionListRef.current?.scrollToLocation({
          sectionIndex: groupedMessages.length - 1,
          itemIndex: lastItemIndex,
          animated: true,
        });
      }
    }, 100);
  };

  const getOnlineAiResponse = async (userText: string): Promise<string> => {
    // Try to get response from online AI service (e.g., OpenAI)
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a compassionate mental health assistant. Provide supportive, empathetic responses while encouraging users to seek professional help when appropriate. Keep responses concise and helpful.",
          },
          {
            role: "user",
            content: userText,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API failed: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "I'm sorry, I couldn't generate a response."
    );
  };

  const getRasaResponse = async (userText: string): Promise<string> => {
    // Call the Rasa bot API as fallback
    const response = await fetch(
      `http://localhost:5005/webhooks/rest/webhook`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: user?._id || "user",
          message: userText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get Rasa response");
    }

    const data = await response.json();
    return data[0]?.text || "I'm sorry, I didn't understand that.";
  };

  const saveMessagesToNewSession = async (
    userText: string,
    aiText: string,
    sessionId: string
  ) => {
    try {
      // Check if user is authenticated
      if (!user?.token) {
        console.warn("User not authenticated, cannot save messages");
        return;
      }

      // Save user message
      await fetch(
        `http://localhost:3001/api/chat-sessions/${sessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            content: userText,
            sender: user._id || "user",
          }),
        }
      );

      // Save AI response
      await fetch(
        `http://localhost:3001/api/chat-sessions/${sessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            content: aiText,
            sender: "ai-assistant",
          }),
        }
      );
    } catch (error) {
      console.error("Error saving messages to new session:", error);
    }
  };

  const saveAiMessageToSession = async (aiText: string) => {
    try {
      // Check if user is authenticated
      if (!user?.token) {
        console.warn("User not authenticated, cannot save messages");
        return;
      }

      // Only save AI response (user message already saved by sendMessageToApi)
      await fetch(
        `http://localhost:3001/api/chat-sessions/${currentSessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            content: aiText,
            sender: "ai-assistant",
          }),
        }
      );
    } catch (error) {
      console.error("Error saving AI message to session:", error);
    }
  };

  const sendMessageToApi = async (text: string) => {
    try {
      // Check if user is authenticated
      if (!user?.token) {
        Alert.alert("Authentication Error", "Please log in to send messages.");
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/chat-sessions/${currentSessionId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ content: text }),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          Alert.alert(
            "Authentication Error",
            "Your session has expired. Please log in again."
          );
          return;
        }
        throw new Error("Failed to send message");
      }

      // Update message status to delivered
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.text === text && msg.sender === "user"
            ? { ...msg, status: "delivered" }
            : msg
        )
      );

      // Don't fetch session history here to avoid duplicates
      // The AI response will be handled by generateAiResponse function
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const renderDateHeader = ({ section }: { section: any }) => (
    <View style={styles.dateHeader}>
      <Text style={styles.dateText}>{section.title}</Text>
    </View>
  );

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    const isOther = item.sender === "other";
    const messageTime = item.timestamp; // timestamp is already formatted

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.otherMessage,
        ]}>
        {isOther && (
          <Image
            source={{
              uri: "https://via.placeholder.com/36x36.png?text=AI",
            }}
            style={styles.avatar}
          />
        )}
        <View style={styles.messageContent}>
          <View
            style={[
              styles.messageBubble,
              isUser ? styles.userBubble : styles.otherBubble,
            ]}>
            <Text
              style={[
                styles.messageText,
                isUser ? styles.userMessageText : styles.otherMessageText,
              ]}>
              {item.text}
            </Text>
          </View>
          <View
            style={[
              styles.messageFooter,
              isUser
                ? { justifyContent: "flex-end" }
                : { justifyContent: "flex-start" },
            ]}>
            <Text style={styles.timestamp}>{messageTime}</Text>
            {isUser && (
              <View style={styles.statusContainer}>
                {item.status === "sending" && (
                  <Ionicons name="time-outline" size={12} color="#95A5A6" />
                )}
                {item.status === "sent" && (
                  <Ionicons name="checkmark" size={12} color="#95A5A6" />
                )}
                {item.status === "delivered" && (
                  <Ionicons name="checkmark-done" size={12} color="#95A5A6" />
                )}
                {item.status === "read" && (
                  <Ionicons name="checkmark-done" size={12} color="#007AFF" />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const handleInputChange = (text: string) => {
    setNewMessage(text);
    setIsTyping(text.length > 0);

    const lines = text.split("\n").length;
    const newHeight = Math.min(Math.max(40, lines * 20 + 20), 120);

    Animated.spring(inputHeight, {
      toValue: newHeight,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  };

  const renderSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      <Text style={styles.suggestionsTitle}>Suggested topics:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {mentalHealthPrompts.map((prompt, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionBubble}
            onPress={() => {
              setNewMessage(prompt);
              setShowSuggestions(false);
            }}>
            <Text style={styles.suggestionText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {id === "new" ? "New Chat" : "Mental Health Assistant"}
        </Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#2C3E50"
          />
        </TouchableOpacity>
      </View>

      {groupedMessages.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color="#BDC3C7" />
          <Text style={styles.emptyStateTitle}>Start a conversation</Text>
          <Text style={styles.emptyStateSubtitle}>
            Send a message to begin your mental health conversation.
          </Text>
        </View>
      ) : (
        <SectionList
          ref={sectionListRef}
          sections={groupedMessages}
          renderItem={renderMessage}
          renderSectionHeader={renderDateHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          getItemLayout={(data, index) => ({
            length: 80, // Approximate height of a message
            offset: 80 * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            console.warn("Scroll to index failed:", info);
            // Fallback: scroll to end
            setTimeout(() => {
              if (groupedMessages.length > 0) {
                const lastSection = groupedMessages[groupedMessages.length - 1];
                const lastItemIndex = lastSection.data.length - 1;
                sectionListRef.current?.scrollToLocation({
                  sectionIndex: groupedMessages.length - 1,
                  itemIndex: lastItemIndex,
                  animated: true,
                });
              }
            }, 100);
          }}
          onContentSizeChange={() => {
            if (groupedMessages.length > 0) {
              const lastSection = groupedMessages[groupedMessages.length - 1];
              const lastItemIndex = lastSection.data.length - 1;
              sectionListRef.current?.scrollToLocation({
                sectionIndex: groupedMessages.length - 1,
                itemIndex: lastItemIndex,
                animated: true,
              });
            }
          }}
          stickySectionHeadersEnabled={false}
        />
      )}

      {isAiTyping && (
        <View style={styles.typingIndicator}>
          <Text style={styles.typingText}>Assistant is typing</Text>
          <ActivityIndicator size="small" color="#4FC3F7" />
        </View>
      )}

      {showSuggestions && renderSuggestions()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.suggestionButton}
          onPress={() => setShowSuggestions(!showSuggestions)}>
          <Ionicons name="help-circle-outline" size={24} color="#95A5A6" />
        </TouchableOpacity>

        <Animated.View
          style={[styles.textInputContainer, { height: inputHeight }]}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={newMessage}
            onChangeText={handleInputChange}
            multiline
          />
        </Animated.View>

        <TouchableOpacity
          style={[styles.sendButton, isTyping ? styles.sendButtonActive : {}]}
          onPress={handleSend}
          disabled={!isTyping}>
          <Ionicons
            name="send"
            size={24}
            color={isTyping ? "#007AFF" : "#95A5A6"}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
  },
  infoButton: {
    padding: 8,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 32,
  },
  dateHeader: {
    alignItems: "center",
    marginVertical: 16,
  },
  dateText: {
    backgroundColor: "#E8E8E8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 16,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  otherMessage: {
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  messageContent: {
    flexDirection: "column",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderTopRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#E8E8E8",
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#2C3E50",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#95A5A6",
    marginRight: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  suggestionButton: {
    padding: 8,
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonActive: {
    backgroundColor: "#F0F8FF",
    borderRadius: 20,
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginLeft: 16,
  },
  typingText: {
    fontSize: 14,
    color: "#95A5A6",
    marginRight: 8,
  },
  suggestionsContainer: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E8E8E8",
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2C3E50",
    marginBottom: 8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 22,
  },
  suggestionBubble: {
    backgroundColor: "#E8E8E8",
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: "#2C3E50",
  },
});
