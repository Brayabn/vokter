const { User } = require('../models');
const { matchExperts } = require('../utils/matchEngine');

// POST /api/ai/match  { query: "necesito ayuda con marketing para mi negocio" }
exports.match = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || query.trim().length < 3) {
      return res.status(400).json({ error: 'Escribe una consulta más específica.' });
    }

    const experts = await User.findAll({
      where: { role: 'expert' },
      attributes: ['id', 'name', 'bio', 'skills', 'avatarUrl', 'rating'],
    });

    const results = matchExperts(query, experts, 3);

    return res.json({
      query,
      results: results.map(({ expert, score }) => ({
        id: expert.id,
        name: expert.name,
        bio: expert.bio,
        avatarUrl: expert.avatarUrl,
        rating: expert.rating,
        matchScore: score,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al procesar la consulta con VOKTER AI.' });
  }
};
