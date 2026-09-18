// Validaciones de formularios. Replican las reglas del backend
// (authController) para dar feedback inmediato sin esperar al servidor.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function validateLogin({ email, password }) {
  if (!email.trim() || !password) return 'Ingresa tu correo y tu contraseña.';
  if (!EMAIL_REGEX.test(email.trim())) return 'El correo electrónico no tiene un formato válido.';
  return null;
}

export function validateRegister({ name, email, password }) {
  if (!name.trim()) return 'Ingresa tu nombre.';
  if (!EMAIL_REGEX.test(email.trim())) return 'El correo electrónico no tiene un formato válido.';
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  return null;
}
