import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LOCATIONS } from '@/data/mock';
import { Colors } from '@/constants/theme';

const GOOGLE_OFFICE = { lat: 35.657167, lng: 139.703167 };

const buildMapHtml = (): string => {
  const markersJs = LOCATIONS.map((loc) => {
    const varName = `m_${loc.id.replace(/-/g, '_')}`;
    const popupHtml = `<b>${loc.name}</b><br/>${loc.nameEn}<br/><a href="#" data-id="${loc.id}" style="color:#1A73E8;font-weight:700">查看榜单 ›</a>`;
    return `
      const ${varName} = L.marker([${loc.lat}, ${loc.lng}]).addTo(map);
      ${varName}.bindPopup(${JSON.stringify(popupHtml)});`;
  }).join('\n');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>html,body,#map{margin:0;padding:0;height:100%;width:100%;}</style>
</head>
<body>
<div id="map"></div>
<script>
  const map = L.map('map').setView([${GOOGLE_OFFICE.lat}, ${GOOGLE_OFFICE.lng}], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
${markersJs}
  map.on('popupopen', (e) => {
    const link = e.popup.getElement().querySelector('a[data-id]');
    if (link) {
      link.addEventListener('click', (ev) => {
        ev.preventDefault();
        window.parent.postMessage({ type: 'paipai:goto', id: link.dataset.id }, '*');
      });
    }
  });
<\/script>
</body>
</html>`;
};

const MAP_HTML = buildMapHtml();

export default function MapScreenWeb() {
  const router = useRouter();
  const mapRef = useRef<View>(null);

  useEffect(() => {
    // @ts-ignore react-native-web exposes the underlying DOM node via ref
    const host: any = mapRef.current;
    if (!host || typeof document === 'undefined') return;

    const iframe = document.createElement('iframe') as HTMLIFrameElement;
    iframe.setAttribute('srcdoc', MAP_HTML);
    iframe.setAttribute('title', '拍拍 地图');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    // Remove any previously appended iframe (strict mode re-mount)
    while (host.firstChild) host.removeChild(host.firstChild);
    host.appendChild(iframe);

    const onMessage = (e: MessageEvent) => {
      const data = e.data as { type?: string; id?: string } | null;
      if (data && data.type === 'paipai:goto' && data.id) {
        router.push(`/location/${data.id}` as `/location/${string}`);
      }
    };
    window.addEventListener('message', onMessage);

    return () => {
      window.removeEventListener('message', onMessage);
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    };
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>发现拍照热点 (Web 预览)</Text>
        <Text style={styles.heroSubtitle}>此地最佳角度 · 此地最佳大片</Text>
      </View>

      <View style={styles.map} ref={mapRef} />

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
    backgroundColor: '#e0f2fe',
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