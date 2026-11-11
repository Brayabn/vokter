import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Interruptor de tema de la barra superior. Muestra el icono del tema al que se
// cambiaría (sol cuando está en oscuro), que es lo que el usuario espera pulsar.
export default function ThemeToggle({ className = '' }) {
  const { isDark, toggleTheme } = useTheme();
  const label = isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline/15 text-mist transition-colors hover:bg-hairline/10 hover:text-sky ${className}`}
    >
      {isDark
        ? <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
        : <Moon className="h-[18px] w-[18px]" aria-hidden="true" />}
    </button>
  );
}
