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
import { Audio } from "expo-av";

const audioData = {
  "5": {
    title: "Guided Meditation",
    description:
      "5-minute mindfulness meditation to help you relax and center yourself",
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
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav",
  },
  "6": {
    title: "Breathing Exercises",
    description:
      "Simple breathing techniques to manage anxiety and promote relaxation",
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
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav",
  },
  // Depression Audio Resources
  "dep-audio-1": {
    title: "Guided Meditation for Depression Relief",
    description: "15-minute guided meditation to ease depressive symptoms",
    duration: "15:00",
    category: "Depression Support",
    instructions: [
      "Find a quiet, comfortable space",
      "Sit or lie down in a relaxed position",
      "Close your eyes and breathe naturally",
      "Follow the gentle guidance",
      "Be patient and kind with yourself",
    ],
    benefits: [
      "Reduces depressive symptoms",
      "Promotes emotional healing",
      "Increases self-compassion",
      "Improves mood regulation",
      "Enhances overall well-being",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav",
  },
  "dep-audio-2": {
    title: "Positive Affirmations for Depression",
    description: "Daily affirmations to combat negative thought patterns",
    duration: "10:30",
    category: "Depression Support",
    instructions: [
      "Listen in a quiet environment",
      "Repeat the affirmations aloud or silently",
      "Focus on the meaning of each statement",
      "Practice daily for best results",
      "Believe in your capacity for healing",
    ],
    benefits: [
      "Challenges negative self-talk",
      "Builds self-esteem",
      "Promotes positive thinking",
      "Strengthens resilience",
      "Supports recovery process",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars3.wav",
  },
  // Anxiety Audio Resources
  "anx-audio-1": {
    title: "Panic Attack Relief Meditation",
    description: "Immediate calming techniques for panic attacks",
    duration: "8:30",
    category: "Anxiety Relief",
    instructions: [
      "Use immediately when feeling panic",
      "Focus on your breathing",
      "Follow the calming voice",
      "Ground yourself in the present moment",
      "Remember that this feeling will pass",
    ],
    benefits: [
      "Provides immediate relief",
      "Reduces panic symptoms",
      "Teaches coping strategies",
      "Promotes calm and safety",
      "Builds confidence in managing anxiety",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
  },
  "anx-audio-2": {
    title: "4-7-8 Breathing for Anxiety",
    description: "Proven breathing technique to reduce anxiety quickly",
    duration: "5:45",
    category: "Anxiety Relief",
    instructions: [
      "Sit comfortably with back straight",
      "Exhale completely through your mouth",
      "Inhale through nose for 4 counts",
      "Hold breath for 7 counts",
      "Exhale through mouth for 8 counts",
    ],
    benefits: [
      "Activates relaxation response",
      "Reduces anxiety quickly",
      "Lowers heart rate",
      "Calms nervous system",
      "Easy to use anywhere",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
  },
  // Sleep Audio Resources
  "sleep-audio-1": {
    title: "Deep Sleep Meditation",
    description: "Guided meditation to help you fall asleep naturally",
    duration: "45:00",
    category: "Sleep Support",
    instructions: [
      "Use in bed when ready to sleep",
      "Lie down comfortably",
      "Close your eyes",
      "Follow the gentle guidance",
      "Allow yourself to drift off naturally",
    ],
    benefits: [
      "Promotes natural sleep",
      "Reduces sleep anxiety",
      "Improves sleep quality",
      "Calms racing thoughts",
      "Establishes healthy sleep routine",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/tada.wav",
  },
  "sleep-audio-2": {
    title: "Rain Sounds for Sleep",
    description: "Gentle rain sounds to promote restful sleep",
    duration: "60:00",
    category: "Sleep Support",
    instructions: [
      "Play at comfortable volume",
      "Use throughout the night",
      "Combine with other sleep hygiene practices",
      "Create a consistent bedtime routine",
      "Ensure room is dark and cool",
    ],
    benefits: [
      "Masks disruptive sounds",
      "Creates calming environment",
      "Promotes deeper sleep",
      "Reduces sleep interruptions",
      "Natural and soothing",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg10.wav",
  },
  // Mental Health Audio Resources
  "mh-audio-1": {
    title: "Daily Mindfulness Practice",
    description: "10-minute daily mindfulness meditation for mental wellness",
    duration: "10:00",
    category: "Mental Wellness",
    instructions: [
      "Practice at the same time daily",
      "Find a quiet space",
      "Sit comfortably",
      "Focus on present moment awareness",
      "Be gentle with wandering thoughts",
    ],
    benefits: [
      "Builds mindfulness skills",
      "Reduces overall stress",
      "Improves emotional regulation",
      "Enhances self-awareness",
      "Supports mental clarity",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/gettysburg.wav",
  },
  "mh-audio-2": {
    title: "Stress Relief Meditation",
    description: "Guided meditation to reduce stress and tension",
    duration: "18:30",
    category: "Mental Wellness",
    instructions: [
      "Use when feeling overwhelmed",
      "Find a comfortable position",
      "Focus on releasing tension",
      "Follow the guided relaxation",
      "Take time to integrate the experience",
    ],
    benefits: [
      "Reduces stress hormones",
      "Releases physical tension",
      "Promotes mental clarity",
      "Improves coping abilities",
      "Restores inner balance",
    ],
    audioUrl: "https://www2.cs.uic.edu/~i101/SoundFiles/LaserShot.wav",
  },
};

export default function AudioScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  
  const audioResource = audioData[id as keyof typeof audioData];
  
  useEffect(() => {
    // Configure audio mode
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    // Cleanup function for audio resources
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playPauseAudio = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        // Load and play the audio file
        if (audioResource.audioUrl) {
          // Handle both local and remote URLs
          const source = typeof audioResource.audioUrl === 'string'
            ? { uri: audioResource.audioUrl }
            : audioResource.audioUrl;
            
          const { sound: newSound } = await Audio.Sound.createAsync(
            source,
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );
          setSound(newSound);
          setIsPlaying(true);
        } else {
          Alert.alert("Error", "No audio file available for this resource.");
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      Alert.alert("Error", "Failed to play audio file.");
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(Math.floor(status.positionMillis / 1000));
      setDuration(Math.floor(status.durationMillis / 1000));
      setIsPlaying(status.isPlaying);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  const stopAudio = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.setPositionAsync(0);
        setIsPlaying(false);
        setPosition(0);
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const seekAudio = async (seconds: number) => {
    try {
      if (sound && duration > 0) {
        const newPosition = Math.max(0, Math.min(position + seconds, duration));
        await sound.setPositionAsync(newPosition * 1000);
        setPosition(newPosition);
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
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
              onPress={() => seekAudio(-10)}
            >
              <Ionicons name="play-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            
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
              onPress={() => seekAudio(10)}
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
  seekText: {
    fontSize: 10,
    color: "#007AFF",
    marginTop: 2,
    fontWeight: "500",
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