import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { alpha, colors, fonts, radius } from '../theme';

// Campo de formulario de la web (INPUT_CLASS de Login/Register): rounded-xl bg-ink/80
// border-white/15, con borde y anillo azul al enfocar.
export default function FormInput({ style, multiline, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholderTextColor="rgba(140,163,194,0.7)"
      accessibilityLabel={props.placeholder}
      {...props}
      multiline={multiline}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={[styles.input, multiline && styles.multiline, focused && styles.focused, style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: alpha.ink80,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: alpha.white15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.mist,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  focused: { borderColor: alpha.azure60, boxShadow: '0px 0px 0px 4px rgba(30,107,255,0.10)' },
});
