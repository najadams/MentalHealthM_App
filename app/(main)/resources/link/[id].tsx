import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const linkData = {
  "9": {
    title: "National Suicide Prevention Lifeline",
    description: "24/7 crisis support and suicide prevention hotline",
    url: "https://suicidepreventionlifeline.org",
    phone: "988",
    category: "Crisis Support",
    availability: "24/7",
    languages: ["English", "Spanish"],
    services: [
      "Crisis counseling and support",
      "Suicide prevention",
      "Emotional support",
      "Resource referrals",
      "Follow-up support",
    ],
    features: [
      "Confidential and free",
      "Available 24/7",
      "Trained crisis counselors",
      "Text and chat options available",
      "Local resource connections",
    ],
    alternativeContacts: [
      {
        method: "Text",
        contact: "Text HOME to 741741",
        description: "Crisis Text Line",
      },
      {
        method: "Chat",
        contact: "suicidepreventionlifeline.org/chat",
        description: "Online chat support",
      },
    ],
  },
  "10": {
    title: "Mental Health America",
    description: "Comprehensive mental health resources and screening tools",
    url: "https://www.mhanational.org",
    phone: null,
    category: "Educational Resources",
    availability: "Online 24/7",
    languages: ["English", "Spanish"],
    services: [
      "Mental health screening tools",
      "Educational resources",
      "Treatment locator",
      "Advocacy and support",
      "Community programs",
    ],
    features: [
      "Free mental health screenings",
      "Evidence-based information",
      "Treatment finder tool",
      "Educational materials",
      "Community support programs",
    ],
    alternativeContacts: [],
  },
  "11": {
    title: "Crisis Text Line",
    description: "Free, 24/7 crisis support via text message",
    url: "https://www.crisistextline.org",
    phone: null,
    category: "Crisis Support",
    availability: "24/7",
    languages: ["English", "Spanish"],
    services: [
      "Crisis intervention via text",
      "Emotional support",
      "De-escalation techniques",
      "Safety planning",
      "Resource connections",
    ],
    features: [
      "Text-based support",
      "Trained crisis counselors",
      "Confidential and free",
      "Quick response time",
      "Available nationwide",
    ],
    alternativeContacts: [
      {
        method: "Text",
        contact: "Text HOME to 741741",
        description: "Main crisis text line",
      },
    ],
  },
  "12": {
    title: "NAMI (National Alliance on Mental Illness)",
    description: "Support, education, and advocacy for mental health",
    url: "https://www.nami.org",
    phone: "1-800-950-NAMI (6264)",
    category: "Support & Education",
    availability: "Helpline: Mon-Fri 10am-10pm ET",
    languages: ["English", "Spanish"],
    services: [
      "Mental health information",
      "Support groups",
      "Educational programs",
      "Advocacy resources",
      "Family support",
    ],
    features: [
      "Peer support programs",
      "Educational workshops",
      "Family-to-family programs",
      "Local chapter connections",
      "Advocacy training",
    ],
    alternativeContacts: [
      {
        method: "Email",
        contact: "info@nami.org",
        description: "General inquiries",
      },
    ],
  },
};

