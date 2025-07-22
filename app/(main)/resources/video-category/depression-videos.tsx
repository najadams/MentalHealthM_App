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

const depressionVideos = [
  {
    id: "dep-1",
    title: "Understanding Depression: Signs, Symptoms & Treatment",
    description: "Comprehensive overview of depression from Mayo Clinic",
    url: "https://www.youtube.com/watch?v=z-IR48Mb3W0",
    duration: "4:32",
    channel: "Mayo Clinic",
  },
  {
    id: "dep-2",
    title: "What is Depression? - Mental Health Explained",
    description: "Clear explanation of depression and its impact",
    url: "https://www.youtube.com/watch?v=XiCrniLQGYc",
    duration: "3:45",
    channel: "Psych Hub",
  },
  {
    id: "dep-3",
    title: "Depression: Causes, Symptoms, and Treatment Options",
    description: "Educational video about depression from medical professionals",
    url: "https://www.youtube.com/watch?v=eQNw2FBdpyE",
    duration: "6:12",
    channel: "Cleveland Clinic",
  },
  {
    id: "dep-4",
    title: "Living with Depression: Personal Stories and Hope",
    description: "Real experiences and recovery stories",
    url: "https://www.youtube.com/watch?v=NOAgplgTxfc",
    duration: "8:45",
    channel: "TED",
  },
  {
    id: "dep-5",
    title: "Cognitive Behavioral Therapy for Depression",
    description: "How CBT helps treat depression",
    url: "https://www.youtube.com/watch?v=0ViaCs0k2jM",
    duration: "5:23",
    channel: "Stanford Medicine",
  },
];

export default function DepressionVideosScreen() {
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
        <Text style={styles.headerTitle}>Depression Education Videos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Educational videos to help you understand depression, its symptoms, and treatment options.
        </Text>

        {depressionVideos.map((video) => (
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