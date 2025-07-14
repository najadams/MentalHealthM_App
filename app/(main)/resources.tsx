import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const resourceCategories = [
  {
    id: "emergency",
    title: "Emergency Support",
    icon: "alert-circle-outline",
    resources: [
      {
        id: "crisis-intervention",
        title: "Crisis Intervention",
        description: "Immediate help and emergency contacts",
        type: "emergency",
      },
      {
        id: "safety-plan",
        title: "Personal Safety Plan",
        description: "Create and manage your safety plan",
        type: "emergency",
      },
      {
        id: "coping-strategies",
        title: "Emergency Coping Strategies",
        description: "Quick techniques for crisis situations",
        type: "emergency",
      },
      {
        id: "emergency-contacts",
        title: "Emergency Contacts",
        description: "Comprehensive list of crisis support contacts",
        type: "emergency",
      },
      {
        id: "1",
        title: "National Crisis Line",
        description: "24/7 support for mental health emergencies",
        contact: "988",
        type: "phone",
      },
      {
        id: "2",
        title: "Emergency Services",
        description: "Immediate emergency assistance",
        contact: "911",
        type: "phone",
      },
    ],
  },
  {
    id: "education",
    title: "Educational Content",
    icon: "book-outline",
    resources: [
      {
        id: "3",
        title: "Understanding Anxiety",
        description: "Learn about anxiety symptoms and management",
        type: "article",
      },
      {
        id: "4",
        title: "Stress Management Guide",
        description: "Comprehensive guide to managing stress",
        type: "article",
      },
    ],
  },
  {
    id: "exercises",
    title: "Wellness Exercises",
    icon: "fitness-outline",
    resources: [
      {
        id: "5",
        title: "Guided Meditation",
        description: "5-minute mindfulness meditation",
        type: "audio",
      },
      {
        id: "6",
        title: "Breathing Exercises",
        description: "Simple breathing techniques for anxiety",
        type: "audio",
      },
    ],
  },
  {
    id: "community",
    title: "Community Support",
    icon: "people-outline",
    resources: [
      {
        id: "7",
        title: "Understanding Depression",
        description: "Educational video explaining depression",
        type: "video",
      },
      {
        id: "8",
        title: "Therapy Session Preview",
        description: "Sample CBT session for anxiety management",
        type: "video",
      },
    ],
  },
  {
    id: "helplines",
    title: "Crisis & Support Lines",
    icon: "call-outline",
    resources: [
      {
        id: "9",
        title: "National Suicide Prevention Lifeline",
        description: "24/7 crisis support and suicide prevention",
        type: "link",
      },
      {
        id: "10",
        title: "Mental Health America",
        description: "Comprehensive mental health resources",
        type: "link",
      },
      {
        id: "11",
        title: "Crisis Text Line",
        description: "Free, 24/7 crisis support via text",
        type: "link",
      },
      {
        id: "12",
        title: "NAMI Support",
        description: "Support, education, and advocacy",
        type: "link",
      },
    ],
  },
];

export default function ResourcesScreen() {
  const router = useRouter();
  const { category } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryRefs = useRef<{ [key: string]: View | null }>({});

  // Scroll to specific category if provided via URL parameter
  useEffect(() => {
    if (category && typeof category === 'string') {
      setTimeout(() => {
        const targetRef = categoryRefs.current[category];
        if (targetRef && scrollViewRef.current) {
          targetRef.measureLayout(
            scrollViewRef.current as any,
            (x, y) => {
              scrollViewRef.current?.scrollTo({ y: y - 20, animated: true });
            },
            () => {}
          );
        }
      }, 100);
    }
  }, [category]);

  const handleResourcePress = (resource: any) => {
    switch (resource.type) {
      case "phone":
        Linking.openURL(`tel:${resource.contact}`);
        break;
      case "emergency":
        router.push(`/(main)/resources/emergency/${resource.id}` as any);
        break;
      case "article":
        router.push(`/resources/article/${resource.id}`);
        break;
      case "audio":
        router.push(`/resources/audio/${resource.id}`);
        break;
      case "video":
        router.push(`/resources/video/${resource.id}`);
        break;
      case "link":
        router.push(`/resources/link/${resource.id}`);
        break;
    }
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resources</Text>
        <View style={{ width: 24 }} />
      </View>

      {resourceCategories.map((categoryItem) => (
        <View 
          key={categoryItem.id} 
          style={styles.categorySection}
          ref={(ref) => {
            categoryRefs.current[categoryItem.id] = ref;
          }}
        >
          <View style={styles.categoryHeader}>
            <Ionicons name={categoryItem.icon as any} size={24} color="#007AFF" />
            <Text style={styles.categoryTitle}>{categoryItem.title}</Text>
          </View>

          {categoryItem.resources.map((resource) => (
            <TouchableOpacity
              key={resource.id}
              style={styles.resourceCard}
              onPress={() => handleResourcePress(resource)}
            >
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>
                  {resource.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      ))}
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
  categorySection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: "#666",
  },
});