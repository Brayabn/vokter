import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { alpha, colors, fonts } from '../theme';

// Buscador del catálogo web: píldora oscura con la lupa a la izquierda y anillo azul al enfocar.
export default function SearchInput({ value, onChangeText, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <Search size={20} color="rgba(140,163,194,0.7)" style={styles.icon} />
      <TextInput
        style={[styles.input, focused && styles.focused]}
        placeholder={placeholder}
        placeholderTextColor="rgba(140,163,194,0.7)"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'center', marginBottom: 24 },
  icon: { position: 'absolute', left: 20, zIndex: 1 },
  input: {
    backgroundColor: alpha.ink80,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: alpha.white15,
    paddingLeft: 48,
    paddingRight: 20,
    paddingVertical: 14,
    color: colors.mist,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  focused: { borderColor: alpha.azure60, boxShadow: '0px 0px 0px 4px rgba(30,107,255,0.10)' },
});
