const { Favorite, Content, Category, User } = require('../models');
const { parseId } = require('../utils/params');

// GET /api/favorites  (del usuario autenticado)
exports.list = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{
        model: Content,
        as: 'favoriteContents',
        include: [
          { model: Category, as: 'category' },
          { model: User, as: 'author', attributes: ['id', 'name', 'avatarUrl', 'rating'] },
        ],
      }],
    });
    return res.json({ favorites: user?.favoriteContents || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al listar favoritos.' });
  }
};

// POST /api/favorites/:contentId  (idempotente: si ya existe, responde 200)
exports.add = async (req, res) => {
  try {
    const contentId = parseId(req.params.contentId);
    const content = contentId && (await Content.findByPk(contentId));
    if (!content) return res.status(404).json({ error: 'Contenido no encontrado.' });

    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId: req.user.id, contentId },
    });
    return res.status(created ? 201 : 200).json({ favorite, created });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al agregar el favorito.' });
  }
};

// DELETE /api/favorites/:contentId  (idempotente)
exports.remove = async (req, res) => {
  try {
    const contentId = parseId(req.params.contentId);
    if (!contentId) return res.status(404).json({ error: 'Contenido no encontrado.' });
    await Favorite.destroy({ where: { userId: req.user.id, contentId } });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al eliminar el favorito.' });
  }
};
