import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapViewWeb = ({ style, children, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>🗺️ Map (Web preview)</Text>
      <Text style={styles.sub}>Tap an item in the list below to try a spot and guided shoot</Text>
      <Text style={styles.note}>Full map available on device/emulator</Text>
      {children}
    </View>
  );
};

const Marker = () => null;
const PROVIDER_GOOGLE = 'google';

const styles = StyleSheet.create({
  container: {
    height: 280,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  sub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  note: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default MapViewWeb;
export { Marker, PROVIDER_GOOGLE };