import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CrisisInterventionScreen() {
  const router = useRouter();

  const handleEmergencyCall = (number: string, service: string) => {
    Alert.alert(
      `Call ${service}?`,
      `This will call ${number}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  const emergencyContacts = [
    {
      name: "Emergency Services",
      number: "911",
      description: "Immediate emergency assistance",
      icon: "call" as const,
      color: "#FF3B30",
    },
    {
      name: "National Crisis Line",
      number: "988",
      description: "24/7 suicide & crisis lifeline",
      icon: "heart" as const,
      color: "#007AFF",
    },
    {
      name: "Crisis Text Line",
      number: "741741",
      description: "Text HOME to 741741",
      icon: "chatbubble" as const,
      color: "#34C759",
    },
  ];

  const immediateSteps = [
    {
      step: 1,
      title: "Ensure Immediate Safety",
      description: "Remove any means of self-harm from your immediate environment",
      icon: "shield-checkmark" as const,
    },
    {
      step: 2,
      title: "Reach Out for Help",
      description: "Call emergency services, crisis line, or trusted person immediately",
      icon: "call" as const,
    },
    {
      step: 3,
      title: "Stay Connected",
      description: "Don't isolate yourself. Stay with someone or in a safe public place",
      icon: "people" as const,
    },
    {
      step: 4,
      title: "Use Coping Strategies",
      description: "Practice grounding techniques, deep breathing, or other coping skills",
      icon: "leaf" as const,
    },
  ];

  const warningSignsContent = `
# Crisis Warning Signs

## Immediate Danger Signs
• Thoughts of suicide or self-harm
• Detailed suicide plan
• Access to means of self-harm
• Feeling trapped or hopeless
• Extreme mood changes
• Withdrawal from family and friends
• Giving away possessions
• Saying goodbye to loved ones

## Emotional Warning Signs
• Overwhelming feelings of sadness
• Intense anxiety or panic
• Feeling like a burden to others
• Loss of interest in activities
• Feeling emotionally numb
• Extreme guilt or shame
• Feeling worthless or helpless

## Behavioral Warning Signs
• Increased substance use
• Reckless behavior
• Sleeping too much or too little
• Eating too much or too little
• Neglecting personal care
• Isolating from others
• Difficulty concentrating

## Physical Warning Signs
• Unexplained aches and pains
• Fatigue or loss of energy
• Significant weight changes
• Frequent illness
• Changes in appetite
• Sleep disturbances
  `;

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return (
          <Text key={index} style={styles.heading1}>
            {line.substring(2)}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        return (
          <Text key={index} style={styles.heading2}>
            {line.substring(3)}
          </Text>
        );
      } else if (line.startsWith('• ')) {
        return (
          <Text key={index} style={styles.bulletPoint}>
            {line}
          </Text>
        );
      } else if (line.trim() === '') {
        return <View key={index} style={styles.spacing} />;
      } else {
        return (
          <Text key={index} style={styles.paragraph}>
            {line}
          </Text>
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crisis Intervention</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Emergency Alert Banner */}
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={24} color="#FF3B30" />
          <Text style={styles.alertText}>
            If you're in immediate danger, call 911 or go to your nearest emergency room
          </Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.contactCard, { borderLeftColor: contact.color }]}
              onPress={() => handleEmergencyCall(contact.number, contact.name)}
            >
              <View style={[styles.contactIcon, { backgroundColor: contact.color }]}>
                <Ionicons name={contact.icon} size={20} color="#fff" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
              </View>
              <Ionicons name="call" size={20} color={contact.color} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Immediate Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Immediate Steps to Take</Text>
          {immediateSteps.map((item, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{item.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <Ionicons name={item.icon} size={20} color="#007AFF" />
                  <Text style={styles.stepTitle}>{item.title}</Text>
                </View>
                <Text style={styles.stepDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Warning Signs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recognizing Crisis Warning Signs</Text>
          <View style={styles.warningSignsContent}>
            {formatContent(warningSignsContent)}
          </View>
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <TouchableOpacity
            style={styles.resourceButton}
            onPress={() => router.push('/resources/emergency/safety-plan')}
          >
            <Ionicons name="document-text" size={20} color="#007AFF" />
            <Text style={styles.resourceButtonText}>Create Safety Plan</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resourceButton}
            onPress={() => router.push('/resources/emergency/coping-strategies')}
          >
            <Ionicons name="heart" size={20} color="#007AFF" />
            <Text style={styles.resourceButtonText}>Emergency Coping Strategies</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
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
  alertBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF2F2",
    padding: 16,
    margin: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#FF3B30",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#333",
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  warningSignsContent: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
  },
  heading1: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#333",
  },
  heading2: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
    color: "#333",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 2,
    color: "#444",
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 1,
    marginLeft: 12,
    color: "#444",
  },
  spacing: {
    height: 8,
  },
  resourceButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  resourceButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
});