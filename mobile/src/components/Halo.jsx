import { View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

/**
 * Resplandor radial decorativo: los bg-[radial-gradient(...)] blur-2xl de la web (detrás del
 * hero, del login, de la ficha de una marca...). `stops` son [offset, color, opacity].
 * React Native no tiene blur sin dependencias nativas: un degradado radial que llega a 0 en
 * el borde se lee igual de difuso.
 */
const DEFAULT_STOPS = [
  [0, '#1E6BFF', 0.26],
  [0.55, '#6FD3FF', 0.1],
  [1, '#6FD3FF', 0],
];

export default function Halo({ width, height = width, stops = DEFAULT_STOPS, style }) {
  return (
    <View pointerEvents="none" style={[{ position: 'absolute', width, height }, style]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id="halo" cx="50%" cy="50%" rx="50%" ry="50%">
            {stops.map(([offset, color, opacity]) => (
              <Stop key={offset} offset={String(offset)} stopColor={color} stopOpacity={String(opacity)} />
            ))}
          </RadialGradient>
        </Defs>
        <Ellipse cx={width / 2} cy={height / 2} rx={width / 2} ry={height / 2} fill="url(#halo)" />
      </Svg>
    </View>
  );
}
