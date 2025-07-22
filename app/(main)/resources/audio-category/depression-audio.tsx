import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const depressionAudio = [
  {
    id: "dep-audio-1",
    title: "Guided Meditation for Depression Relief",
    description: "15-minute guided meditation to ease depressive symptoms",
    duration: "15:00",
    type: "meditation",
  },
  {
    id: "dep-audio-2",
    title: "Positive Affirmations for Depression",
    description: "Daily affirmations to combat negative thought patterns",
    duration: "10:30",
    type: "affirmations",
  },
  {
    id: "dep-audio-3",
    title: "Body Scan for Emotional Release",
    description: "Progressive body scan to release emotional tension",
    duration: "20:00",
    type: "meditation",
  },
  {
    id: "dep-audio-4",
    title: "Mindfulness for Depression",
    description: "Mindfulness exercises specifically for depression management",
    duration: "12:45",
    type: "mindfulness",
  },
  {
    id: "dep-audio-5",
    title: "Self-Compassion Practice",
    description: "Guided practice in developing self-compassion",
    duration: "18:20",
    type: "therapy",
  },
  {
    id: "dep-audio-6",
    title: "Breathing Exercises for Mood Regulation",
    description: "Breathing techniques to help stabilize mood",
    duration: "8:15",
    type: "breathing",
  },
];

export default function DepressionAudioScreen() {
  const router = useRouter();

  const handleAudioPress = (audioId: string) => {
    router.push(`/resources/audio/${audioId}`);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "meditation":
        return "leaf-outline";
      case "affirmations":
        return "heart-outline";
      case "mindfulness":
        return "eye-outline";
      case "therapy":
        return "chatbubble-outline";
      case "breathing":
        return "refresh-outline";
      default:
        return "musical-note-outline";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Depression Audio Resources</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Guided audio content designed to support you through depression with meditation, affirmations, and therapeutic exercises.
        </Text>

        {depressionAudio.map((audio) => (
          <TouchableOpacity
            key={audio.id}
            style={styles.audioCard}
            onPress={() => handleAudioPress(audio.id)}
          >
            <View style={styles.audioIcon}>
              <Ionicons name={getIconForType(audio.type) as any} size={32} color="#007AFF" />
            </View>
            <View style={styles.audioContent}>
              <Text style={styles.audioTitle}>{audio.title}</Text>
              <Text style={styles.audioDescription}>{audio.description}</Text>
              <View style={styles.audioMeta}>
                <Text style={styles.audioType}>{audio.type.charAt(0).toUpperCase() + audio.type.slice(1)}</Text>
                <Text style={styles.audioDuration}>{audio.duration}</Text>
              </View>
            </View>
            <Ionicons name="play-circle" size={32} color="#007AFF" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
    padding: 16,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 24,
  },
  audioCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  audioIcon: {
    marginRight: 12,
    width: 40,
    alignItems: "center",
  },
  audioContent: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  audioDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  audioMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  audioType: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  audioDuration: {
    fontSize: 12,
    color: "#999",
  },
});