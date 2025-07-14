import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const audioData = {
  "5": {
    title: "Guided Meditation",
    description: "5-minute mindfulness meditation to help you relax and center yourself",
    duration: "5:00",
    category: "Meditation",
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes or soften your gaze",
      "Take three deep breaths",
      "Follow the guided instructions",
      "Allow thoughts to come and go without judgment",
    ],
    benefits: [
      "Reduces stress and anxiety",
      "Improves focus and concentration",
      "Promotes emotional well-being",
      "Enhances self-awareness",
      "Better sleep quality",
    ],
    // In a real app, this would be a URL to an audio file
    audioUrl: null,
  },
  "6": {
    title: "Breathing Exercises",
    description: "Simple breathing techniques to manage anxiety and promote relaxation",
    duration: "3:30",
    category: "Breathing",
    instructions: [
      "Sit or lie down comfortably",
      "Place one hand on chest, one on belly",
      "Breathe in slowly through your nose",
      "Feel your belly rise more than your chest",
      "Exhale slowly through your mouth",
      "Repeat for several cycles",
    ],
    benefits: [
      "Activates the relaxation response",
      "Reduces heart rate and blood pressure",
      "Decreases stress hormones",
      "Improves oxygen flow",
      "Calms the nervous system",
    ],
    audioUrl: null,
  },
};

export default function AudioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioResource = audioData[id as keyof typeof audioData];
  
  useEffect(() => {
    // Cleanup function for audio resources
    return () => {
      setIsPlaying(false);
      setPosition(0);
    };
  }, []);

  const playPauseAudio = async () => {
    try {
      if (isPlaying) {
        setIsPlaying(false);
      } else {
        // In a real app, you would load the actual audio file here
        Alert.alert(
          "Audio Simulation",
          "This is a demo. In a real app, the audio would start playing here.",
          [
            {
              text: "OK",
              onPress: () => {
                // Simulate audio playing
                setIsPlaying(true);
                setDuration(300); // 5 minutes in seconds
                simulateAudioProgress();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const simulateAudioProgress = () => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev >= 300) {
          clearInterval(interval);
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopAudio = async () => {
    setIsPlaying(false);
    setPosition(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!audioResource) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Audio</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Audio resource not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Audio</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.audioHeader}>
          <Text style={styles.title}>{audioResource.title}</Text>
          <Text style={styles.description}>{audioResource.description}</Text>
          <View style={styles.meta}>
            <Text style={styles.category}>{audioResource.category}</Text>
            <Text style={styles.duration}>{audioResource.duration}</Text>
          </View>
        </View>
        
        <View style={styles.playerContainer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }
                ]} 
              />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(position)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
          
          <View style={styles.controls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={stopAudio}
              disabled={!isPlaying && position === 0}
            >
              <Ionicons 
                name="stop" 
                size={24} 
                color={!isPlaying && position === 0 ? "#ccc" : "#007AFF"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.playButton}
              onPress={playPauseAudio}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="#fff" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => Alert.alert("Info", "Forward 30 seconds")}
            >
              <Ionicons name="play-forward" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {audioResource.instructions.map((instruction, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listNumber}>{index + 1}.</Text>
              <Text style={styles.listText}>{instruction}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {audioResource.benefits.map((benefit, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.listText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  audioHeader: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  duration: {
    fontSize: 14,
    color: "#666",
  },
  playerContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: 12,
    color: "#666",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 20,
  },
  playButton: {
    backgroundColor: "#007AFF",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listNumber: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
    marginRight: 8,
    minWidth: 20,
  },
  listText: {
    fontSize: 16,
    color: "#444",
    flex: 1,
    lineHeight: 22,
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
});