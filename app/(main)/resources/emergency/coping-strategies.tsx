import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CopingStrategiesScreen() {
  const router = useRouter();
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const breathingAnimation = new Animated.Value(1);

  const startBreathingExercise = () => {
    setBreathingActive(true);
    breathingCycle();
  };

  const stopBreathingExercise = () => {
    setBreathingActive(false);
    breathingAnimation.stopAnimation();
    breathingAnimation.setValue(1);
    setBreathingPhase('inhale');
  };

  const breathingCycle = () => {
    if (!breathingActive) return;

    // Inhale (4 seconds)
    setBreathingPhase('inhale');
    Animated.timing(breathingAnimation, {
      toValue: 1.5,
      duration: 4000,
      useNativeDriver: true,
    }).start(() => {
      if (!breathingActive) return;
      
      // Hold (4 seconds)
      setBreathingPhase('hold');
      setTimeout(() => {
        if (!breathingActive) return;
        
        // Exhale (4 seconds)
        setBreathingPhase('exhale');
        Animated.timing(breathingAnimation, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }).start(() => {
          if (breathingActive) {
            setTimeout(() => breathingCycle(), 500);
          }
        });
      }, 4000);
    });
  };

  const immediateStrategies = [
    {
      id: 'breathing',
      title: '4-7-8 Breathing',
      description: 'Calm your nervous system with controlled breathing',
      icon: 'leaf' as const,
      color: '#34C759',
      interactive: true,
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      description: 'Use your senses to stay present',
      icon: 'eye' as const,
      color: '#007AFF',
      steps: [
        '5 things you can see',
        '4 things you can touch',
        '3 things you can hear',
        '2 things you can smell',
        '1 thing you can taste'
      ]
    },
    {
      id: 'cold-water',
      title: 'Cold Water Technique',
      description: 'Reset your nervous system quickly',
      icon: 'water' as const,
      color: '#5AC8FA',
      steps: [
        'Splash cold water on your face',
        'Hold ice cubes in your hands',
        'Take a cold shower',
        'Drink cold water slowly'
      ]
    },
    {
      id: 'movement',
      title: 'Physical Movement',
      description: 'Release tension and stress through movement',
      icon: 'walk' as const,
      color: '#FF9500',
      steps: [
        'Take 10 deep breaths while walking',
        'Do jumping jacks for 30 seconds',
        'Stretch your arms and shoulders',
        'Dance to your favorite song'
      ]
    }
  ];

  const longTermStrategies = [
    {
      title: 'Mindfulness & Meditation',
      icon: 'flower' as const,
      color: '#AF52DE',
      techniques: [
        'Daily 10-minute meditation',
        'Body scan relaxation',
        'Mindful walking',
        'Progressive muscle relaxation'
      ]
    },
    {
      title: 'Creative Expression',
      icon: 'brush' as const,
      color: '#FF2D92',
      techniques: [
        'Journaling thoughts and feelings',
        'Drawing or painting',
        'Playing music',
        'Creative writing'
      ]
    },
    {
      title: 'Social Connection',
      icon: 'people' as const,
      color: '#32D74B',
      techniques: [
        'Call a trusted friend',
        'Join support groups',
        'Volunteer for causes you care about',
        'Spend time with pets'
      ]
    },
    {
      title: 'Physical Wellness',
      icon: 'fitness' as const,
      color: '#FF6B35',
      techniques: [
        'Regular exercise routine',
        'Healthy sleep schedule',
        'Nutritious meals',
        'Limit caffeine and alcohol'
      ]
    }
  ];

  const renderImmediateStrategy = (strategy: typeof immediateStrategies[0]) => {
    const isActive = activeStrategy === strategy.id;
    
    return (
      <View key={strategy.id} style={styles.strategyCard}>
        <TouchableOpacity
          style={[styles.strategyHeader, { borderLeftColor: strategy.color }]}
          onPress={() => setActiveStrategy(isActive ? null : strategy.id)}
        >
          <View style={[styles.strategyIcon, { backgroundColor: strategy.color }]}>
            <Ionicons name={strategy.icon} size={24} color="#fff" />
          </View>
          <View style={styles.strategyInfo}>
            <Text style={styles.strategyTitle}>{strategy.title}</Text>
            <Text style={styles.strategyDescription}>{strategy.description}</Text>
          </View>
          <Ionicons 
            name={isActive ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        
        {isActive && (
          <View style={styles.strategyContent}>
            {strategy.id === 'breathing' ? (
              <View style={styles.breathingExercise}>
                <View style={styles.breathingContainer}>
                  <Animated.View
                    style={[
                      styles.breathingCircle,
                      {
                        transform: [{ scale: breathingAnimation }],
                        backgroundColor: strategy.color,
                      }
                    ]}
                  />
                  <Text style={styles.breathingPhaseText}>
                    {breathingPhase === 'inhale' && 'Breathe In'}
                    {breathingPhase === 'hold' && 'Hold'}
                    {breathingPhase === 'exhale' && 'Breathe Out'}
                  </Text>
                </View>
                <View style={styles.breathingControls}>
                  {!breathingActive ? (
                    <TouchableOpacity
                      style={[styles.breathingButton, { backgroundColor: strategy.color }]}
                      onPress={startBreathingExercise}
                    >
                      <Ionicons name="play" size={20} color="#fff" />
                      <Text style={styles.breathingButtonText}>Start Exercise</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.breathingButton, { backgroundColor: '#FF3B30' }]}
                      onPress={stopBreathingExercise}
                    >
                      <Ionicons name="stop" size={20} color="#fff" />
                      <Text style={styles.breathingButtonText}>Stop</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={styles.breathingInstructions}>
                  Follow the circle: Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
                </Text>
              </View>
            ) : (
              <View style={styles.stepsList}>
                {strategy.steps?.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={[styles.stepNumber, { backgroundColor: strategy.color }]}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderLongTermStrategy = (strategy: typeof longTermStrategies[0], index: number) => (
    <View key={index} style={styles.longTermCard}>
      <View style={styles.longTermHeader}>
        <View style={[styles.longTermIcon, { backgroundColor: strategy.color }]}>
          <Ionicons name={strategy.icon} size={20} color="#fff" />
        </View>
        <Text style={styles.longTermTitle}>{strategy.title}</Text>
      </View>
      <View style={styles.techniquesList}>
        {strategy.techniques.map((technique, techIndex) => (
          <View key={techIndex} style={styles.techniqueItem}>
            <View style={styles.techniqueBullet} />
            <Text style={styles.techniqueText}>{technique}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coping Strategies</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Emergency Banner */}
        <View style={styles.emergencyBanner}>
          <Ionicons name="warning" size={20} color="#FF3B30" />
          <Text style={styles.emergencyText}>
            If you're in immediate crisis, use these strategies while seeking professional help
          </Text>
        </View>

        {/* Immediate Strategies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Immediate Relief Strategies</Text>
          <Text style={styles.sectionSubtitle}>
            Quick techniques to use when you're feeling overwhelmed
          </Text>
          {immediateStrategies.map(renderImmediateStrategy)}
        </View>

        {/* Long-term Strategies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Long-term Wellness Strategies</Text>
          <Text style={styles.sectionSubtitle}>
            Build resilience and maintain mental health over time
          </Text>
          {longTermStrategies.map(renderLongTermStrategy)}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <TouchableOpacity
            style={styles.resourceButton}
            onPress={() => router.push('/resources/emergency/crisis-intervention')}
          >
            <Ionicons name="call" size={20} color="#FF3B30" />
            <Text style={styles.resourceButtonText}>Crisis Intervention</Text>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.resourceButton}
            onPress={() => router.push('/resources/emergency/safety-plan')}
          >
            <Ionicons name="document-text" size={20} color="#007AFF" />
            <Text style={styles.resourceButtonText}>Personal Safety Plan</Text>
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
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF2F2",
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF3B30",
  },
  emergencyText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
    color: "#FF3B30",
    fontWeight: "500",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  strategyCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  strategyHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderLeftWidth: 4,
  },
  strategyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  strategyInfo: {
    flex: 1,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  strategyDescription: {
    fontSize: 14,
    color: "#666",
  },
  strategyContent: {
    padding: 16,
    paddingTop: 0,
  },
  breathingExercise: {
    alignItems: "center",
  },
  breathingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  breathingCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  breathingPhaseText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  breathingControls: {
    marginBottom: 16,
  },
  breathingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  breathingButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  breathingInstructions: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
  stepsList: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  longTermCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  longTermHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  longTermIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  longTermTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  techniquesList: {
    marginLeft: 8,
  },
  techniqueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  techniqueBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#666",
    marginRight: 12,
  },
  techniqueText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
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