// THIS FILE IS FOR A REACT NATIVE BUILD AND IS NOT USED IN THE CURRENT WEB APPLICATION.
// It is kept for reference or future native development.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import TicketIcon from '../components/icons/TicketIcon';

const TicketsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1D102B', '#4D2A7A', '#A13D63']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>
        <TicketIcon color="#8A8D91" size={60} />
        <Text style={styles.title}>My Tickets</Text>
        <Text style={styles.subtitle}>Your bus tickets will appear here.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    color: '#8A8D91',
    fontSize: 16,
    marginTop: 8,
  },
});

export default TicketsScreen;