import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const sleepVideos = [
  {
    id: "sleep-1",
    title: "Understanding Insomnia: Causes and Solutions",
    description: "Comprehensive guide to sleep disorders and insomnia",
    url: "https://www.youtube.com/watch?v=nm1TxQj9IsQ",
    duration: "6:45",
    channel: "Mayo Clinic",
  },
  {
    id: "sleep-2",
    title: "Sleep Hygiene: How to Sleep Better",
    description: "Evidence-based tips for improving sleep quality",
    url: "https://www.youtube.com/watch?v=t0kACis_dJE",
    duration: "5:32",
    channel: "Stanford Medicine",
  },
  {
    id: "sleep-3",
    title: "The Science of Sleep and Dreams",
    description: "Understanding sleep cycles and their importance",
    url: "https://www.youtube.com/watch?v=5MuIMqhT8DM",
    duration: "8:15",
    channel: "TED-Ed",
  },
  {
    id: "sleep-4",
    title: "Cognitive Behavioral Therapy for Insomnia (CBT-I)",
    description: "How CBT-I helps treat chronic insomnia",
    url: "https://www.youtube.com/watch?v=8BuUbASP1rA",
    duration: "7:20",
    channel: "Cleveland Clinic",
  },
  {
    id: "sleep-5",
    title: "Sleep Anxiety: Breaking the Cycle",
    description: "Managing anxiety that interferes with sleep",
    url: "https://www.youtube.com/watch?v=A5dE25ANU0k",
    duration: "6:55",
    channel: "Therapy in a Nutshell",
  },
  {
    id: "sleep-6",
    title: "Progressive Muscle Relaxation for Sleep",
    description: "Relaxation techniques to improve sleep quality",
    url: "https://www.youtube.com/watch?v=1nJNgNqJMjI",
    duration: "4:40",
    channel: "Headspace",
  },
];

export default function SleepVideosScreen() {
  const router = useRouter();

  const handleVideoPress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep & Insomnia Videos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Educational videos about sleep disorders, insomnia, and techniques for better sleep quality.
        </Text>

        {sleepVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            style={styles.videoCard}
            onPress={() => handleVideoPress(video.url)}
          >
            <View style={styles.videoIcon}>
              <Ionicons name="play-circle" size={40} color="#FF0000" />
            </View>
            <View style={styles.videoContent}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDescription}>{video.description}</Text>
              <View style={styles.videoMeta}>
                <Text style={styles.videoChannel}>{video.channel}</Text>
                <Text style={styles.videoDuration}>{video.duration}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
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
  videoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  videoIcon: {
    marginRight: 12,
  },
  videoContent: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  videoChannel: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
  videoDuration: {
    fontSize: 12,
    color: "#999",
  },
});