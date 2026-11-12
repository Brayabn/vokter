// Navegación entre las secciones principales.
//
// Desde que la app usa barra inferior, las cinco secciones viven dentro del
// navegador de pestañas ("Tabs") y el resto son pantallas apiladas encima. Esta
// función oculta esa diferencia: las pantallas llaman goTo(navigation, 'Ligas')
// sin saber si es una pestaña o no.
const PESTANAS = ['Inicio', 'Partidos', 'Ligas', 'Mercados', 'Perfil'];

export function goTo(navigation, name, params) {
  if (PESTANAS.includes(name)) {
    // navigate (y no reset) para conservar el estado de las demás pestañas.
    navigation.navigate('Tabs', { screen: name, params });
    return;
  }
  navigation.navigate(name, params);
}
