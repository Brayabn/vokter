import { forwardRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, PAGE_PADDING } from '../theme';
import AmbientBackground from './AmbientBackground';
import AppHeader from './AppHeader';
import Footer from './Footer';

/**
 * Marco común de todas las pantallas: fondo negro con la constelación, la barra superior
 * y el contenido. Es el App.jsx de la web (AmbientBackground + Navbar + <main>).
 */
export default function Screen({ children, overlayHeader = false, scrollY }) {
  return (
    <View style={styles.root}>
      <AmbientBackground />
      {!overlayHeader && <AppHeader />}
      <View style={styles.body}>{children}</View>
      {overlayHeader && <AppHeader overlay scrollY={scrollY} />}
    </View>
  );
}

/**
 * Página con scroll, márgenes de la web (px-6 py-16) y el Footer al final.
 */
export const Page = forwardRef(function Page({ children, refreshControl, contentStyle, footer = true }, ref) {
  return (
    <Screen>
      <ScrollView
        ref={ref}
        refreshControl={refreshControl}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, contentStyle]}>{children}</View>
        {footer && <Footer />}
      </ScrollView>
    </Screen>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink },
  body: { flex: 1 },
  content: { paddingHorizontal: PAGE_PADDING, paddingTop: 48 },
});
