const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { config } = require('../config/env');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// bcrypt solo usa los primeros 72 bytes: más largo se rechaza en vez de truncarse en silencio.
const MAX_PASSWORD = 72;
// Hash ficticio: el login compara contra él cuando el correo no existe, para que
// el tiempo de respuesta no revele qué correos están registrados.
const DUMMY_HASH = bcrypt.hashSync('vokter-dummy-password', 10);

const isText = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function publicUser(user) {
  const { id, name, email, role, bio, skills, avatarUrl, rating } = user;
  return { id, name, email, role, bio, skills, avatarUrl, rating };
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, bio, skills } = req.body;

    if (!isText(name, 100) || !isText(email, 254) || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'name, email y password son obligatorios.' });
    }
    if ((bio !== undefined && (typeof bio !== 'string' || bio.length > 1000))
      || (skills !== undefined && (typeof skills !== 'string' || skills.length > 500))) {
      return res.status(400).json({ error: 'bio o skills no son válidos o son demasiado largos.' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'El correo electrónico no tiene un formato válido.' });
    }
    if (password.length < 6 || Buffer.byteLength(password) > MAX_PASSWORD) {
      return res.status(400).json({ error: `La contraseña debe tener entre 6 y ${MAX_PASSWORD} caracteres.` });
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role: role === 'expert' ? 'expert' : 'user',
      bio: bio || '',
      skills: skills || '',
    });

    const token = signToken(user);
    return res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!isText(email, 254) || typeof password !== 'string' || !password || password.length > 200) {
      return res.status(400).json({ error: 'email y password son obligatorios.' });
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    const valid = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
    if (!user || !valid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const token = signToken(user);
    return res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
    return res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
};
