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

const sleepAudio = [
  {
    id: "sleep-audio-1",
    title: "Deep Sleep Meditation",
    description: "Guided meditation to help you fall asleep naturally",
    duration: "45:00",
    type: "meditation",
  },
  {
    id: "sleep-audio-2",
    title: "Rain Sounds for Sleep",
    description: "Gentle rain sounds to promote restful sleep",
    duration: "60:00",
    type: "nature",
  },
  {
    id: "sleep-audio-3",
    title: "Body Scan for Sleep",
    description: "Progressive relaxation to prepare your body for sleep",
    duration: "25:30",
    type: "relaxation",
  },
  {
    id: "sleep-audio-4",
    title: "Sleep Stories: Peaceful Journey",
    description: "Calming bedtime stories for adults",
    duration: "35:15",
    type: "stories",
  },
  {
    id: "sleep-audio-5",
    title: "White Noise for Deep Sleep",
    description: "Consistent white noise to mask disruptive sounds",
    duration: "480:00",
    type: "white-noise",
  },
  {
    id: "sleep-audio-6",
    title: "Breathing for Sleep",
    description: "4-7-8 breathing technique for falling asleep",
    duration: "12:00",
    type: "breathing",
  },
  {
    id: "sleep-audio-7",
    title: "Ocean Waves Sleep Sounds",
    description: "Rhythmic ocean waves for peaceful sleep",
    duration: "90:00",
    type: "nature",
  },
  {
    id: "sleep-audio-8",
    title: "Sleep Affirmations",
    description: "Positive affirmations for restful sleep",
    duration: "20:45",
    type: "affirmations",
  },
];

export default function SleepAudioScreen() {
  const router = useRouter();

  const handleAudioPress = (audioId: string) => {
    router.push(`/resources/audio/${audioId}`);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "meditation":
        return "leaf-outline";
      case "nature":
        return "water-outline";
      case "relaxation":
        return "body-outline";
      case "stories":
        return "book-outline";
      case "white-noise":
        return "radio-outline";
      case "breathing":
        return "refresh-outline";
      case "affirmations":
        return "heart-outline";
      default:
        return "moon-outline";
    }
  };

  const formatDuration = (duration: string) => {
    const minutes = parseInt(duration.split(':')[0]);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
    return duration;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep Audio Resources</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Relaxing audio content designed to help you fall asleep and improve sleep quality with meditations, nature sounds, and sleep stories.
        </Text>

        {sleepAudio.map((audio) => (
          <TouchableOpacity
            key={audio.id}
            style={styles.audioCard}
            onPress={() => handleAudioPress(audio.id)}
          >
            <View style={styles.audioIcon}>
              <Ionicons name={getIconForType(audio.type) as any} size={32} color="#6B46C1" />
            </View>
            <View style={styles.audioContent}>
              <Text style={styles.audioTitle}>{audio.title}</Text>
              <Text style={styles.audioDescription}>{audio.description}</Text>
              <View style={styles.audioMeta}>
                <Text style={styles.audioType}>{audio.type.charAt(0).toUpperCase() + audio.type.slice(1).replace('-', ' ')}</Text>
                <Text style={styles.audioDuration}>{formatDuration(audio.duration)}</Text>
              </View>
            </View>
            <Ionicons name="play-circle" size={32} color="#6B46C1" />
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
    color: "#6B46C1",
    fontWeight: "500",
  },
  audioDuration: {
    fontSize: 12,
    color: "#999",
  },
});