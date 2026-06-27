import { useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from '../MapView';

import { LOCATIONS } from '@/data/mock';
import { Colors } from '@/constants/theme';

const INITIAL_REGION = {
  latitude: 35.6583,
  longitude: 139.7018,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

export default function MapScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>发现拍照热点</Text>
        <Text style={styles.heroSubtitle}>此地最佳角度 · 此地最佳大片</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        showsMyLocationButton
      >
        {LOCATIONS.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{ latitude: loc.lat, longitude: loc.lng }}
            title={loc.name}
            description={loc.nameEn}
            onCalloutPress={() => router.push(`/location/${loc.id}`)}
          />
        ))}
      </MapView>

      <View style={styles.list}>
        <Text style={styles.listTitle}>附近热点</Text>
        {LOCATIONS.map((loc) => (
          <Pressable
            key={loc.id}
            style={[styles.locationCard, loc.isPrimaryDemo && styles.locationCardPrimary]}
            onPress={() => router.push(`/location/${loc.id}`)}
          >
            <View style={styles.locationInfo}>
              {loc.isPrimaryDemo && (
                <View style={styles.demoBadge}>
                  <Text style={styles.demoBadgeText}>DEMO</Text>
                </View>
              )}
              <Text style={styles.locationName}>{loc.name}</Text>
              <Text style={styles.locationNameEn}>{loc.nameEn}</Text>
              <Text style={styles.locationMeta}>
                {loc.photoCount} 张大片 · 热度 {loc.hotScore}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  map: {
    height: 280,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationCardPrimary: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  locationInfo: {
    flex: 1,
  },
  demoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  demoBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  locationName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  locationNameEn: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  locationMeta: {
    fontSize: 13,
    color: Colors.primary,
    marginTop: 6,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 28,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});
