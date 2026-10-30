const { Op } = require('sequelize');
const { sequelize, Content, Category, User } = require('../models');
const { parseId } = require('../utils/params');

// En PostgreSQL LIKE distingue mayúsculas; ILIKE no. SQLite solo tiene LIKE (ya insensible).
const likeOp = sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

const EXPERT_ATTRIBUTES = ['id', 'name', 'bio', 'skills', 'avatarUrl', 'rating'];

// GET /api/contents?search=&categorySlug=&sort=rating
exports.list = async (req, res) => {
  try {
    // ?search=a&search=b llega como array: solo se aceptan strings acotados.
    const asText = (v) => (typeof v === 'string' ? v.slice(0, 100) : '');
    const search = asText(req.query.search).trim();
    const categorySlug = asText(req.query.categorySlug);
    const sort = asText(req.query.sort);
    const where = {};
    const include = [
      { model: Category, as: 'category' },
      { model: User, as: 'author', attributes: ['id', 'name', 'avatarUrl', 'rating'] },
    ];

    if (search) {
      where[Op.or] = [
        { title: { [likeOp]: `%${search}%` } },
        { description: { [likeOp]: `%${search}%` } },
        { tags: { [likeOp]: `%${search}%` } },
      ];
    }

    if (categorySlug) {
      include[0].where = { slug: categorySlug };
    }

    const order = sort === 'rating' ? [['rating', 'DESC']] : [['createdAt', 'DESC']];

    const contents = await Content.findAll({ where, include, order });
    return res.json({ contents });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar los artículos.' });
  }
};

// GET /api/contents/:id
exports.getById = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: 'Artículo no encontrado.' });
    const content = await Content.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'author', attributes: ['id', 'name', 'bio', 'avatarUrl', 'rating', 'skills'] },
      ],
    });
    if (!content) return res.status(404).json({ error: 'Artículo no encontrado.' });
    return res.json({ content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el artículo.' });
  }
};

// Solo https o rutas propias de /api/media: evita javascript:, data: y URLs internas.
const SAFE_IMAGE_URL = /^(https:\/\/[^\s"'<>]+|\/api\/media\/[\w\-./]+)$/;

// POST /api/contents  (solo expertos)
exports.create = async (req, res) => {
  try {
    const { title, description, tags = '', categoryId, imageUrl = '', price = null } = req.body || {};
    if (typeof title !== 'string' || typeof description !== 'string' || !title.trim() || !description.trim() || !categoryId) {
      return res.status(400).json({ error: 'title, description y categoryId son obligatorios.' });
    }
    if (title.length > 150 || description.length > 5000 || typeof tags !== 'string' || tags.length > 500) {
      return res.status(400).json({ error: 'Título, descripción o etiquetas demasiado largos.' });
    }
    if (typeof imageUrl !== 'string' || (imageUrl && (imageUrl.length > 500 || !SAFE_IMAGE_URL.test(imageUrl) || imageUrl.includes('..')))) {
      return res.status(400).json({ error: 'imageUrl debe ser una URL https válida.' });
    }
    if (price !== null && (!Number.isInteger(price) || price < 0 || price > 1000000000)) {
      return res.status(400).json({ error: 'price debe ser un entero positivo en pesos.' });
    }
    const id = parseId(String(categoryId));
    const category = id && (await Category.findByPk(id));
    if (!category) {
      return res.status(400).json({ error: 'La categoría no existe.' });
    }
    const content = await Content.create({
      title: title.trim(), description: description.trim(), tags, categoryId: category.id, imageUrl, price,
      authorId: req.user.id,
    });
    return res.status(201).json({ content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear el artículo.' });
  }
};

// GET /api/categories
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.json({ categories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar categorías.' });
  }
};

// GET /api/experts/:id  -> perfil público del experto + sus contenidos publicados
exports.getExpert = async (req, res) => {
  try {
    const id = parseId(req.params.id);
    if (!id) return res.status(404).json({ error: 'Marca no encontrada.' });

    const expert = await User.findOne({ where: { id, role: 'expert' }, attributes: EXPERT_ATTRIBUTES });
    if (!expert) return res.status(404).json({ error: 'Marca no encontrada.' });

    const contents = await Content.findAll({
      where: { authorId: id },
      include: [{ model: Category, as: 'category' }],
      order: [['rating', 'DESC']],
    });
    return res.json({ expert, contents });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener la marca.' });
  }
};

// GET /api/experts?categorySlug=  -> expertos, opcionalmente los que tienen contenido en esa categoría
exports.listExperts = async (req, res) => {
  try {
    const { categorySlug } = req.query;

    if (categorySlug) {
      const contents = await Content.findAll({
        include: [
          { model: Category, as: 'category', where: { slug: categorySlug } },
          { model: User, as: 'author', attributes: EXPERT_ATTRIBUTES },
        ],
      });
      const seen = new Map();
      contents.forEach((c) => { if (c.author && !seen.has(c.author.id)) seen.set(c.author.id, c.author); });
      return res.json({ experts: Array.from(seen.values()) });
    }

    const experts = await User.findAll({
      where: { role: 'expert' },
      attributes: EXPERT_ATTRIBUTES,
      order: [['rating', 'DESC']],
    });
    return res.json({ experts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar las marcas.' });
  }
};
