import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SectionList,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";
import ChatListItem from "@/app/components/ChatListItem";

// Default AI assistant for mental health
const mentalHealthAI = {
  _id: "ai-assistant",
  id: "ai-assistant",
  name: "Mental Health Assistant",
  lastMessage: "How are you feeling today?",
  unreadCount: 0,
  createdAt: new Date().toISOString(),
};

interface ChatSession {
  _id: string;
  id: string;
  sessionId: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  createdAt: string;
  messageCount?: number;
}

// Helper function to group chat sessions by date
const groupSessionsByDate = (sessions: ChatSession[]) => {
  const grouped = sessions.reduce((groups, session) => {
    const sessionDate = new Date(session.createdAt);
    const dateKey = sessionDate.toDateString();
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(session);
    return groups;
  }, {} as Record<string, ChatSession[]>);
  
  return Object.entries(grouped)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // Most recent first
    .map(([date, sessions]) => {
      const sessionDate = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let title = sessionDate.toLocaleDateString();
      if (sessionDate.toDateString() === today.toDateString()) {
        title = 'Today';
      } else if (sessionDate.toDateString() === yesterday.toDateString()) {
        title = 'Yesterday';
      }
      
      return {
        title,
        data: sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        date: sessionDate,
      };
    });
};

export default function ChatScreen() {
  const router = useRouter();
  const user = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [groupedSessions, setGroupedSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Update grouped sessions whenever chatSessions change
  useEffect(() => {
    const filtered = chatSessions.filter((session) =>
      session.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setGroupedSessions(groupSessionsByDate(filtered));
  }, [chatSessions, searchQuery]);

  useEffect(() => {
    fetchChatSessions();
  }, []);

  const fetchChatSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch chat sessions from API
      const response = await fetch(`http://localhost:3001/api/chat-sessions`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat sessions");
      }

      const data = await response.json();
      
      // Process user's previous chat sessions
      let sessions: ChatSession[] = [];
      
      if (data.sessions && data.sessions.length > 0) {
        const sortedSessions = data.sessions
          .sort((a: ChatSession, b: ChatSession) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((session: ChatSession) => ({
            ...session,
            time: formatTime(session.createdAt),
          }));
        
        sessions = sortedSessions;
      }
      
      setChatSessions(sessions);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      // Show AI assistant as fallback
      // setChatSessions([mentalHealthAI]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchChatSessions();
  };

  const handleNewChat = () => {
    // Navigate to a new chat without creating a session yet
    router.push('/chat/new');
  };

  const startNewChat = async (session: ChatSession) => {
    try {
      // Check if user is authenticated
      if (!user?.token) {
        Alert.alert("Authentication Required", "Please log in to start a chat.");
        return;
      }

      if (session._id === "ai-assistant") {
        // Create a new session for AI assistant
        const response = await fetch("http://localhost:3001/api/chat-sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            type: "mental-health",
            initialMessage: "Hello, I'd like to start a new mental health conversation.",
          }),
        });

        if (!response.ok) {
          if (response.status === 401) {
            Alert.alert("Authentication Error", "Your session has expired. Please log in again.");
            return;
          }
          throw new Error("Failed to create new session");
        }

        const data = await response.json();
        router.push(`/chat/${data.session.sessionId}`);
        return;
      }
      
      // For existing sessions, navigate directly
      router.push(`/chat/${session.sessionId}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      Alert.alert("Error", "Failed to start chat. Please try again.");
    }
  };

  // Render date header for grouped sessions
  const renderDateHeader = ({ section }: { section: any }) => (
    <View style={styles.dateHeader}>
      <Text style={styles.dateText}>{section.title}</Text>
    </View>
  );

  // Render AI assistant header
  const renderAIHeader = () => (
    <View style={styles.aiHeader}>
      <Text style={styles.aiHeaderText}>Start New Chat</Text>
    </View>
  );

  const handleSessionPress = (sessionId: string) => {
    const session = chatSessions.find(s => s.sessionId === sessionId);
    if (session) {
      router.push(`/chat/${session.sessionId}`);
    }
  };

  const handleOptionPress = (sessionId: string, option: string) => {
    switch (option) {
      case "prioritize":
        Alert.alert(
          "Session Prioritized",
          "This chat session has been moved to the top of your list."
        );
        break;
      case "raven":
        Alert.alert("Access Granted", "Raven now has access to this session.");
        break;
      case "mute":
        Alert.alert(
          "Session Muted",
          "You will no longer receive notifications from this session."
        );
        break;
      case "lock":
        Alert.alert(
          "Session Locked",
          "This session is now locked and requires authentication to access."
        );
        break;
      case "block":
        Alert.alert("Session Blocked", "This session has been blocked.");
        break;
      case "delete":
        Alert.alert(
          "Delete Session",
          "Are you sure you want to delete this chat session? All conversation history will be lost.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                try {
                  await fetch(`http://localhost:3001/api/chat-sessions/${sessionId}`, {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${user?.token}`,
                    },
                  });
                  setChatSessions(chatSessions.filter((session) => session.id !== sessionId));
                } catch (error) {
                  console.error("Error deleting session:", error);
                  Alert.alert("Error", "Failed to delete session.");
                }
              },
            },
          ]
        );
        break;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Mental Health Chat</Text>
      <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
        <Ionicons name="create-outline" size={24} color="#2C3E50" />
      </TouchableOpacity>
    </View>
  );

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons
        name="search"
        size={20}
        color="#95A5A6"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder="Search conversations..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#95A5A6"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery("")}>
          <Ionicons name="close-circle" size={20} color="#95A5A6" />
        </TouchableOpacity>
      )}
    </View>
  );

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Please log in to view your chats</Text>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/auth')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderSearchBar()}
      <SectionList
        sections={[
          {
            title: 'Start New Chat',
            data: [mentalHealthAI],
            renderHeader: renderAIHeader,
          },
          ...groupedSessions,
        ]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChatListItem
            name={item.name}
            lastMessage={item.lastMessage}
            time={item.time}
            unreadCount={item.unreadCount}
            onPress={() => handleSessionPress(item.sessionId)}
            onOptionPress={(option: string) => handleOptionPress(item.sessionId, option)}
          />
        )}
        renderSectionHeader={({ section }) => {
          if (section.renderHeader) {
            return section.renderHeader();
          }
          return renderDateHeader({ section });
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor="#007AFF"
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          groupedSessions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={80} color="#BDC3C7" />
              <Text style={styles.emptyTitle}>No conversations yet</Text>
              <Text style={styles.emptyText}>
                Start your first conversation with our mental health assistant by tapping "New Chat" above.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  newChatButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    margin: 16,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
  },
  listContent: {
    paddingBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6C757D',
    textTransform: 'uppercase',
  },
  aiHeader: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#BBDEFB',
  },
  aiHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
    textTransform: 'uppercase',
  },
});
