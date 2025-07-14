import { MoodEntry } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base API URL
const API_URL = "http://localhost:3001";
// Define API_BASE_URL to match API_URL for consistency
const API_BASE_URL = API_URL;

// Fetch journal entry
export const fetchJournalEntry = async (id: string) => {
  const token = await AsyncStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  const response = await fetch(`${API_URL}/api/journal/entries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch journal entry");
  }
  
  return response.json();
};

// Logout user
export const logoutUser = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    // Call the correct logout endpoint
    const response = await fetch(`${API_URL}/api/user/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Even if the server response fails, we should still clear local storage
    // and consider the user logged out on the client side
    
    // Clear user data from AsyncStorage
    await Promise.all([
      AsyncStorage.removeItem("token"),
      AsyncStorage.removeItem("userData"),
    ]);
    
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    
    // Still clear local storage even if the API call fails
    await Promise.all([
      AsyncStorage.removeItem("token"),
      AsyncStorage.removeItem("userData"),
    ]);
    
    return { success: true, localOnly: true };
  }
};

export const registerUser = async (userData: {
  email: string;
  password: string;
  name?: string;
  username?: string;
  phone?: string;
}) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
};


// Add this new function to fetch mood trends
export const fetchMoodTrends = async (startDate: string, endDate: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await fetch(
      `${API_URL}/api/mood/trends?startDate=${startDate}&endDate=${endDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch mood trends");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mood trends:", error);
    throw error;
  }
};

// Fetch mood entries with pagination
export const fetchMoodEntries = async (page = 1, limit = 10, startDate?: string, endDate?: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    let url = `${API_URL}/api/mood/entries?page=${page}&limit=${limit}`;
    
    // Add date range parameters if provided
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch mood entries");
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching mood entries:", error);
    throw error;
  }
};

// Create mood entry
export const createMoodEntry = async (mood: string, intensity: number, notes?: string) => {
  try {
    const token = await AsyncStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await fetch(`${API_URL}/api/mood/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mood,
        intensity,
        notes,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create mood entry");
    }
    
    return response.json();
  } catch (error) {
    console.error("Error creating mood entry:", error);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error in fetchUserProfile:", error);
    throw error;
  }
};

export const updateUserProfile = async (userData: {
  name?: string;
  email?: string;
  profilePicture?: string;
}) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    throw error;
  }
};

// Chat functions
export const fetchChats = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chats`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chats");
    }

    return response.json();
  } catch (error) {
    console.error("Error in fetchChats:", error);
    throw error;
  }
};

export const createChat = async (participantId: string, message: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        participantId,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create chat");
    }

    return response.json();
  } catch (error) {
    console.error("Error in createChat:", error);
    throw error;
  }
};

export const fetchChatHistory = async (chatId: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chat history");
    }

    return response.json();
  } catch (error) {
    console.error("Error in fetchChatHistory:", error);
    throw error;
  }
};

export const sendMessage = async (chatId: string, content: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return response.json();
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
};

export const sendAiMessage = async (content: string, chatId?: string) => {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/ai-chat/message`, {
      method: "POST",
      headers,
      body: JSON.stringify({ content, chatId }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    return response.json();
  } catch (error) {
    console.error("Error in sendAiMessage:", error);
    throw error;
  }
};

// Add the missing function for fetching activity history
// export const fetchActivityHistory = async (page = 1, limit = 10, startDate?: string, endDate?: string) => {
//   try {
//     const token = await AsyncStorage.getItem("token");
    
//     if (!token) {
//       throw new Error("No authentication token found");
//     }
    
//     let url = `${API_URL}/api/activities/history?page=${page}&limit=${limit}`;
    
//     // Add date range parameters if provided
//     if (startDate && endDate) {
//       url += `&startDate=${startDate}&endDate=${endDate}`;
//     }
    
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || "Failed to fetch activity history");
//     }
    
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching activity history:", error);
//     throw error;
//   }
// };
export const fetchActivityHistory = async (startDate?: string, endDate?: string, page = 1, limit = 10) => {
  try {
    const token = await AsyncStorage.getItem("token");
    
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    let url = `${API_URL}/api/activities/history?page=${page}&limit=${limit}`;
    
    // Add date range parameters if provided
    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch activity history");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching activity history:", error);
    throw error;
  }
};

// Helper function to get authentication headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem("token");
  
  if (!token) {
    throw new Error("No authentication token found");
  }
  
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchJournalEntries = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`http://localhost:3001/api/journal/entries`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch journal entries");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return { entries: [] };
  }
};
