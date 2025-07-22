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

const anxietyVideos = [
  {
    id: "anx-1",
    title: "Understanding Anxiety Disorders",
    description: "Comprehensive guide to anxiety disorders and symptoms",
    url: "https://www.youtube.com/watch?v=9mPwQTiMSAM",
    duration: "5:18",
    channel: "Mayo Clinic",
  },
  {
    id: "anx-2",
    title: "Anxiety Explained: Panic Attacks and Phobias",
    description: "Understanding different types of anxiety disorders",
    url: "https://www.youtube.com/watch?v=jryCoo0BrRk",
    duration: "4:45",
    channel: "Psych Hub",
  },
  {
    id: "anx-3",
    title: "How to Manage Anxiety: Practical Techniques",
    description: "Evidence-based strategies for managing anxiety",
    url: "https://www.youtube.com/watch?v=WWloIAQpMcQ",
    duration: "7:32",
    channel: "Therapy in a Nutshell",
  },
  {
    id: "anx-4",
    title: "Breathing Techniques for Anxiety Relief",
    description: "Simple breathing exercises to reduce anxiety",
    url: "https://www.youtube.com/watch?v=tybOi4hjZFQ",
    duration: "6:15",
    channel: "Headspace",
  },
  {
    id: "anx-5",
    title: "Social Anxiety: Understanding and Overcoming",
    description: "Specific guidance for social anxiety disorder",
    url: "https://www.youtube.com/watch?v=o268qbb_0BM",
    duration: "8:20",
    channel: "TED-Ed",
  },
  {
    id: "anx-6",
    title: "Generalized Anxiety Disorder Explained",
    description: "Understanding GAD and treatment options",
    url: "https://www.youtube.com/watch?v=HSGGlBUQUHI",
    duration: "4:55",
    channel: "Cleveland Clinic",
  },
];

export default function AnxietyVideosScreen() {
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
        <Text style={styles.headerTitle}>Anxiety Education Videos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Educational videos to help you understand anxiety disorders and learn effective management techniques.
        </Text>

        {anxietyVideos.map((video) => (
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