const { Favorite, Content, Category, User } = require('../models');

// GET /api/favorites  (del usuario autenticado)
exports.list = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{
      model: Content,
      as: 'favoriteContents',
      include: [{ model: Category, as: 'category' }],
    }],
  });
  return res.json({ favorites: user?.favoriteContents || [] });
};

// POST /api/favorites/:contentId
exports.add = async (req, res) => {
  const { contentId } = req.params;
  const content = await Content.findByPk(contentId);
  if (!content) return res.status(404).json({ error: 'Contenido no encontrado.' });

  const [favorite, created] = await Favorite.findOrCreate({
    where: { userId: req.user.id, contentId },
  });
  return res.status(created ? 201 : 200).json({ favorite, created });
};

// DELETE /api/favorites/:contentId
exports.remove = async (req, res) => {
  const { contentId } = req.params;
  await Favorite.destroy({ where: { userId: req.user.id, contentId } });
  return res.status(204).send();
};
