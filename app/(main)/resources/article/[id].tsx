import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const articleData = {
  "3": {
    title: "Understanding Anxiety",
    content: `
# Understanding Anxiety

Anxiety is a normal and often healthy emotion. However, when a person regularly feels disproportionate levels of anxiety, it might become a medical disorder.

## What is Anxiety?

Anxiety disorders form a category of mental health diagnoses that lead to excessive nervousness, fear, apprehension, and worry. These disorders alter how a person processes emotions and behave, also causing physical symptoms.

## Common Symptoms

### Physical Symptoms:
• Rapid heartbeat
• Sweating
• Trembling or shaking
• Shortness of breath
• Muscle tension
• Fatigue

### Emotional Symptoms:
• Excessive worry
• Restlessness
• Irritability
• Difficulty concentrating
• Sleep problems
• Feeling overwhelmed

## Types of Anxiety Disorders

### Generalized Anxiety Disorder (GAD)
Persistent and excessive worry about various aspects of life.

### Panic Disorder
Recurrent panic attacks and fear of future attacks.

### Social Anxiety Disorder
Intense fear of social situations and being judged by others.

### Specific Phobias
Intense fear of specific objects or situations.

## Management Strategies

### 1. Deep Breathing
Practice slow, deep breathing to activate your body's relaxation response.

### 2. Progressive Muscle Relaxation
Tense and then relax different muscle groups to reduce physical tension.

### 3. Mindfulness and Meditation
Stay present and observe thoughts without judgment.

### 4. Regular Exercise
Physical activity can reduce anxiety symptoms and improve mood.

### 5. Healthy Sleep Habits
Maintain a consistent sleep schedule and create a relaxing bedtime routine.

### 6. Limit Caffeine and Alcohol
These substances can worsen anxiety symptoms.

## When to Seek Professional Help

Consider seeking help if:
• Anxiety interferes with daily activities
• You avoid situations due to anxiety
• Physical symptoms are severe
• You have thoughts of self-harm

## Treatment Options

### Therapy
• Cognitive Behavioral Therapy (CBT)
• Exposure Therapy
• Acceptance and Commitment Therapy (ACT)

### Medication
• Antidepressants
• Anti-anxiety medications
• Beta-blockers (for physical symptoms)

### Lifestyle Changes
• Regular exercise
• Stress management
• Social support
• Relaxation techniques

## Remember

Anxiety is treatable, and with the right support and strategies, you can learn to manage your symptoms effectively. Don't hesitate to reach out for professional help when needed.
    `,
    readTime: "8 min read",
    category: "Mental Health",
  },
  "4": {
    title: "Stress Management Guide",
    content: `
# Comprehensive Stress Management Guide

Stress is a natural response to challenging situations, but chronic stress can negatively impact your physical and mental health.

## Understanding Stress

Stress is your body's way of responding to any kind of demand or threat. When you sense danger, your body's defenses kick into high gear in a rapid, automatic process known as the "fight-or-flight" reaction.

## Types of Stress

### Acute Stress
Short-term stress that comes from recent events or anticipated challenges.

### Chronic Stress
Long-term stress that persists over extended periods.

### Episodic Acute Stress
Frequent episodes of acute stress.

## Common Stress Triggers

• Work pressure
• Financial problems
• Relationship issues
• Health concerns
• Major life changes
• Daily hassles
• Traumatic events

## Physical Signs of Stress

• Headaches
• Muscle tension
• Fatigue
• Sleep problems
• Digestive issues
• Frequent illness
• Changes in appetite

## Emotional Signs of Stress

• Anxiety
• Irritability
• Depression
• Mood swings
• Feeling overwhelmed
• Low motivation
• Restlessness

## Effective Stress Management Techniques

### 1. Time Management
• Prioritize tasks
• Set realistic goals
• Break large tasks into smaller ones
• Learn to say no
• Delegate when possible

### 2. Relaxation Techniques
• Deep breathing exercises
• Progressive muscle relaxation
• Meditation
• Yoga
• Tai chi

### 3. Physical Activity
• Regular exercise
• Walking
• Swimming
• Dancing
• Sports

### 4. Healthy Lifestyle
• Balanced diet
• Adequate sleep
• Limit caffeine and alcohol
• Stay hydrated
• Avoid smoking

### 5. Social Support
• Talk to friends and family
• Join support groups
• Seek professional help
• Maintain social connections

### 6. Cognitive Strategies
• Challenge negative thoughts
• Practice positive self-talk
• Focus on what you can control
• Maintain perspective
• Practice gratitude

## Building Resilience

### Develop Coping Skills
• Problem-solving abilities
• Emotional regulation
• Adaptability
• Optimism

### Maintain Balance
• Work-life balance
• Regular breaks
• Hobbies and interests
• Self-care activities

## When to Seek Professional Help

Consider professional help if:
• Stress interferes with daily functioning
• You feel overwhelmed most of the time
• You're using unhealthy coping mechanisms
• Physical symptoms persist
• You have thoughts of self-harm

## Professional Resources

• Therapists and counselors
• Support groups
• Employee assistance programs
• Mental health apps
• Stress management workshops

## Creating Your Stress Management Plan

1. Identify your stress triggers
2. Choose appropriate coping strategies
3. Practice regularly
4. Monitor your progress
5. Adjust as needed

## Remember

Stress management is a skill that improves with practice. Be patient with yourself and celebrate small victories along the way.
    `,
    readTime: "12 min read",
    category: "Wellness",
  },
};

export default function ArticleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const article = articleData[id as keyof typeof articleData];
  
  if (!article) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Article not found</Text>
        </View>
      </View>
    );
  }

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
      } else if (line.startsWith('### ')) {
        return (
          <Text key={index} style={styles.heading3}>
            {line.substring(4)}
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
        <Text style={styles.headerTitle}>Article</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.articleHeader}>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.meta}>
            <Text style={styles.category}>{article.category}</Text>
            <Text style={styles.readTime}>{article.readTime}</Text>
          </View>
        </View>
        
        <View style={styles.articleContent}>
          {formatContent(article.content)}
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
  articleHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  category: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  readTime: {
    fontSize: 14,
    color: "#666",
  },
  articleContent: {
    padding: 20,
  },
  heading1: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 14,
    color: "#333",
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 12,
    color: "#333",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 4,
    color: "#444",
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 2,
    marginLeft: 16,
    color: "#444",
  },
  spacing: {
    height: 12,
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