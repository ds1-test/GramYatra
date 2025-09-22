// THIS FILE IS FOR A REACT NATIVE BUILD AND IS NOT USED IN THE CURRENT WEB APPLICATION.
// It is kept for reference or future native development. A separate FeatureCard component exists for the web app.

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface FeatureCardProps {
  title: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon }) => {
  return (
    <Pressable>
      {({ pressed }) => (
        <View style={[styles.container, pressed && styles.pressed]}>
          <LinearGradient
            colors={['rgba(0, 212, 255, 0.5)', 'rgba(255, 77, 166, 0.5)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.cardInner}>
              <View style={styles.iconContainer}>{icon}</View>
              <Text style={styles.title}>{title}</Text>
            </View>
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 110,
    borderRadius: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 1,
    flex: 1,
  },
  cardInner: {
    flex: 1,
    backgroundColor: 'rgba(26, 29, 35, 0.8)', // Glassmorphism effect
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FeatureCard;