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

export default function EmergencyContactsScreen() {
  const router = useRouter();

  const handleCall = (number: string, name: string) => {
    Alert.alert(
      `Call ${name}?`,
      `This will call ${number}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${number}`) },
      ]
    );
  };

  const handleWebsite = (url: string, name: string) => {
    Alert.alert(
      `Visit ${name}?`,
      `This will open ${url}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open", onPress: () => Linking.openURL(url) },
      ]
    );
  };

  const emergencyContacts = [
    {
      category: "Immediate Emergency",
      color: "#FF3B30",
      icon: "warning" as const,
      contacts: [
        {
          name: "Emergency Services",
          number: "911",
          description: "Police, Fire, Medical emergencies",
          available: "24/7",
          type: "call" as const,
        },
        {
          name: "Crisis Text Line",
          number: "741741",
          description: "Text HOME to 741741 for crisis support",
          available: "24/7",
          type: "text" as const,
        },
      ],
    },
    {
      category: "Mental Health Crisis",
      color: "#007AFF",
      icon: "heart" as const,
      contacts: [
        {
          name: "988 Suicide & Crisis Lifeline",
          number: "988",
          description: "Free, confidential support for people in distress",
          available: "24/7",
          type: "call" as const,
        },
        {
          name: "Crisis Text Line",
          number: "741741",
          description: "Free crisis counseling via text message",
          available: "24/7",
          type: "text" as const,
        },
        {
          name: "SAMHSA National Helpline",
          number: "1-800-662-4357",
          description: "Treatment referral and information service",
          available: "24/7",
          type: "call" as const,
        },
      ],
    },
    {
      category: "Specialized Support",
      color: "#34C759",
      icon: "people" as const,
      contacts: [
        {
          name: "National Domestic Violence Hotline",
          number: "1-800-799-7233",
          description: "Support for domestic violence situations",
          available: "24/7",
          type: "call" as const,
        },
        {
          name: "RAINN National Sexual Assault Hotline",
          number: "1-800-656-4673",
          description: "Support for sexual assault survivors",
          available: "24/7",
          type: "call" as const,
        },
        {
          name: "Trans Lifeline",
          number: "877-565-8860",
          description: "Crisis support for transgender people",
          available: "24/7",
          type: "call" as const,
        },
        {
          name: "LGBT National Hotline",
          number: "1-888-843-4564",
          description: "Support for LGBTQ+ individuals",
          available: "Mon-Fri 4pm-12am, Sat 12pm-5pm EST",
          type: "call" as const,
        },
      ],
    },
    {
      category: "Online Resources",
      color: "#5856D6",
      icon: "globe" as const,
      contacts: [
        {
          name: "Crisis Text Line",
          website: "https://www.crisistextline.org",
          description: "Text-based crisis support platform",
          available: "24/7",
          type: "website" as const,
        },
        {
          name: "National Suicide Prevention Lifeline",
          website: "https://suicidepreventionlifeline.org",
          description: "Comprehensive suicide prevention resources",
          available: "24/7",
          type: "website" as const,
        },
        {
          name: "Mental Health America",
          website: "https://www.mhanational.org",
          description: "Mental health information and resources",
          available: "Always available",
          type: "website" as const,
        },
        {
          name: "NAMI (National Alliance on Mental Illness)",
          website: "https://www.nami.org",
          description: "Support, education, and advocacy",
          available: "Always available",
          type: "website" as const,
        },
      ],
    },
  ];

  const renderContact = (contact: any, categoryColor: string) => {
    const getContactIcon = () => {
      switch (contact.type) {
        case "call":
          return "call";
        case "text":
          return "chatbubble";
        case "website":
          return "globe";
        default:
          return "information-circle";
      }
    };

    const handleContactPress = () => {
      switch (contact.type) {
        case "call":
          handleCall(contact.number, contact.name);
          break;
        case "text":
          Linking.openURL(`sms:${contact.number}`);
          break;
        case "website":
          handleWebsite(contact.website, contact.name);
          break;
      }
    };

    return (
      <TouchableOpacity
        key={contact.name}
        style={[styles.contactCard, { borderLeftColor: categoryColor }]}
        onPress={handleContactPress}
      >
        <View style={[styles.contactIcon, { backgroundColor: categoryColor }]}>
          <Ionicons name={getContactIcon() as any} size={20} color="#fff" />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contact.name}</Text>
          {contact.number && (
            <Text style={styles.contactNumber}>{contact.number}</Text>
          )}
          {contact.website && (
            <Text style={styles.contactWebsite} numberOfLines={1}>
              {contact.website}
            </Text>
          )}
          <Text style={styles.contactDescription}>{contact.description}</Text>
          <Text style={styles.contactAvailable}>Available: {contact.available}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Contacts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Emergency Alert */}
        <View style={styles.alertBanner}>
          <Ionicons name="warning" size={24} color="#FF3B30" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>In Immediate Danger?</Text>
            <Text style={styles.alertText}>
              Call 911 or go to your nearest emergency room immediately
            </Text>
          </View>
        </View>

        {/* Contact Categories */}
        {emergencyContacts.map((category, index) => (
          <View key={index} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon} size={20} color="#fff" />
              </View>
              <Text style={styles.categoryTitle}>{category.category}</Text>
            </View>
            {category.contacts.map((contact) => renderContact(contact, category.color))}
          </View>
        ))}

        {/* Important Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Important Notes</Text>
          <View style={styles.noteItem}>
            <Ionicons name="information-circle" size={16} color="#007AFF" />
            <Text style={styles.noteText}>
              All crisis lines are free, confidential, and available 24/7 unless otherwise noted
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Ionicons name="shield-checkmark" size={16} color="#34C759" />
            <Text style={styles.noteText}>
              Your privacy is protected - calls are anonymous and confidential
            </Text>
          </View>
          <View style={styles.noteItem}>
            <Ionicons name="globe" size={16} color="#5856D6" />
            <Text style={styles.noteText}>
              Many services offer chat and text options if you prefer not to call
            </Text>
          </View>
        </View>

        {/* Additional Resources */}
        <View style={styles.resourcesSection}>
          <Text style={styles.resourcesTitle}>Additional Emergency Resources</Text>
          <TouchableOpacity
            style={styles.resourceButton}
            onPress={() => router.push('/resources/emergency/crisis-intervention')}
          >
            <Ionicons name="medical" size={20} color="#FF3B30" />
            <Text style={styles.resourceButtonText}>Crisis Intervention Guide</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resourceButton}
            onPress={() => router.push('/resources/emergency/safety-plan')}
          >
            <Ionicons name="document-text" size={20} color="#007AFF" />
            <Text style={styles.resourceButtonText}>Create Safety Plan</Text>
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
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: "#FF3B30",
  },
  categorySection: {
    padding: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
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
    color: "#333",
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 2,
  },
  contactWebsite: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  contactAvailable: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  notesSection: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    margin: 16,
    borderRadius: 12,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
    lineHeight: 18,
  },
  resourcesSection: {
    padding: 16,
  },
  resourcesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
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