export default function LinkScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const linkResource = linkData[id as keyof typeof linkData];
  
  const handleOpenLink = async () => {
    if (!linkResource.url) return;
    
    try {
      setIsLoading(true);
      const supported = await Linking.canOpenURL(linkResource.url);
      
      if (supported) {
        await Linking.openURL(linkResource.url);
      } else {
        Alert.alert(
          "Cannot Open Link",
          "Unable to open this link on your device."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while trying to open the link."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePhoneCall = async () => {
    if (!linkResource.phone) return;
    
    try {
      const phoneUrl = `tel:${linkResource.phone}`;
      const supported = await Linking.canOpenURL(phoneUrl);
      
      if (supported) {
        Alert.alert(
          "Call " + linkResource.phone,
          "Are you sure you want to call this number?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Call",
              onPress: () => Linking.openURL(phoneUrl),
            },
          ]
        );
      } else {
        Alert.alert(
          "Cannot Make Call",
          "Unable to make phone calls on this device."
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred while trying to make the call."
      );
    }
  };
  
  const handleAlternativeContact = async (contact: any) => {
    if (contact.method === "Text") {
      Alert.alert(
        "Text Instructions",
        contact.contact,
        [
          { text: "OK" }
        ]
      );
    } else if (contact.method === "Email") {
      const emailUrl = `mailto:${contact.contact}`;
      try {
        const supported = await Linking.canOpenURL(emailUrl);
        if (supported) {
          await Linking.openURL(emailUrl);
        } else {
          Alert.alert(
            "Cannot Open Email",
            "Unable to open email on this device."
          );
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while trying to open email.");
      }
    } else if (contact.method === "Chat") {
      try {
        const chatUrl = `https://${contact.contact}`;
        const supported = await Linking.canOpenURL(chatUrl);
        if (supported) {
          await Linking.openURL(chatUrl);
        } else {
          Alert.alert(
            "Cannot Open Chat",
            "Unable to open chat on this device."
          );
        }
      } catch (error) {
        Alert.alert("Error", "An error occurred while trying to open chat.");
      }
    }
  };
  
  if (!linkResource) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Resource</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Resource not found</Text>
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
        <Text style={styles.headerTitle}>Resource</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.resourceHeader}>
          <Text style={styles.title}>{linkResource.title}</Text>
          <Text style={styles.description}>{linkResource.description}</Text>
          
          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="bookmark" size={16} color="#666" />
              <Text style={styles.metaText}>{linkResource.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time" size={16} color="#666" />
              <Text style={styles.metaText}>{linkResource.availability}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="language" size={16} color="#666" />
              <Text style={styles.metaText}>{linkResource.languages.join(", ")}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          {linkResource.url && (
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleOpenLink}
              disabled={isLoading}
            >
              <Ionicons name="globe" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Opening..." : "Visit Website"}
              </Text>
            </TouchableOpacity>
          )}
          
          {linkResource.phone && (
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={handlePhoneCall}
            >
              <Ionicons name="call" size={20} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>
                Call {linkResource.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {linkResource.alternativeContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alternative Contact Methods</Text>
            {linkResource.alternativeContacts.map((contact, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.contactItem}
                onPress={() => handleAlternativeContact(contact)}
              >
                <View style={styles.contactInfo}>
                  <Text style={styles.contactMethod}>{contact.method}</Text>
                  <Text style={styles.contactDescription}>{contact.description}</Text>
                  <Text style={styles.contactDetail}>{contact.contact}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#007AFF" />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services Provided</Text>
          {linkResource.services.map((service, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.listText}>{service}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {linkResource.features.map((feature, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="star" size={16} color="#FF9500" />
              <Text style={styles.listText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        {linkResource.category === "Crisis Support" && (
          <View style={styles.emergencyNotice}>
            <Ionicons name="warning" size={20} color="#FF3B30" />
            <View style={styles.emergencyText}>
              <Text style={styles.emergencyTitle}>Emergency Notice</Text>
              <Text style={styles.emergencyDescription}>
                If you are in immediate danger, please call 911 or go to your nearest emergency room.
              </Text>
            </View>
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
  content: {
    flex: 1,
  },
  resourceHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
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
  actionButtons: {
    padding: 20,
    gap: 12,
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
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactInfo: {
    flex: 1,
  },
  contactMethod: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listText: {
    fontSize: 16,
    color: "#444",
    flex: 1,
    lineHeight: 22,
    marginLeft: 8,
  },
  emergencyNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFEBEE",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
    gap: 12,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#D32F2F",
    marginBottom: 4,
  },
  emergencyDescription: {
    fontSize: 14,
    color: "#B71C1C",
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