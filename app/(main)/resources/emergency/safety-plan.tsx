import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SafetyPlanData {
  warningSignsPersonal: string;
  warningSignsEnvironmental: string;
  copingStrategies: string;
  supportContacts: string;
  professionalContacts: string;
  environmentSafety: string;
  reasonsToLive: string;
}

export default function SafetyPlanScreen() {
  const router = useRouter();
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlanData>({
    warningSignsPersonal: "",
    warningSignsEnvironmental: "",
    copingStrategies: "",
    supportContacts: "",
    professionalContacts: "",
    environmentSafety: "",
    reasonsToLive: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    loadSafetyPlan();
  }, []);

  const loadSafetyPlan = async () => {
    try {
      const savedPlan = await AsyncStorage.getItem("safetyPlan");
      if (savedPlan) {
        setSafetyPlan(JSON.parse(savedPlan));
      }
    } catch (error) {
      console.error("Error loading safety plan:", error);
    }
  };

  const saveSafetyPlan = async () => {
    try {
      await AsyncStorage.setItem("safetyPlan", JSON.stringify(safetyPlan));
      setIsEditing(false);
      Alert.alert("Success", "Your safety plan has been saved.");
    } catch (error) {
      console.error("Error saving safety plan:", error);
      Alert.alert("Error", "Failed to save your safety plan. Please try again.");
    }
  };

  const updateField = (field: keyof SafetyPlanData, value: string) => {
    setSafetyPlan(prev => ({ ...prev, [field]: value }));
  };

  const safetyPlanSections = [
    {
      id: "warningSignsPersonal",
      title: "1. Personal Warning Signs",
      description: "Thoughts, feelings, or behaviors that indicate a crisis may be developing",
      placeholder: "e.g., feeling hopeless, withdrawing from friends, trouble sleeping...",
      icon: "person" as const,
      color: "#FF9500",
    },
    {
      id: "warningSignsEnvironmental",
      title: "2. Environmental Warning Signs",
      description: "Situations, people, or places that might trigger a crisis",
      placeholder: "e.g., being alone, certain locations, stressful events...",
      icon: "location" as const,
      color: "#FF9500",
    },
    {
      id: "copingStrategies",
      title: "3. Coping Strategies",
      description: "Things you can do on your own to help yourself feel better",
      placeholder: "e.g., deep breathing, listening to music, taking a walk, calling a friend...",
      icon: "heart" as const,
      color: "#34C759",
    },
    {
      id: "supportContacts",
      title: "4. Support People",
      description: "Friends, family, or others who can provide support and distraction",
      placeholder: "Name and phone number of trusted people you can contact...",
      icon: "people" as const,
      color: "#007AFF",
    },
    {
      id: "professionalContacts",
      title: "5. Professional Contacts",
      description: "Mental health professionals, crisis lines, or emergency services",
      placeholder: "Therapist, doctor, crisis hotline numbers...",
      icon: "medical" as const,
      color: "#5856D6",
    },
    {
      id: "environmentSafety",
      title: "6. Making Environment Safe",
      description: "Steps to remove or limit access to means of self-harm",
      placeholder: "e.g., remove harmful objects, ask someone to hold medications...",
      icon: "shield-checkmark" as const,
      color: "#FF3B30",
    },
    {
      id: "reasonsToLive",
      title: "7. Reasons for Living",
      description: "Things that are important to you and give your life meaning",
      placeholder: "e.g., family, pets, goals, values, future plans...",
      icon: "star" as const,
      color: "#AF52DE",
    },
  ];

  const renderSection = (section: typeof safetyPlanSections[0]) => {
    const value = safetyPlan[section.id as keyof SafetyPlanData];
    
    return (
      <View key={section.id} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={[styles.sectionIcon, { backgroundColor: section.color }]}>
            <Ionicons name={section.icon} size={20} color="#fff" />
          </View>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionDescription}>{section.description}</Text>
          </View>
        </View>
        
        {isEditing ? (
          <TextInput
            style={styles.textInput}
            value={value}
            onChangeText={(text) => updateField(section.id as keyof SafetyPlanData, text)}
            placeholder={section.placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        ) : (
          <View style={styles.contentContainer}>
            {value ? (
              <Text style={styles.contentText}>{value}</Text>
            ) : (
              <Text style={styles.placeholderText}>
                Tap "Edit" to add your {section.title.toLowerCase()}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Plan</Text>
        <TouchableOpacity
          onPress={isEditing ? saveSafetyPlan : () => setIsEditing(true)}
          style={styles.editButton}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Introduction */}
        <View style={styles.introSection}>
          <View style={styles.introHeader}>
            <Ionicons name="document-text" size={24} color="#007AFF" />
            <Text style={styles.introTitle}>Personal Safety Plan</Text>
          </View>
          <Text style={styles.introText}>
            A safety plan is a personalized, practical plan that can help you avoid dangerous situations and know how to react when you're having thoughts of suicide or self-harm.
          </Text>
          {!isEditing && (
            <View style={styles.tipBox}>
              <Ionicons name="bulb" size={16} color="#FF9500" />
              <Text style={styles.tipText}>
                Tip: Review and update your safety plan regularly to keep it current and effective.
              </Text>
            </View>
          )}
        </View>

        {/* Safety Plan Sections */}
        {safetyPlanSections.map(renderSection)}

        {/* Emergency Contacts Quick Access */}
        {!isEditing && (
          <View style={styles.emergencySection}>
            <Text style={styles.emergencyTitle}>Quick Emergency Access</Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => router.push('/resources/emergency/crisis-intervention')}
            >
              <Ionicons name="call" size={20} color="#fff" />
              <Text style={styles.emergencyButtonText}>Crisis Intervention</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.emergencyButton, { backgroundColor: "#34C759" }]}
              onPress={() => router.push('/resources/emergency/coping-strategies')}
            >
              <Ionicons name="heart" size={20} color="#fff" />
              <Text style={styles.emergencyButtonText}>Coping Strategies</Text>
            </TouchableOpacity>
          </View>
        )}

        {isEditing && (
          <View style={styles.editingFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(false);
                loadSafetyPlan(); // Reset to saved data
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
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
  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  introSection: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    margin: 16,
    borderRadius: 12,
  },
  introHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  introTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
    marginBottom: 12,
  },
  tipBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF9E6",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FF9500",
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: "#8B7000",
    marginLeft: 8,
    lineHeight: 16,
  },
  sectionContainer: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    minHeight: 60,
    justifyContent: "center",
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  placeholderText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  emergencySection: {
    padding: 16,
    margin: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  emergencyButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  editingFooter: {
    padding: 16,
    alignItems: "center",
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
});