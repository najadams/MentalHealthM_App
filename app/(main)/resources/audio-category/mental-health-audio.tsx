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

const mentalHealthAudio = [
  {
    id: "mh-audio-1",
    title: "Daily Mindfulness Practice",
    description: "10-minute daily mindfulness meditation for mental wellness",
    duration: "10:00",
    type: "mindfulness",
  },
  {
    id: "mh-audio-2",
    title: "Stress Relief Meditation",
    description: "Guided meditation to reduce stress and tension",
    duration: "18:30",
    type: "stress-relief",
  },
  {
    id: "mh-audio-3",
    title: "Self-Esteem Building Affirmations",
    description: "Positive affirmations to boost self-confidence",
    duration: "15:45",
    type: "affirmations",
  },
  {
    id: "mh-audio-4",
    title: "Emotional Regulation Techniques",
    description: "Guided exercises for managing difficult emotions",
    duration: "22:15",
    type: "emotional-regulation",
  },
  {
    id: "mh-audio-5",
    title: "Gratitude Meditation",
    description: "Cultivating gratitude for improved mental health",
    duration: "12:30",
    type: "gratitude",
  },
  {
    id: "mh-audio-6",
    title: "Loving-Kindness Meditation",
    description: "Developing compassion for self and others",
    duration: "16:20",
    type: "compassion",
  },
  {
    id: "mh-audio-7",
    title: "Focus and Concentration Training",
    description: "Meditation to improve focus and mental clarity",
    duration: "14:00",
    type: "focus",
  },
  {
    id: "mh-audio-8",
    title: "Trauma-Informed Breathing",
    description: "Gentle breathing exercises for trauma recovery",
    duration: "11:45",
    type: "trauma-support",
  },
  {
    id: "mh-audio-9",
    title: "Energy Cleansing Meditation",
    description: "Release negative energy and restore balance",
    duration: "19:30",
    type: "energy-work",
  },
  {
    id: "mh-audio-10",
    title: "Resilience Building Practice",
    description: "Strengthen mental resilience and coping skills",
    duration: "17:15",
    type: "resilience",
  },
];

export default function MentalHealthAudioScreen() {
  const router = useRouter();

  const handleAudioPress = (audioId: string) => {
    router.push(`/resources/audio/${audioId}`);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "mindfulness":
        return "eye-outline";
      case "stress-relief":
        return "leaf-outline";
      case "affirmations":
        return "heart-outline";
      case "emotional-regulation":
        return "pulse-outline";
      case "gratitude":
        return "gift-outline";
      case "compassion":
        return "people-outline";
      case "focus":
        return "telescope-outline";
      case "trauma-support":
        return "shield-outline";
      case "energy-work":
        return "flash-outline";
      case "resilience":
        return "fitness-outline";
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
        <Text style={styles.headerTitle}>Mental Health Audio</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Comprehensive audio resources for overall mental wellness, including mindfulness, stress relief, and emotional regulation practices.
        </Text>

        {mentalHealthAudio.map((audio) => (
          <TouchableOpacity
            key={audio.id}
            style={styles.audioCard}
            onPress={() => handleAudioPress(audio.id)}
          >
            <View style={styles.audioIcon}>
              <Ionicons name={getIconForType(audio.type) as any} size={32} color="#10B981" />
            </View>
            <View style={styles.audioContent}>
              <Text style={styles.audioTitle}>{audio.title}</Text>
              <Text style={styles.audioDescription}>{audio.description}</Text>
              <View style={styles.audioMeta}>
                <Text style={styles.audioType}>{audio.type.charAt(0).toUpperCase() + audio.type.slice(1).replace('-', ' ')}</Text>
                <Text style={styles.audioDuration}>{audio.duration}</Text>
              </View>
            </View>
            <Ionicons name="play-circle" size={32} color="#10B981" />
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
    color: "#10B981",
    fontWeight: "500",
  },
  audioDuration: {
    fontSize: 12,
    color: "#999",
  },
});