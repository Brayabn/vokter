require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Category, Content } = require('../models');

async function seed() {
  await sequelize.sync({ force: true }); // ⚠️ recrea las tablas — solo para desarrollo

  const passwordHash = await bcrypt.hash('vokter123', 10);

  const categories = await Category.bulkCreate([
    { name: 'Marketing', slug: 'marketing', icon: '📈' },
    { name: 'Tecnología', slug: 'tecnologia', icon: '💻' },
    { name: 'Diseño', slug: 'diseno', icon: '🎨' },
    { name: 'Negocios', slug: 'negocios', icon: '💼' },
    { name: 'Educación', slug: 'educacion', icon: '🎓' },
  ]);

  const experts = await User.bulkCreate([
    {
      name: 'Laura Martínez', email: 'laura@vokter.com', passwordHash, role: 'expert',
      bio: 'Consultora de marketing digital con 8 años de experiencia en estrategia de marca.',
      skills: 'marketing,estrategia,redes sociales,branding', rating: 4.9,
    },
    {
      name: 'Carlos Ramírez', email: 'carlos@vokter.com', passwordHash, role: 'expert',
      bio: 'Desarrollador full-stack especializado en aplicaciones web y móviles.',
      skills: 'programacion,desarrollo,web,movil,react', rating: 4.7,
    },
    {
      name: 'Sofía Torres', email: 'sofia@vokter.com', passwordHash, role: 'expert',
      bio: 'Diseñadora UX/UI enfocada en productos digitales centrados en el usuario.',
      skills: 'diseno,ux,ui,producto,figma', rating: 4.8,
    },
    {
      name: 'David Gómez', email: 'david@vokter.com', passwordHash, role: 'expert',
      bio: 'Asesor de negocios y emprendimiento, mentor de startups en etapa temprana.',
      skills: 'negocios,emprendimiento,finanzas,estrategia empresarial', rating: 4.6,
    },
  ]);

  await User.create({
    name: 'Usuario Demo', email: 'demo@vokter.com', passwordHash, role: 'user',
    bio: 'Cuenta de prueba para la evaluación técnica.',
  });

  await Content.bulkCreate([
    {
      title: 'Estrategia de marketing para emprendimientos',
      description: 'Diseño un plan de marketing digital completo: redes sociales, branding y captación de clientes.',
      tags: 'marketing,estrategia,redes sociales,emprendimiento',
      rating: 4.9, categoryId: categories[0].id, authorId: experts[0].id,
    },
    {
      title: 'Desarrollo de apps web y móviles a medida',
      description: 'Construcción de plataformas completas: frontend, backend y app móvil integrada.',
      tags: 'programacion,desarrollo,web,movil',
      rating: 4.7, categoryId: categories[1].id, authorId: experts[1].id,
    },
    {
      title: 'Rediseño UX/UI de producto digital',
      description: 'Investigación de usuarios, wireframes y diseño de interfaz moderna y accesible.',
      tags: 'diseno,ux,ui,producto',
      rating: 4.8, categoryId: categories[2].id, authorId: experts[2].id,
    },
    {
      title: 'Mentoría para validar tu modelo de negocio',
      description: 'Acompañamiento en estrategia, finanzas básicas y validación de mercado para tu startup.',
      tags: 'negocios,emprendimiento,finanzas',
      rating: 4.6, categoryId: categories[3].id, authorId: experts[3].id,
    },
  ]);

  console.log('✅ Seed completado. Usuarios demo (password: vokter123):');
  console.log('   - demo@vokter.com (user)');
  console.log('   - laura@vokter.com / carlos@vokter.com / sofia@vokter.com / david@vokter.com (expert)');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
