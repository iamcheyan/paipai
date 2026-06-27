export interface LocationGuide {
  referenceImage: string;
  tips: string[];
  tipsJa?: string[];
  targetPitch: number;
  targetRoll: number;
  targetHeading: number;
}

export interface Location {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  address: string;
  addressJa?: string;
  photoCount: number;
  hotScore: number;
  isPrimaryDemo?: boolean;
  coverImage: string;
  guide: LocationGuide;
}

export interface Photo {
  id: string;
  locationId: string;
  userName: string;
  avatar: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
  createdAt: string;
  rank: number;
  isLocal?: boolean;
  localUri?: string;
}