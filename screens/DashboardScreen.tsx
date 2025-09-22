// THIS FILE IS FOR A REACT NATIVE BUILD AND IS NOT USED IN THE CURRENT WEB APPLICATION.
// It is kept for reference or future native development.

import React, { useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import FeatureCard from '../components/FeatureCard';

import BusIcon from '../components/icons/BusIcon';
import JourneyPlannerIcon from '../components/icons/JourneyPlannerIcon';
import NearbyStopsIcon from '../components/icons/NearbyStopsIcon';
import SearchIcon from '../components/icons/SearchIcon';
import RecenterIcon from '../components/icons/RecenterIcon';

const initialMapRegion = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

const DashboardScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);

  const handleRecenter = () => {
    mapRef.current?.animateToRegion(initialMapRegion, 1000); // 1-second animation
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#1D102B', '#4D2A7A', '#A13D63']}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={styles.header}
      >
        <Text style={styles.headerTitle}>GramYatra</Text>
        <Text style={styles.headerSubtitle}>Real-time Rural Bus Tracking</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchIcon}>
          <SearchIcon color="#8A8D91" />
        </View>
        <TextInput
          placeholder="Search Bus / Route"
          placeholderTextColor="#8A8D91"
          style={styles.searchInput}
        />
      </View>
      
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={initialMapRegion}
          customMapStyle={mapStyle}
        >
          <Marker coordinate={{ latitude: 12.9716, longitude: 77.5946 }}>
            <View style={styles.markerContainer}>
              <View style={styles.markerGlow} />
              <View style={styles.markerCore} />
            </View>
          </Marker>
        </MapView>
        <Pressable style={styles.recenterButton} onPress={handleRecenter}>
          <RecenterIcon color="#FFFFFF" size={20} />
        </Pressable>
      </View>

      <View style={styles.featuresSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuresScrollView}>
          <FeatureCard title="Track a Bus" icon={<BusIcon color="#00D4FF" />} />
          <FeatureCard title="Journey Planner" icon={<JourneyPlannerIcon color="#00D4FF" />} />
          <FeatureCard title="Nearby Stops" icon={<NearbyStopsIcon color="#00D4FF" />} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#8A8D91',
    fontSize: 14,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 15,
    top: 15,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#1A1D23',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingLeft: 45,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recenterButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(26, 29, 35, 0.7)',
    padding: 8,
    borderRadius: 8,
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  markerContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerGlow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00D4FF',
    position: 'absolute',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  markerCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0B0D10',
  },
  featuresSection: {
    height: 140,
  },
  featuresScrollView: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
});

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#28356f' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6f9ba5' }] },
  { featureType: 'poi', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#3C7680' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#304a7d' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'road', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#255763' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#b0d5ce' }] },
  { featureType: 'road.highway', elementType: 'labels.text.stroke', stylers: [{ color: '#023e58' }] },
  { featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
  { featureType: 'transit', elementType: 'labels.text.stroke', stylers: [{ color: '#1d2c4d' }] },
  { featureType: 'transit.line', elementType: 'geometry.fill', stylers: [{ color: '#28356f' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#3a4762' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
];

export default DashboardScreen;