import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { PhotoCard } from '@/components/PhotoCard';
import { getLocation } from '@/data/mock';
import { getPhotosForLocation } from '@/lib/photoStore';
import { Colors } from '@/constants/theme';
import type { Photo } from '@/types';

export default function LocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const location = getLocation(id ?? '');
  const [photos, setPhotos] = useState<Photo[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        setPhotos(getPhotosForLocation(id));
      }
    }, [id])
  );

  if (!location) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>地点不存在</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.subtitle}>{location.nameEn}</Text>
        <Text style={styles.address}>{location.address}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{photos.length}</Text>
            <Text style={styles.statLabel}>大片</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{location.hotScore}</Text>
            <Text style={styles.statLabel}>热度</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <PhotoCard photo={item} />}
        ListHeaderComponent={<Text style={styles.listTitle}>此地榜单</Text>}
      />

      <Pressable style={styles.fab} onPress={() => router.push(`/camera/${location.id}`)}>
        <Text style={styles.fabIcon}>📷</Text>
        <Text style={styles.fabText}>跟拍</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.textSecondary,
  },
  header: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  address: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});