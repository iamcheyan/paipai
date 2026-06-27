import { PHOTOS } from '@/data/mock';
import type { Photo } from '@/types';

let extraPhotos: Photo[] = [];
const likeOverrides = new Map<string, number>();

export function getPhotosForLocation(locationId: string): Photo[] {
  const all = [...PHOTOS, ...extraPhotos].filter((p) => p.locationId === locationId);
  return all
    .map((p) => ({
      ...p,
      likes: likeOverrides.get(p.id) ?? p.likes,
    }))
    .sort((a, b) => b.likes - a.likes)
    .map((p, i) => ({ ...p, rank: i + 1 }));
}

export function addPhoto(photo: Photo): void {
  extraPhotos = [photo, ...extraPhotos];
}

export function likePhoto(photoId: string): number {
  const base =
    likeOverrides.get(photoId) ??
    [...PHOTOS, ...extraPhotos].find((p) => p.id === photoId)?.likes ??
    0;
  const next = base + 1;
  likeOverrides.set(photoId, next);
  return next;
}

export function getPhotoCount(locationId: string): number {
  return getPhotosForLocation(locationId).length;
}