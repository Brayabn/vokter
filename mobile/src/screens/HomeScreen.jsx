import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, G, Line, Mask, RadialGradient, Rect, Stop } from 'react-native-svg';
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  Dumbbell,
  Footprints,
  Heart,
  Laptop,
  LayoutDashboard,
  MessageSquareText,
  Shirt,
  Sofa,
  Sparkles,
  Store,
  UserPlus,
  Watch,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { goTo } from '../navigation/goTo';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useReducedMotion } from '../hooks/useReducedMotion';
import AiMatchWidget from '../components/AiMatchWidget';
import { HEADER_HEIGHT } from '../components/AppHeader';
import { Button, TextLink } from '../components/Buttons';
import CinematicFooter from '../components/CinematicFooter';
import FadeInView from '../components/FadeInView';
import GlowCard from '../components/GlowCard';
import GradientText from '../components/GradientText';
import Halo from '../components/Halo';
import Screen from '../components/Screen';
import Showcase3D from '../components/Showcase3D';
import { Eyebrow, Kicker } from '../components/Typography';
import { alpha, colors, fonts, PAGE_PADDING } from '../theme';

// El inicio de la app es el landing de la web (frontend/src/pages/Landing.jsx), sección por
// sección: hero con la vitrina 3D, manifiesto, VOKTER AI, categorías, cómo comprar, la app
// y el footer cinemático.

const STEPS = [
  { icon: MessageSquareText, title: 'Descríbelo', text: 'Dile a VOKTER AI qué necesitas como se lo dirías a un amigo: "una chaqueta para la lluvia".' },
  { icon: Sparkles, title: 'Compara', text: 'Te mostramos las marcas de la tienda que lo venden, con un porcentaje de coincidencia real.' },
  { icon: Heart, title: 'Guárdalo', text: 'Añade los artículos a tus favoritos y encuéntralos igual en la web y en la app Android.' },
];

// `slug` debe coincidir con categories.slug del backend (ver backend/src/utils/seedData.js)
const CATEGORIES = [
  { icon: Shirt, name: 'Ropa', slug: 'ropa', text: 'Chaquetas, abrigos, lino y denim.' },
  { icon: Laptop, name: 'Tecnología', slug: 'tecnologia', text: 'Audio, periféricos y pantallas.' },
  { icon: Footprints, name: 'Calzado', slug: 'calzado', text: 'Running, ciudad y montaña.' },
  { icon: Watch, name: 'Accesorios', slug: 'accesorios', text: 'Relojes, mochilas y cuero.' },
  { icon: Sofa, name: 'Hogar', slug: 'hogar', text: 'Madera, cerámica y luz cálida.' },
  { icon: Dumbbell, name: 'Deporte', slug: 'deporte', text: 'Entrenamiento dentro y fuera.' },
];

const STATS = [
  { value: '18', label: 'artículos' },
  { value: '10', label: 'marcas' },
  { value: '6', label: 'categorías' },
];

const STATEMENT =
  'No es un buscador con cien filtros. VØKTER entiende lo que necesitas y te deja frente al artículo correcto.';

// Rejilla de 64 px del hero, que se desvanece hacia los bordes
// ([mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]).
function HeroGrid({ width, height }) {
  const step = 64;
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <RadialGradient id="gridMask" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0.2" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="0.7" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        <Mask id="fade" x="0" y="0" width={width} height={height} maskUnits="userSpaceOnUse">
          <Rect width={width} height={height} fill="url(#gridMask)" />
        </Mask>
      </Defs>
      <G mask="url(#fade)">
        {Array.from({ length: Math.ceil(width / step) + 1 }, (_, i) => (
          <Line key={`v${i}`} x1={i * step} y1={0} x2={i * step} y2={height} stroke="rgba(255,255,255,0.035)" strokeWidth={1} />
        ))}
        {Array.from({ length: Math.ceil(height / step) + 1 }, (_, i) => (
          <Line key={`h${i}`} x1={0} y1={i * step} x2={width} y2={i * step} stroke="rgba(255,255,255,0.035)" strokeWidth={1} />
        ))}
      </G>
    </Svg>
  );
}

// Indicador "Desliza" con el trazo que baja en bucle (animate-[scroll-cue_1.8s...]).
function ScrollCue({ animate }) {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) return undefined;
    const loop = Animated.loop(Animated.timing(progress, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [animate, progress]);
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-48, 96] });
  return (
    <View style={styles.cue} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Text style={styles.cueText}>DESLIZA</Text>
      <View style={styles.cueTrack}>
        <Animated.View style={[styles.cueBar, { transform: [{ translateY }] }]} />
      </View>
    </View>
  );
}

