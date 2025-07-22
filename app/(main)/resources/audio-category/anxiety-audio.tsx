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

const anxietyAudio = [
  {
    id: "anx-audio-1",
    title: "Panic Attack Relief Meditation",
    description: "Immediate calming techniques for panic attacks",
    duration: "8:30",
    type: "emergency",
  },
  {
    id: "anx-audio-2",
    title: "4-7-8 Breathing for Anxiety",
    description: "Proven breathing technique to reduce anxiety quickly",
    duration: "5:45",
    type: "breathing",
  },
  {
    id: "anx-audio-3",
    title: "Progressive Muscle Relaxation",
    description: "Full-body relaxation to release anxiety tension",
    duration: "22:00",
    type: "relaxation",
  },
  {
    id: "anx-audio-4",
    title: "Grounding Meditation for Anxiety",
    description: "5-4-3-2-1 grounding technique in guided format",
    duration: "12:15",
    type: "grounding",
  },
  {
    id: "anx-audio-5",
    title: "Calming Nature Sounds",
    description: "Peaceful nature sounds for anxiety relief",
    duration: "30:00",
    type: "ambient",
  },
  {
    id: "anx-audio-6",
    title: "Anxiety Affirmations",
    description: "Positive affirmations to counter anxious thoughts",
    duration: "11:20",
    type: "affirmations",
  },
  {
    id: "anx-audio-7",
    title: "Mindful Walking Meditation",
    description: "Guided walking meditation for anxiety management",
    duration: "16:40",
    type: "mindfulness",
  },
  {
    id: "anx-audio-8",
    title: "Social Anxiety Confidence Boost",
    description: "Guided meditation for social anxiety situations",
    duration: "14:25",
    type: "confidence",
  },
];

export default function AnxietyAudioScreen() {
  const router = useRouter();

  const handleAudioPress = (audioId: string) => {
    router.push(`/resources/audio/${audioId}`);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "emergency":
        return "medical-outline";
      case "breathing":
        return "refresh-outline";
      case "relaxation":
        return "body-outline";
      case "grounding":
        return "earth-outline";
      case "ambient":
        return "leaf-outline";
      case "affirmations":
        return "heart-outline";
      case "mindfulness":
        return "eye-outline";
      case "confidence":
        return "trophy-outline";
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
        <Text style={styles.headerTitle}>Anxiety Audio Resources</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Calming audio content to help manage anxiety with breathing exercises, meditations, and relaxation techniques.
        </Text>

        {anxietyAudio.map((audio) => (
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