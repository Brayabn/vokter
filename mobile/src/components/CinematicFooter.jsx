import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Line, Stop, Text as SvgText } from 'react-native-svg';
import { ArrowUp } from 'lucide-react-native';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { colors, fonts } from '../theme';
import GradientText from './GradientText';
import Halo from './Halo';

/**
 * Cierre del inicio: el CinematicFooter de la web (frontend/src/components/ui/motion-footer.jsx).
 * Marquesina diagonal, aurora que "respira", rejilla, el titular con brillo, píldoras de
 * vidrio hacia el resto de la tienda, "VØKTER" gigante en contorno y la barra inferior con
 * el corazón latiendo y "volver arriba".
 *
 * `primaryLinks` / `secondaryLinks`: [{ label, onPress, icon? }].
 */

const MARQUEE = ['VOKTER AI', 'Ropa', 'Tecnología', 'Calzado', 'Accesorios', 'Hogar', 'Deporte', 'Web + Android'];

function useLoop(factory, enabled, deps = []) {
  useEffect(() => {
    if (!enabled) return undefined;
    const loop = factory();
    loop.start();
    return () => loop.stop();
  }, [enabled, ...deps]);
}

function Marquee({ animate }) {
  const x = useRef(new Animated.Value(0)).current;
  const [itemWidth, setItemWidth] = useState(0);

  useLoop(
    () => Animated.loop(Animated.timing(x, { toValue: 1, duration: 40000, easing: Easing.linear, useNativeDriver: true })),
    animate && itemWidth > 0,
    [itemWidth]
  );

  const translateX = x.interpolate({ inputRange: [0, 1], outputRange: [0, -itemWidth || 0] });
  const row = (onLayout) => (
    <View style={styles.marqueeItem} onLayout={onLayout}>
      {MARQUEE.map((item, i) => (
        <View key={item} style={styles.marqueeEntry}>
          <Text style={styles.marqueeText}>{item}</Text>
          <Text style={[styles.marqueeText, { color: i % 2 ? 'rgba(111,211,255,0.7)' : 'rgba(30,107,255,0.7)' }]}>✦</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.marquee}>
      <Animated.View style={[styles.marqueeTrack, { transform: [{ translateX }] }]}>
        {row((e) => setItemWidth(e.nativeEvent.layout.width))}
        {row()}
      </Animated.View>
    </View>
  );
}

function GlassPill({ label, onPress, icon: Icon, primary, small }) {
  const scale = useRef(new Animated.Value(1)).current;
  const spring = (toValue) => Animated.spring(scale, { toValue, speed: 30, bounciness: 10, useNativeDriver: true }).start();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => spring(0.95)}
        onPressOut={() => spring(1)}
        accessibilityRole="link"
        style={({ pressed }) => [styles.pill, small ? styles.pillSmall : styles.pillLarge, pressed && styles.pillPressed]}
      >
        {Icon && <Icon size={20} color={colors.steel} />}
        <Text
          style={[
            small ? styles.pillTextSmall : styles.pillText,
            { color: primary ? colors.azureSoft : small ? colors.steel : colors.mist },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function CinematicFooter({ heading, primaryLinks = [], secondaryLinks = [], onScrollTop }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const breathe = useRef(new Animated.Value(0)).current;
  const heart = useRef(new Animated.Value(0)).current;

  useLoop(
    () => Animated.loop(Animated.sequence([
      Animated.timing(breathe, { toValue: 1, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.timing(breathe, { toValue: 0, duration: 8000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
    ])),
    !reducedMotion
  );
  useLoop(
    () => Animated.loop(Animated.timing(heart, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })),
    !reducedMotion
  );

  const auroraStyle = {
    opacity: breathe.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
    transform: [{ scale: breathe.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }],
  };
  // footer-heartbeat: dos latidos (15% y 45%) y reposo
  const heartScale = heart.interpolate({ inputRange: [0, 0.15, 0.3, 0.45, 0.6, 1], outputRange: [1, 1.2, 1, 1.2, 1, 1] });

  const minHeight = Math.max(height, 640);
  const gridStep = 60;
  const giantSize = width * 0.26 * 1.15;
  const year = new Date().getFullYear();

  return (
    <View style={[styles.footer, { minHeight, paddingBottom: 32 + insets.bottom }]}>
      {/* Aurora y rejilla de fondo */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, auroraStyle]} pointerEvents="none">
        <Halo
          width={width * 1.1}
          height={minHeight * 0.6}
          stops={[[0, '#1E6BFF', 0.18], [0.4, '#6FD3FF', 0.14], [0.7, '#6FD3FF', 0], [1, '#6FD3FF', 0]]}
          style={{ position: 'relative' }}
        />
      </Animated.View>
      <Svg style={StyleSheet.absoluteFill} width={width} height={minHeight} pointerEvents="none">
        <Defs>
          <LinearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F2F8FF" stopOpacity="0" />
            <Stop offset="0.3" stopColor="#F2F8FF" stopOpacity="0.04" />
            <Stop offset="0.7" stopColor="#F2F8FF" stopOpacity="0.04" />
            <Stop offset="1" stopColor="#F2F8FF" stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="giant" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F2F8FF" stopOpacity="0.12" />
            <Stop offset="0.6" stopColor="#F2F8FF" stopOpacity="0" />
          </LinearGradient>
        </Defs>
        {Array.from({ length: Math.ceil(width / gridStep) + 1 }, (_, i) => (
          <Line key={`v${i}`} x1={i * gridStep} y1={0} x2={i * gridStep} y2={minHeight} stroke="url(#gridFade)" strokeWidth={1} />
        ))}
        {Array.from({ length: Math.ceil(minHeight / gridStep) + 1 }, (_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * gridStep} x2={width} y2={i * gridStep} stroke="rgba(242,248,255,0.03)" strokeWidth={1} />
        ))}
        {/* VØKTER gigante en contorno (footer-giant-bg-text) */}
        <SvgText
          x={width / 2}
          y={minHeight + giantSize * 0.05}
          fontSize={giantSize}
          fontFamily={fonts.displayHeavy}
          letterSpacing={-giantSize * 0.05}
          textAnchor="middle"
          fill="url(#giant)"
          stroke="rgba(242,248,255,0.07)"
          strokeWidth={1}
        >
          VØKTER
        </SvgText>
      </Svg>

      {/* 1. Marquesina diagonal */}
      <View style={styles.marqueeWrap} pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Marquee animate={!reducedMotion} />
      </View>

      {/* 2. Contenido central */}
      <View style={styles.content}>
        <GradientText
          style={styles.heading}
          colors={[colors.mist, 'rgba(242,248,255,0.45)']}
          variant="mist"
          accessibilityRole="header"
        >
          {heading}
        </GradientText>

        <View style={styles.primaryLinks}>
          {primaryLinks.map((l, i) => <GlassPill key={l.label} {...l} primary={i === 0} />)}
        </View>
        {secondaryLinks.length > 0 && (
          <View style={styles.secondaryLinks}>
            {secondaryLinks.map((l) => <GlassPill key={l.label} {...l} small />)}
          </View>
        )}
      </View>

      {/* 3. Barra inferior */}
      <View style={styles.bottom}>
        <View style={[styles.pill, styles.madeWith]}>
          <Text style={styles.madeText}>HECHO CON</Text>
          <Animated.Text style={[styles.heart, { transform: [{ scale: heartScale }] }]} accessibilityLabel="amor">❤</Animated.Text>
          <Text style={styles.madeText}>POR</Text>
          <Text style={styles.madeBrand}>VØKTER</Text>
        </View>
        <Text style={styles.copyright}>© {year} VØKTER. TODOS LOS DERECHOS RESERVADOS.</Text>
        {onScrollTop && (
          <Pressable onPress={onScrollTop} accessibilityRole="button" accessibilityLabel="Volver arriba" style={({ pressed }) => [styles.pill, styles.topButton, pressed && styles.pillPressed]}>
            <ArrowUp size={20} color={colors.steel} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { overflow: 'hidden', backgroundColor: colors.ink, justifyContent: 'space-between' },
  center: { alignItems: 'center', justifyContent: 'center' },
  marqueeWrap: {
    marginTop: 48,
    marginHorizontal: -24,
    transform: [{ rotate: '-2deg' }],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(24,36,58,0.6)',
    backgroundColor: 'rgba(4,7,13,0.6)',
    paddingVertical: 16,
    boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.6)',
  },
  marquee: { overflow: 'hidden' },
  marqueeTrack: { flexDirection: 'row' },
  marqueeItem: { flexDirection: 'row', paddingHorizontal: 24 },
  marqueeEntry: { flexDirection: 'row', gap: 48, marginRight: 48 },
  marqueeText: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 3.6, textTransform: 'uppercase', color: colors.steel },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 },
  heading: { fontFamily: fonts.displayHeavy, fontSize: 46, lineHeight: 50, letterSpacing: -2.3, textAlign: 'center', marginBottom: 48 },
  primaryLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16 },
  secondaryLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 24 },
  // footer-glass-pill
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(242,248,255,0.12)',
    backgroundColor: 'rgba(242,248,255,0.05)',
    boxShadow: '0px 10px 30px -10px rgba(4,7,13,0.5), inset 0px 1px 1px rgba(242,248,255,0.14)',
  },
  pillPressed: { borderColor: 'rgba(30,107,255,0.55)', backgroundColor: 'rgba(242,248,255,0.12)' },
  pillLarge: { paddingHorizontal: 32, paddingVertical: 16 },
  pillSmall: { paddingHorizontal: 24, paddingVertical: 12 },
  pillText: { fontFamily: fonts.bodyBold, fontSize: 14 },
  pillTextSmall: { fontFamily: fonts.bodyMedium, fontSize: 12 },
  bottom: { alignItems: 'center', gap: 24, paddingHorizontal: 24 },
  madeWith: { gap: 8, paddingHorizontal: 24, paddingVertical: 12 },
  madeText: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1.5, color: colors.steel },
  heart: { fontSize: 14, color: colors.sky },
  madeBrand: { fontFamily: fonts.displayHeavy, fontSize: 12, color: colors.mist, marginLeft: 4 },
  copyright: { fontFamily: fonts.bodySemi, fontSize: 10, letterSpacing: 1.5, color: colors.steel, textAlign: 'center' },
  topButton: { width: 48, height: 48, justifyContent: 'center', gap: 0 },
});
