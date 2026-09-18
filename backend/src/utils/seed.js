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
  const cat = Object.fromEntries(categories.map((c) => [c.slug, c]));

  const experts = await User.bulkCreate([
    {
      name: 'Laura Martínez', email: 'laura@vokter.com', passwordHash, role: 'expert',
      bio: 'Consultora de marketing digital con 8 años de experiencia en estrategia de marca.',
      skills: 'marketing,estrategia,redes sociales,branding', rating: 4.9,
    },
    {
      name: 'Miguel Torres', email: 'miguel@vokter.com', passwordHash, role: 'expert',
      bio: 'Especialista en SEO y marketing de contenidos para negocios en crecimiento.',
      skills: 'marketing,seo,contenido,posicionamiento', rating: 4.5,
    },
    {
      name: 'Carlos Ramírez', email: 'carlos@vokter.com', passwordHash, role: 'expert',
      bio: 'Desarrollador full-stack especializado en aplicaciones web y móviles.',
      skills: 'programacion,desarrollo,web,movil,react', rating: 4.7,
    },
    {
      name: 'Valentina Cruz', email: 'valentina@vokter.com', passwordHash, role: 'expert',
      bio: 'Ingeniera de datos, ayuda a empresas a automatizar procesos con inteligencia artificial.',
      skills: 'tecnologia,datos,inteligencia artificial,automatizacion', rating: 4.8,
    },
    {
      name: 'Sofía Torres', email: 'sofia@vokter.com', passwordHash, role: 'expert',
      bio: 'Diseñadora UX/UI enfocada en productos digitales centrados en el usuario.',
      skills: 'diseno,ux,ui,producto,figma', rating: 4.8,
    },
    {
      name: 'Andrés Paredes', email: 'andres@vokter.com', passwordHash, role: 'expert',
      bio: 'Diseñador de marca e identidad visual para startups y negocios locales.',
      skills: 'diseno,branding,identidad visual,ilustracion', rating: 4.6,
    },
    {
      name: 'David Gómez', email: 'david@vokter.com', passwordHash, role: 'expert',
      bio: 'Asesor de negocios y emprendimiento, mentor de startups en etapa temprana.',
      skills: 'negocios,emprendimiento,finanzas,estrategia empresarial', rating: 4.6,
    },
    {
      name: 'Camila Rojas', email: 'camila@vokter.com', passwordHash, role: 'expert',
      bio: 'Contadora y asesora financiera, ayuda a pequeños negocios a ordenar sus finanzas.',
      skills: 'negocios,finanzas,contabilidad,presupuesto', rating: 4.7,
    },
    {
      name: 'Ana Rodríguez', email: 'ana@vokter.com', passwordHash, role: 'expert',
      bio: 'Profesora de idiomas con experiencia en enseñanza personalizada en línea.',
      skills: 'educacion,idiomas,tutorias,enseñanza', rating: 4.9,
    },
    {
      name: 'Julián Méndez', email: 'julian@vokter.com', passwordHash, role: 'expert',
      bio: 'Tutor de matemáticas y ciencias para estudiantes de secundaria y universidad.',
      skills: 'educacion,matematicas,tutorias,ciencias', rating: 4.7,
    },
  ]);
  const expert = Object.fromEntries(experts.map((e) => [e.email, e]));

  await User.create({
    name: 'Usuario Demo', email: 'demo@vokter.com', passwordHash, role: 'user',
    bio: 'Cuenta de prueba para la evaluación técnica.',
  });

  await Content.bulkCreate([
    {
      title: 'Estrategia de marketing para emprendimientos',
      description: 'Diseño un plan de marketing digital completo: redes sociales, branding y captación de clientes.',
      tags: 'marketing,estrategia,redes sociales,emprendimiento',
      rating: 4.9, categoryId: cat.marketing.id, authorId: expert['laura@vokter.com'].id,
    },
    {
      title: 'Optimización SEO y contenido que convierte',
      description: 'Auditoría SEO y estrategia de contenido para mejorar tu posicionamiento orgánico.',
      tags: 'seo,contenido,marketing,posicionamiento',
      rating: 4.5, categoryId: cat.marketing.id, authorId: expert['miguel@vokter.com'].id,
    },
    {
      title: 'Desarrollo de apps web y móviles a medida',
      description: 'Construcción de plataformas completas: frontend, backend y app móvil integrada.',
      tags: 'programacion,desarrollo,web,movil',
      rating: 4.7, categoryId: cat.tecnologia.id, authorId: expert['carlos@vokter.com'].id,
    },
    {
      title: 'Automatización de procesos con IA',
      description: 'Implemento soluciones de inteligencia artificial para automatizar tareas repetitivas en tu negocio.',
      tags: 'inteligencia artificial,datos,automatizacion,tecnologia',
      rating: 4.8, categoryId: cat.tecnologia.id, authorId: expert['valentina@vokter.com'].id,
    },
    {
      title: 'Rediseño UX/UI de producto digital',
      description: 'Investigación de usuarios, wireframes y diseño de interfaz moderna y accesible.',
      tags: 'diseno,ux,ui,producto',
      rating: 4.8, categoryId: cat.diseno.id, authorId: expert['sofia@vokter.com'].id,
    },
    {
      title: 'Identidad visual y branding para tu marca',
      description: 'Logo, paleta de colores y sistema visual completo para diferenciar tu negocio.',
      tags: 'branding,identidad visual,diseno',
      rating: 4.6, categoryId: cat.diseno.id, authorId: expert['andres@vokter.com'].id,
    },
    {
      title: 'Mentoría para validar tu modelo de negocio',
      description: 'Acompañamiento en estrategia, finanzas básicas y validación de mercado para tu startup.',
      tags: 'negocios,emprendimiento,finanzas',
      rating: 4.6, categoryId: cat.negocios.id, authorId: expert['david@vokter.com'].id,
    },
    {
      title: 'Orden financiero para pequeños negocios',
      description: 'Organizo tu contabilidad y presupuesto para que tomes mejores decisiones financieras.',
      tags: 'finanzas,contabilidad,presupuesto,negocios',
      rating: 4.7, categoryId: cat.negocios.id, authorId: expert['camila@vokter.com'].id,
    },
    {
      title: 'Clases personalizadas de inglés',
      description: 'Aprende inglés a tu ritmo con clases adaptadas a tu nivel y objetivos.',
      tags: 'idiomas,ingles,educacion,tutorias',
      rating: 4.9, categoryId: cat.educacion.id, authorId: expert['ana@vokter.com'].id,
    },
    {
      title: 'Tutorías de matemáticas y ciencias',
      description: 'Refuerzo académico para estudiantes de secundaria y primeros semestres de universidad.',
      tags: 'matematicas,ciencias,tutorias,educacion',
      rating: 4.7, categoryId: cat.educacion.id, authorId: expert['julian@vokter.com'].id,
    },
  ]);

  console.log('✅ Seed completado. Usuarios demo (password: vokter123):');
  console.log('   - demo@vokter.com (user)');
  console.log('   - 10 expertos: laura, miguel, carlos, valentina, sofia, andres, david, camila, ana, julian @vokter.com');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en el seed:', err);
  process.exit(1);
});
