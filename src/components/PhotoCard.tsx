import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import type { Photo } from '@/types';
import { likePhoto } from '@/lib/photoStore';
import { useState } from 'react';

type Props = {
  photo: Photo;
};

export function PhotoCard({ photo }: Props) {
  const [likes, setLikes] = useState(photo.likes);

  const handleLike = () => {
    setLikes(likePhoto(photo.id));
  };

  return (
    <View style={styles.card}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>#{photo.rank}</Text>
      </View>

      {photo.localUri || photo.imageUrl ? (
        <Image source={{ uri: photo.localUri || photo.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📸</Text>
          <Text style={styles.placeholderText}>Sample shot</Text>
        </View>
      )}

      <View style={styles.meta}>
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{photo.userName.slice(0, 1)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{photo.userName}</Text>
            <Text style={styles.caption} numberOfLines={2}>
              {photo.caption}
            </Text>
          </View>
        </View>

        <Pressable style={styles.likeButton} onPress={handleLike}>
          <Text style={styles.likeIcon}>❤️</Text>
          <Text style={styles.likeCount}>{likes}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#E8EAED',
  },
  placeholder: {
    width: '100%',
    height: 220,
    backgroundColor: '#E8EAED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  caption: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE8E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  likeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  likeCount: {
    fontWeight: '700',
    color: '#C5221F',
  },
});