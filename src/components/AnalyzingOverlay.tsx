import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

// 斑斓粒子配色
const COLORS = [
  '#1A73E8',
  '#FF6D00',
  '#34A853',
  '#9C27B0',
  '#FBBC05',
  '#00BCD4',
  '#FF4081',
  '#7C4DFF',
];
const DOT_COUNT = 22;

type Props = {
  visible: boolean;
  label?: string;
};

type Dot = {
  id: number;
  left: number;
  top: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
};

export function AnalyzingOverlay({ visible, label = 'Analyzing composition…' }: Props) {
  // 仅在挂载时为每个点生成稳定的随机参数，避免重渲染抖动
  const dots = useRef<Dot[]>(
    Array.from({ length: DOT_COUNT }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 5 + Math.random() * 16,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 700,
      duration: 1000 + Math.random() * 1200,
      driftX: (Math.random() - 0.5) * 24,
      driftY: (Math.random() - 0.5) * 24,
    }))
  ).current;

  const anims = useRef(
    dots.map(() => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.4),
      translate: new Animated.ValueXY({ x: 0, y: 0 }),
    }))
  ).current;

  useEffect(() => {
    if (!visible) {
      anims.forEach((a) => {
        a.opacity.setValue(0);
        a.scale.setValue(0.4);
        a.translate.setValue({ x: 0, y: 0 });
      });
      return;
    }
    const drivers = dots.map((d, i) => {
      const a = anims[i];
      const half = d.duration / 2;
      return Animated.loop(
        Animated.sequence([
          Animated.delay(d.delay),
          Animated.parallel([
            Animated.timing(a.opacity, {
              toValue: 0.95,
              duration: half,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(a.scale, {
              toValue: 1,
              duration: half,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(a.translate, {
              toValue: { x: d.driftX, y: d.driftY },
              duration: d.duration,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(a.opacity, {
              toValue: 0,
              duration: half,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(a.scale, {
              toValue: 0.4,
              duration: half,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(a.translate, {
              toValue: { x: -d.driftX, y: -d.driftY },
              duration: half,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });
    const master = Animated.parallel(drivers);
    master.start();
    return () => master.stop();
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.dotsLayer}>
        {dots.map((d, i) => {
          const a = anims[i];
          return (
            <Animated.View
              key={d.id}
              style={[
                styles.dot,
                {
                  left: `${d.left}%`,
                  top: `${d.top}%`,
                  width: d.size,
                  height: d.size,
                  borderRadius: d.size / 2,
                  backgroundColor: d.color,
                  opacity: a.opacity,
                  transform: [
                    { translateX: a.translate.x },
                    { translateY: a.translate.y },
                    { scale: a.scale },
                  ],
                },
              ]}
            />
          );
        })}
      </View>
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    overflow: 'hidden',
  },
  dotsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  dot: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
  labelWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
});