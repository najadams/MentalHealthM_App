import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width } = Dimensions.get("window");

const videoData = {
  "7": {
    title: "Understanding Depression",
    description: "Educational video explaining the signs, symptoms, and treatment options for depression",
    duration: "12:45",
    category: "Educational",
    presenter: "Dr. Sarah Johnson, Clinical Psychologist",
    topics: [
      "What is depression?",
      "Common symptoms and warning signs",
      "Different types of depression",
      "Treatment options and therapies",
      "Self-care strategies",
      "When to seek professional help",
    ],
    keyPoints: [
      "Depression is a treatable medical condition",
      "Symptoms can vary from person to person",
      "Professional help is available and effective",
      "Recovery is possible with proper support",
      "Self-care plays an important role in treatment",
    ],
    // In a real app, this would be a URL to a video file
    videoUrl: null,
    thumbnail: null,
  },
  "8": {
    title: "Therapy Session Preview",
    description: "Sample cognitive behavioral therapy session demonstrating techniques for managing anxiety",
    duration: "8:30",
    category: "Therapy",
    presenter: "Licensed Therapist",
    topics: [
      "Introduction to CBT techniques",
      "Identifying negative thought patterns",
      "Challenging unhelpful thoughts",
      "Developing coping strategies",
      "Homework and practice exercises",
    ],
    keyPoints: [
      "CBT is evidence-based and effective",
      "Thoughts, feelings, and behaviors are connected",
      "You can learn to change negative patterns",
      "Practice is essential for progress",
      "Therapy provides tools for long-term wellness",
    ],
    videoUrl: null,
    thumbnail: null,
  },
};

export default function VideoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [status, setStatus] = useState({});
  
  const videoResource = videoData[id as keyof typeof videoData];
  
  const handlePlayPress = () => {
    // In a real app, this would load and play the actual video
    Alert.alert(
      "Video Simulation",
      "This is a demo. In a real app, the video would start playing here.",
      [
        {
          text: "OK",
          onPress: () => {
            console.log("Video would start playing");
          },
        },
      ]
    );
  };
  
  if (!videoResource) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Video resource not found</Text>
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
        <Text style={styles.headerTitle}>Video</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        {/* Video Player Placeholder */}
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handlePlayPress}
            >
              <Ionicons name="play" size={40} color="#fff" />
            </TouchableOpacity>
            <View style={styles.videoDuration}>
              <Text style={styles.durationText}>{videoResource.duration}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.videoInfo}>
          <Text style={styles.title}>{videoResource.title}</Text>
          <Text style={styles.description}>{videoResource.description}</Text>
          
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="person" size={16} color="#666" />
              <Text style={styles.metaText}>{videoResource.presenter}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="bookmark" size={16} color="#666" />
              <Text style={styles.metaText}>{videoResource.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.metaText}>{videoResource.duration}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topics Covered</Text>
          {videoResource.topics.map((topic, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bulletPoint} />
              <Text style={styles.listText}>{topic}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Takeaways</Text>
          {videoResource.keyPoints.map((point, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.listText}>{point}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handlePlayPress}>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Watch Video</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Ionicons name="bookmark-outline" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>Save for Later</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle" size={16} color="#FF9500" />
          <Text style={styles.disclaimerText}>
            This video is for educational purposes only and does not replace professional medical advice.
          </Text>
        </View>
      </ScrollView>
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
  },
  videoContainer: {
    width: "100%",
    height: (width * 9) / 16, // 16:9 aspect ratio
    backgroundColor: "#000",
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    position: "relative",
  },
  playButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  videoDuration: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  videoInfo: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  meta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    paddingHorizontal: 20,
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
    paddingRight: 16,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
    marginTop: 8,
    marginRight: 12,
  },
  listText: {
    fontSize: 16,
    color: "#444",
    flex: 1,
    lineHeight: 22,
    marginLeft: 4,
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#f8f8f8",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 8,
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E1",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    gap: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: "#E65100",
    flex: 1,
    lineHeight: 20,
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