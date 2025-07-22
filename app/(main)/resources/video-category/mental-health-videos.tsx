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

const mentalHealthVideos = [
  {
    id: "mh-1",
    title: "What is Mental Health?",
    description: "Understanding mental health and wellness fundamentals",
    url: "https://www.youtube.com/watch?v=DxIDKZHW3-E",
    duration: "4:25",
    channel: "WHO",
  },
  {
    id: "mh-2",
    title: "Bipolar Disorder Explained",
    description: "Understanding bipolar disorder symptoms and treatment",
    url: "https://www.youtube.com/watch?v=RGTdHdYTlvQ",
    duration: "5:45",
    channel: "Psych Hub",
  },
  {
    id: "mh-3",
    title: "PTSD: Understanding Trauma and Recovery",
    description: "Comprehensive guide to PTSD and healing",
    url: "https://www.youtube.com/watch?v=b_n9qegR7C4",
    duration: "7:30",
    channel: "TED",
  },
  {
    id: "mh-4",
    title: "OCD: Myths vs Reality",
    description: "Understanding obsessive-compulsive disorder",
    url: "https://www.youtube.com/watch?v=aX7jnVXXG5o",
    duration: "6:15",
    channel: "TED-Ed",
  },
  {
    id: "mh-5",
    title: "Mental Health Stigma: Breaking Barriers",
    description: "Addressing stigma and promoting understanding",
    url: "https://www.youtube.com/watch?v=WcuXa0eDeQs",
    duration: "8:20",
    channel: "TED",
  },
  {
    id: "mh-6",
    title: "Eating Disorders: Recognition and Support",
    description: "Understanding eating disorders and recovery",
    url: "https://www.youtube.com/watch?v=16Rd51w20zE",
    duration: "6:50",
    channel: "Mayo Clinic",
  },
  {
    id: "mh-7",
    title: "ADHD in Adults: Signs and Management",
    description: "Understanding adult ADHD and coping strategies",
    url: "https://www.youtube.com/watch?v=cx13a2-unjE",
    duration: "5:35",
    channel: "Cleveland Clinic",
  },
  {
    id: "mh-8",
    title: "Building Resilience and Mental Strength",
    description: "Developing psychological resilience and coping skills",
    url: "https://www.youtube.com/watch?v=NWH8N-BvhAw",
    duration: "9:15",
    channel: "TED",
  },
];

export default function MentalHealthVideosScreen() {
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
        <Text style={styles.headerTitle}>Mental Health Videos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Comprehensive educational videos covering various mental health conditions and wellness topics.
        </Text>

        {mentalHealthVideos.map((video) => (
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