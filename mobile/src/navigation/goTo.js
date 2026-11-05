// Navegación entre las páginas principales (las del menú). Igual que en la web, cada página
// principal cuelga directamente del inicio: "atrás" desde Catálogo, Panel o Favoritos
// vuelve al inicio, en lugar de acumular un historial infinito al usar el menú.
export function goTo(navigation, name, params) {
  if (name === 'Inicio') {
    navigation.reset({ index: 0, routes: [{ name: 'Inicio' }] });
    return;
  }
  navigation.reset({ index: 1, routes: [{ name: 'Inicio' }, { name, params }] });
}
