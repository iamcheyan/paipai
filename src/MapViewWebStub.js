import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapViewWebStub = ({ children, style, ...props }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>🗺️ 地图 (Web 占位符)</Text>
      <Text style={styles.sub}>点击下方列表测试地点和跟拍</Text>
      {children}
    </View>
  );
};

const Marker = ({ title, description, ...props }) => null;

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
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
});

export default MapViewWebStub;
export { Marker, PROVIDER_GOOGLE };