const { Op } = require('sequelize');
const { Content, Category, User } = require('../models');

// GET /api/contents?search=&categorySlug=&sort=rating
exports.list = async (req, res) => {
  try {
    const { search, categorySlug, sort } = req.query;
    const where = {};
    const include = [
      { model: Category, as: 'category' },
      { model: User, as: 'author', attributes: ['id', 'name', 'avatarUrl', 'rating'] },
    ];

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { tags: { [Op.like]: `%${search}%` } },
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
    return res.status(500).json({ error: 'Error al listar contenidos.' });
  }
};

// GET /api/contents/:id
exports.getById = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'author', attributes: ['id', 'name', 'bio', 'avatarUrl', 'rating', 'skills'] },
      ],
    });
    if (!content) return res.status(404).json({ error: 'Contenido no encontrado.' });
    return res.json({ content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al obtener el contenido.' });
  }
};

// POST /api/contents  (solo expertos)
exports.create = async (req, res) => {
  try {
    const { title, description, tags, categoryId, imageUrl } = req.body;
    if (!title || !description || !categoryId) {
      return res.status(400).json({ error: 'title, description y categoryId son obligatorios.' });
    }
    const content = await Content.create({
      title, description, tags, categoryId, imageUrl,
      authorId: req.user.id,
    });
    return res.status(201).json({ content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al crear el contenido.' });
  }
};

// GET /api/categories
exports.listCategories = async (req, res) => {
  const categories = await Category.findAll({ order: [['name', 'ASC']] });
  return res.json({ categories });
};

// GET /api/experts?categorySlug=  -> expertos, opcionalmente los que tienen contenido en esa categoría
exports.listExperts = async (req, res) => {
  try {
    const { categorySlug } = req.query;

    if (categorySlug) {
      const contents = await Content.findAll({
        include: [
          { model: Category, as: 'category', where: { slug: categorySlug } },
          { model: User, as: 'author', attributes: ['id', 'name', 'bio', 'skills', 'avatarUrl', 'rating'] },
        ],
      });
      const seen = new Map();
      contents.forEach((c) => { if (c.author && !seen.has(c.author.id)) seen.set(c.author.id, c.author); });
      return res.json({ experts: Array.from(seen.values()) });
    }

    const experts = await User.findAll({
      where: { role: 'expert' },
      attributes: ['id', 'name', 'bio', 'skills', 'avatarUrl', 'rating'],
      order: [['rating', 'DESC']],
    });
    return res.json({ experts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar expertos.' });
  }
};