// Entrada del hero al abrir la app: la vitrina crece y el texto sube escalonado.
function useHeroIntro() {
  const stage = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(stage, { toValue: 1, duration: 1400, easing: Easing.out(Easing.poly(4)), useNativeDriver: true }).start();
  }, [stage]);
  return {
    opacity: stage,
    transform: [{ scale: stage.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
  };
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const scrollRef = useRef(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { layouts, measure, reveal } = useScrollReveal(scrollY, height);
  const stageIntro = useHeroIntro();

  const heroHeight = layouts.hero?.height || height;

  // El hero se aleja (sube, se encoge y se desvanece) al hacer scroll, estilo apple.com
  const heroContentStyle = {
    opacity: scrollY.interpolate({ inputRange: [0, heroHeight], outputRange: [1, 0], extrapolate: 'clamp' }),
    transform: [
      { translateY: scrollY.interpolate({ inputRange: [0, heroHeight], outputRange: [0, -heroHeight * 0.18], extrapolate: 'clamp' }) },
      { scale: scrollY.interpolate({ inputRange: [0, heroHeight], outputRange: [1, 0.92], extrapolate: 'clamp' }) },
    ],
  };
  const heroGlowStyle = {
    opacity: scrollY.interpolate({ inputRange: [0, heroHeight], outputRange: [1, 0.2], extrapolate: 'clamp' }),
    transform: [{ scale: scrollY.interpolate({ inputRange: [0, heroHeight], outputRange: [1, 1.4], extrapolate: 'clamp' }) }],
  };

  // Manifiesto: cada palabra se "enciende" mientras la frase cruza la pantalla.
  const words = STATEMENT.split(' ');
  const statement = layouts.statement;
  const wordOpacity = (i) => {
    if (!statement) return 1;
    const start = statement.y - height * 0.75;
    const end = statement.y + statement.height - height * 0.45;
    const seg = Math.max(end - start, 1) / (words.length + 4);
    const from = start + i * seg;
    return scrollY.interpolate({ inputRange: [from, from + seg * 4], outputRange: [0.12, 1], extrapolate: 'clamp' });
  };

  // Teléfono de la sección "App Android": parallax mientras la sección atraviesa la pantalla.
  const app = layouts.app;
  const appRange = app ? [app.y - height, app.y + app.height] : [0, 1];
  const phoneStyle = app && {
    transform: [
      { translateY: scrollY.interpolate({ inputRange: appRange, outputRange: [120, -40], extrapolate: 'clamp' }) },
      { rotate: scrollY.interpolate({ inputRange: appRange, outputRange: ['-6deg', '0deg'], extrapolate: 'clamp' }) },
    ],
  };
  const floatStyle = (i) => app && {
    transform: [{ translateY: scrollY.interpolate({ inputRange: appRange, outputRange: [80 + i * 40, -60 - i * 30], extrapolate: 'clamp' }) }],
  };

  const sectionY = (key) => layouts[key]?.y;
  const nestedY = (parent, child) => (layouts[parent] && layouts[child] ? layouts[parent].y + layouts[child].y : undefined);

  const primaryLinks = [
    { label: 'Ver el catálogo', icon: Compass, onPress: () => goTo(navigation, 'Catálogo') },
    user
      ? { label: 'Ir a mi panel', icon: LayoutDashboard, onPress: () => goTo(navigation, 'Panel') }
      : { label: 'Crear cuenta', icon: UserPlus, onPress: () => navigation.navigate('Register') },
    { label: 'Ver las marcas', icon: Store, onPress: () => goTo(navigation, 'Marcas') },
  ];
  const secondaryLinks = user
    ? [{ label: 'Mis favoritos', onPress: () => goTo(navigation, 'Favoritos') }]
    : [{ label: 'Ya tengo cuenta · Ingresar', onPress: () => navigation.navigate('Login') }];

  const scrollToAi = () => scrollRef.current?.scrollTo({ y: Math.max((sectionY('ai') || 0) - HEADER_HEIGHT - insets.top, 0), animated: true });

  return (
    <Screen overlayHeader scrollY={scrollY}>
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Hero — vitrina 3D arriba, texto debajo (el orden de la web en pantallas estrechas) */}
        <View style={[styles.hero, { minHeight: height, paddingTop: insets.top + HEADER_HEIGHT }]} onLayout={measure('hero')}>
          <Animated.View style={[styles.heroGlow, { left: width * 0.22 - width * 0.4, top: height * 0.42 - height * 0.35 }, heroGlowStyle]}>
            <Halo width={width * 0.8} height={height * 0.7} />
          </Animated.View>
          <HeroGrid width={width} height={height} />

          <Animated.View style={[styles.heroContent, heroContentStyle]}>
            <Animated.View style={stageIntro}>
              <Showcase3D />
            </Animated.View>

            <View style={styles.heroText}>
              <FadeInView delay={300} distance={40}>
                <GradientText variant="mist" style={styles.heroTitle}>Todo lo que buscas.</GradientText>
              </FadeInView>
              <FadeInView delay={450} distance={40}>
                <GradientText style={styles.heroTitle}>En una sola frase.</GradientText>
              </FadeInView>

              <FadeInView delay={700}>
                <Text style={styles.heroSubtitle}>
                  Ropa, tecnología, calzado, hogar. Describe lo que necesitas y VOKTER AI te lleva directo a la marca que lo tiene.
                </Text>
              </FadeInView>

              <FadeInView delay={800} style={styles.heroButtons}>
                <Button label="Ver el catálogo" icon={ArrowRight} onPress={() => goTo(navigation, 'Catálogo')} style={{ alignSelf: 'center' }} />
                <Button label="Probar VOKTER AI" variant="ghost" onPress={scrollToAi} style={{ alignSelf: 'center' }} textStyle={{ fontFamily: fonts.body }} />
              </FadeInView>

              <FadeInView delay={900} style={styles.stats}>
                {STATS.map(({ value, label }) => (
                  <View key={label} style={styles.stat}>
                    <Text style={styles.statValue}>{value}</Text>
                    <Text style={styles.statLabel}>{label}</Text>
                  </View>
                ))}
              </FadeInView>
            </View>
          </Animated.View>

          <ScrollCue animate={!reducedMotion} />
        </View>

        {/* 2. Manifiesto */}
        <View style={styles.statement} onLayout={measure('statement')}>
          <View style={styles.statementRow}>
            {words.map((word, i) => (
              <Animated.Text key={i} style={[styles.statementWord, word === 'VØKTER' && { color: colors.sky }, { opacity: wordOpacity(i) }]}>
                {word}{' '}
              </Animated.Text>
            ))}
          </View>
        </View>

        {/* 3. VOKTER AI */}
        <View style={styles.section} onLayout={measure('ai')}>
          <Animated.View style={[styles.centerHeading, reveal(sectionY('ai'), { distance: 40 })]}>
            <Eyebrow icon={Sparkles}>Pruébalo ahora</Eyebrow>
            <View style={styles.aiTitle}>
              <Text style={[styles.h2, styles.textCenter]}>Pregúntale a </Text>
              <GradientText style={[styles.h2, styles.textCenter]}>VOKTER AI.</GradientText>
            </View>
            <Text style={[styles.lead, styles.textCenter]}>
              Escribe lo que buscas como se lo contarías a alguien en la tienda. Te devolvemos las marcas con un porcentaje de coincidencia real.
            </Text>
          </Animated.View>

          <Animated.View style={reveal(sectionY('ai') != null ? sectionY('ai') + 260 : null, { distance: 80 })}>
            <GlowCard glowColor="deep" style={{ padding: 24 }}>
              <AiMatchWidget variant="hero" />
            </GlowCard>
          </Animated.View>
        </View>

        {/* 4. Categorías */}
        <View style={styles.sectionLarge} onLayout={measure('categories')}>
          <Animated.View style={[{ marginBottom: 56, gap: 24 }, reveal(sectionY('categories'), { distance: 40 })]}>
            <View>
              <Kicker>Categorías</Kicker>
              <Text style={[styles.h2, { marginTop: 16 }]}>Compra por categoría.</Text>
            </View>
            <TextLink label="Ver todo el catálogo" icon={ArrowRight} size={16} onPress={() => goTo(navigation, 'Catálogo')} />
          </Animated.View>

          <View style={{ gap: 20 }} onLayout={measure('categoriesGrid')}>
            {CATEGORIES.map(({ icon: Icon, name, slug, text }) => (
              <Animated.View
                key={slug}
                onLayout={measure(`cat-${slug}`)}
                style={reveal(
                  layouts[`cat-${slug}`] && nestedY('categories', 'categoriesGrid') != null
                    ? nestedY('categories', 'categoriesGrid') + layouts[`cat-${slug}`].y
                    : null
                )}
              >
                <GlowCard style={styles.categoryCard} onPress={() => goTo(navigation, 'Catálogo', { categorySlug: slug })} accessibilityLabel={`Categoría ${name}`}>
                  <View style={styles.categoryTop}>
                    <View style={styles.categoryIcon}>
                      <Icon size={28} color={colors.sky} />
                    </View>
                    <ArrowUpRight size={24} color={colors.steel} />
                  </View>
                  <View>
                    <Text style={styles.categoryName}>{name}</Text>
                    <Text style={styles.categoryText}>{text}</Text>
                  </View>
                </GlowCard>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* 5. Cómo comprar */}
        <View style={styles.sectionLarge} onLayout={measure('steps')}>
          <Animated.View style={[{ marginBottom: 64 }, reveal(sectionY('steps'), { distance: 40 })]}>
            <Kicker>Cómo comprar</Kicker>
            <Text style={[styles.h2, { marginTop: 16 }]}>
              Tres pasos.{'\n'}
              <Text style={{ color: colors.steel }}>Cero filtros.</Text>
            </Text>
            <Text style={[styles.body, { marginTop: 24 }]}>
              De la frase que tienes en la cabeza al artículo que buscabas, sin recorrer veinte páginas de resultados.
            </Text>
          </Animated.View>

          <View style={{ gap: 32 }} onLayout={measure('stepsList')}>
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <Animated.View
                key={title}
                onLayout={measure(`step-${i}`)}
                style={reveal(
                  layouts[`step-${i}`] && nestedY('steps', 'stepsList') != null ? nestedY('steps', 'stepsList') + layouts[`step-${i}`].y : null,
                  { axis: 'x' }
                )}
              >
                <GlowCard style={{ padding: 32 }}>
                  <View style={styles.step}>
                    <View style={styles.stepIcon}>
                      <Icon size={24} color={colors.sky} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</Text>
                      <Text style={styles.stepTitle}>{title}</Text>
                      <Text style={[styles.body, { marginTop: 8 }]}>{text}</Text>
                    </View>
                  </View>
                </GlowCard>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* 6. App: la misma cuenta y los mismos favoritos que en la web */}
        <View style={styles.sectionLarge} onLayout={measure('app')}>
          <View style={styles.appCard}>
            <LinearGradient colors={[colors.surface2, colors.surface, colors.ink]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Halo width={384} stops={[[0, '#1E6BFF', 0.3], [0.5, '#1E6BFF', 0.1], [1, '#1E6BFF', 0]]} style={{ right: -128, top: -128 }} />
            <Animated.View style={reveal(sectionY('app'), { distance: 40 })}>
              <Kicker>App Android</Kicker>
              <Text style={[styles.h2, { marginTop: 16 }]}>La tienda en tu bolsillo.</Text>
              <Text style={[styles.lead, { marginTop: 20 }]}>
                La misma cuenta, los mismos favoritos y VOKTER AI que en la web. Lo que guardes aquí te espera en el computador.
              </Text>
              <Button
                label={user ? 'Ver mis favoritos' : 'Crear cuenta'}
                variant="light"
                icon={user ? Heart : UserPlus}
                iconPosition="left"
                onPress={() => (user ? goTo(navigation, 'Favoritos') : navigation.navigate('Register'))}
                style={{ marginTop: 32 }}
              />
            </Animated.View>

            <View style={styles.phoneStage} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Animated.View style={[styles.phone, phoneStyle]}>
                <View style={styles.phoneNotch} />
                <View style={{ gap: 12, paddingHorizontal: 4 }}>
                  <View style={[styles.skeleton, { width: 96, height: 12, backgroundColor: 'rgba(255,255,255,0.2)' }]} />
                  <View style={styles.phoneSearch} />
                  {[92, 78, 64].map((score) => (
                    <View key={score} style={styles.phoneCard}>
                      <View style={styles.phoneCardRow}>
                        <View style={[styles.skeleton, { width: 64, height: 10, backgroundColor: alpha.white25 }]} />
                        <Text style={styles.phoneScore}>{score}%</Text>
                      </View>
                      <View style={[styles.skeleton, { marginTop: 8, height: 8 }]} />
                      <View style={[styles.skeleton, { marginTop: 6, height: 8, width: '66%' }]} />
                    </View>
                  ))}
                </View>
              </Animated.View>
              <Animated.View style={[styles.floatChip, { left: 0, top: 64 }, floatStyle(0)]}>
                <Text style={styles.floatText}><Text style={{ color: colors.sky }}>★</Text> Favoritos sincronizados</Text>
              </Animated.View>
              <Animated.View style={[styles.floatChip, styles.floatChipSky, { right: 0, bottom: 80 }, floatStyle(1)]}>
                <Text style={[styles.floatText, { fontFamily: fonts.mono, color: colors.sky }]}>92% match</Text>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* 7. Cierre */}
        <CinematicFooter
          heading="¿Empezamos a buscar?"
          primaryLinks={primaryLinks}
          secondaryLinks={secondaryLinks}
          onScrollTop={() => scrollRef.current?.scrollTo({ y: 0, animated: !reducedMotion })}
        />
      </Animated.ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { justifyContent: 'center', overflow: 'hidden', paddingBottom: 120 },
  heroGlow: { position: 'absolute' },
  heroContent: { paddingHorizontal: PAGE_PADDING },
  heroText: { alignItems: 'center', marginTop: 8 },
  heroTitle: { fontFamily: fonts.displayHeavy, fontSize: 46, lineHeight: 48, letterSpacing: -1.2, textAlign: 'center' },
  heroSubtitle: { fontFamily: fonts.body, fontSize: 18, lineHeight: 28, color: colors.steel, textAlign: 'center', marginTop: 28, maxWidth: 448 },
  heroButtons: { marginTop: 36, gap: 16, alignItems: 'center' },
  stats: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginTop: 40 },
  stat: { alignItems: 'center' },
  statValue: { fontFamily: fonts.displayHeavy, fontSize: 30, color: colors.mist },
  statLabel: { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2.6, textTransform: 'uppercase', color: colors.steel },
  cue: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center', gap: 12 },
  cueText: { fontFamily: fonts.mono, fontSize: 12, letterSpacing: 3.6, color: 'rgba(140,163,194,0.7)' },
  cueTrack: { width: 1, height: 48, overflow: 'hidden', backgroundColor: alpha.white10 },
  cueBar: { width: 1, height: 24, backgroundColor: colors.sky },

  statement: { paddingHorizontal: PAGE_PADDING, paddingVertical: 128 },
  statementRow: { flexDirection: 'row', flexWrap: 'wrap' },
  statementWord: { fontFamily: fonts.display, fontSize: 30, lineHeight: 38, letterSpacing: -0.75, color: colors.mist },

  section: { paddingHorizontal: PAGE_PADDING, paddingVertical: 96 },
  sectionLarge: { paddingHorizontal: PAGE_PADDING, paddingVertical: 128 },
  centerHeading: { alignItems: 'center', marginBottom: 56 },
  aiTitle: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 },
  h2: { fontFamily: fonts.displayHeavy, fontSize: 36, lineHeight: 42, letterSpacing: -0.9, color: colors.mist },
  textCenter: { textAlign: 'center' },
  lead: { fontFamily: fonts.body, fontSize: 18, lineHeight: 28, color: colors.steel, marginTop: 20 },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: colors.steel },

  categoryCard: { minHeight: 220, padding: 28, justifyContent: 'space-between' },
  categoryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha.white5,
    borderWidth: 1,
    borderColor: alpha.white10,
  },
  categoryName: { fontFamily: fonts.display, fontSize: 24, color: colors.mist },
  categoryText: { fontFamily: fonts.body, fontSize: 16, color: colors.steel, marginTop: 4 },

  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 20 },
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: alpha.azure15,
    borderWidth: 1,
    borderColor: alpha.sky30,
  },
  stepNumber: { fontFamily: fonts.mono, fontSize: 12, color: colors.sky },
  stepTitle: { fontFamily: fonts.display, fontSize: 24, color: colors.mist, marginTop: 4 },

  appCard: { borderRadius: 40, borderWidth: 1, borderColor: alpha.white10, overflow: 'hidden', padding: 40, gap: 40 },
  phoneStage: { height: 420, alignItems: 'center' },
  phone: {
    height: 420,
    width: 210,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: alpha.white15,
    backgroundColor: colors.ink,
    padding: 12,
    boxShadow: '0px 40px 80px -20px rgba(0,0,0,0.9)',
  },
  phoneNotch: { alignSelf: 'center', width: 80, height: 20, borderRadius: 999, backgroundColor: colors.surface2, marginBottom: 16 },
  skeleton: { height: 8, borderRadius: 999, backgroundColor: alpha.white10 },
  phoneSearch: { height: 36, borderRadius: 999, borderWidth: 1, borderColor: alpha.white10, backgroundColor: colors.surface2 },
  phoneCard: { borderRadius: 16, borderWidth: 1, borderColor: alpha.white10, backgroundColor: colors.surface, padding: 12 },
  phoneCardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  phoneScore: { fontFamily: fonts.mono, fontSize: 9, color: colors.sky, backgroundColor: alpha.sky15, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden' },
  floatChip: {
    position: 'absolute',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: alpha.white10,
    backgroundColor: 'rgba(17,28,45,0.92)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.5)',
  },
  floatChipSky: { borderColor: alpha.sky30, backgroundColor: 'rgba(16,40,58,0.92)' },
  floatText: { fontFamily: fonts.body, fontSize: 12, color: colors.mist },
});
