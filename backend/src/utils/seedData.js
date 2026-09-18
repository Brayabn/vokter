// Datos demo de VOKTER (ficticios). Se usan tanto en desarrollo como para
// inicializar la base de producción. No contienen datos personales reales.

const DEMO_PASSWORD = 'vokter123';

const CATEGORIES = [
  { name: 'Marketing', slug: 'marketing', icon: '📈' },
  { name: 'Tecnología', slug: 'tecnologia', icon: '💻' },
  { name: 'Diseño', slug: 'diseno', icon: '🎨' },
  { name: 'Negocios', slug: 'negocios', icon: '💼' },
  { name: 'Educación', slug: 'educacion', icon: '🎓' },
];

const EXPERTS = [
  {
    name: 'Laura Martínez', email: 'laura@vokter.com', role: 'expert',
    bio: 'Consultora de marketing digital con 8 años de experiencia en estrategia de marca.',
    skills: 'marketing,estrategia,redes sociales,branding', rating: 4.9,
  },
  {
    name: 'Miguel Torres', email: 'miguel@vokter.com', role: 'expert',
    bio: 'Especialista en SEO y marketing de contenidos para negocios en crecimiento.',
    skills: 'marketing,seo,contenido,posicionamiento', rating: 4.5,
  },
  {
    name: 'Carlos Ramírez', email: 'carlos@vokter.com', role: 'expert',
    bio: 'Desarrollador full-stack especializado en aplicaciones web y móviles.',
    skills: 'programacion,desarrollo,web,movil,react', rating: 4.7,
  },
  {
    name: 'Valentina Cruz', email: 'valentina@vokter.com', role: 'expert',
    bio: 'Ingeniera de datos, ayuda a empresas a automatizar procesos con inteligencia artificial.',
    skills: 'tecnologia,datos,inteligencia artificial,automatizacion', rating: 4.8,
  },
  {
    name: 'Sofía Torres', email: 'sofia@vokter.com', role: 'expert',
    bio: 'Diseñadora UX/UI enfocada en productos digitales centrados en el usuario.',
    skills: 'diseno,ux,ui,producto,figma', rating: 4.8,
  },
  {
    name: 'Andrés Paredes', email: 'andres@vokter.com', role: 'expert',
    bio: 'Diseñador de marca e identidad visual para startups y negocios locales.',
    skills: 'diseno,branding,identidad visual,ilustracion', rating: 4.6,
  },
  {
    name: 'David Gómez', email: 'david@vokter.com', role: 'expert',
    bio: 'Asesor de negocios y emprendimiento, mentor de startups en etapa temprana.',
    skills: 'negocios,emprendimiento,finanzas,estrategia empresarial', rating: 4.6,
  },
  {
    name: 'Camila Rojas', email: 'camila@vokter.com', role: 'expert',
    bio: 'Contadora y asesora financiera, ayuda a pequeños negocios a ordenar sus finanzas.',
    skills: 'negocios,finanzas,contabilidad,presupuesto', rating: 4.7,
  },
  {
    name: 'Ana Rodríguez', email: 'ana@vokter.com', role: 'expert',
    bio: 'Profesora de idiomas con experiencia en enseñanza personalizada en línea.',
    skills: 'educacion,idiomas,tutorias,enseñanza', rating: 4.9,
  },
  {
    name: 'Julián Méndez', email: 'julian@vokter.com', role: 'expert',
    bio: 'Tutor de matemáticas y ciencias para estudiantes de secundaria y universidad.',
    skills: 'educacion,matematicas,tutorias,ciencias', rating: 4.7,
  },
];

const DEMO_USER = {
  name: 'Usuario Demo', email: 'demo@vokter.com', role: 'user',
  bio: 'Cuenta de prueba para la evaluación técnica.',
};

// categorySlug / authorEmail se resuelven a ids al sembrar.
const CONTENTS = [
  {
    title: 'Estrategia de marketing para emprendimientos',
    description: 'Diseño un plan de marketing digital completo: redes sociales, branding y captación de clientes.',
    tags: 'marketing,estrategia,redes sociales,emprendimiento',
    rating: 4.9, categorySlug: 'marketing', authorEmail: 'laura@vokter.com',
  },
  {
    title: 'Optimización SEO y contenido que convierte',
    description: 'Auditoría SEO y estrategia de contenido para mejorar tu posicionamiento orgánico.',
    tags: 'seo,contenido,marketing,posicionamiento',
    rating: 4.5, categorySlug: 'marketing', authorEmail: 'miguel@vokter.com',
  },
  {
    title: 'Desarrollo de apps web y móviles a medida',
    description: 'Construcción de plataformas completas: frontend, backend y app móvil integrada.',
    tags: 'programacion,desarrollo,web,movil',
    rating: 4.7, categorySlug: 'tecnologia', authorEmail: 'carlos@vokter.com',
  },
  {
    title: 'Automatización de procesos con IA',
    description: 'Implemento soluciones de inteligencia artificial para automatizar tareas repetitivas en tu negocio.',
    tags: 'inteligencia artificial,datos,automatizacion,tecnologia',
    rating: 4.8, categorySlug: 'tecnologia', authorEmail: 'valentina@vokter.com',
  },
  {
    title: 'Rediseño UX/UI de producto digital',
    description: 'Investigación de usuarios, wireframes y diseño de interfaz moderna y accesible.',
    tags: 'diseno,ux,ui,producto',
    rating: 4.8, categorySlug: 'diseno', authorEmail: 'sofia@vokter.com',
  },
  {
    title: 'Identidad visual y branding para tu marca',
    description: 'Logo, paleta de colores y sistema visual completo para diferenciar tu negocio.',
    tags: 'branding,identidad visual,diseno',
    rating: 4.6, categorySlug: 'diseno', authorEmail: 'andres@vokter.com',
  },
  {
    title: 'Mentoría para validar tu modelo de negocio',
    description: 'Acompañamiento en estrategia, finanzas básicas y validación de mercado para tu startup.',
    tags: 'negocios,emprendimiento,finanzas',
    rating: 4.6, categorySlug: 'negocios', authorEmail: 'david@vokter.com',
  },
  {
    title: 'Orden financiero para pequeños negocios',
    description: 'Organizo tu contabilidad y presupuesto para que tomes mejores decisiones financieras.',
    tags: 'finanzas,contabilidad,presupuesto,negocios',
    rating: 4.7, categorySlug: 'negocios', authorEmail: 'camila@vokter.com',
  },
  {
    title: 'Clases personalizadas de inglés',
    description: 'Aprende inglés a tu ritmo con clases adaptadas a tu nivel y objetivos.',
    tags: 'idiomas,ingles,educacion,tutorias',
    rating: 4.9, categorySlug: 'educacion', authorEmail: 'ana@vokter.com',
  },
  {
    title: 'Tutorías de matemáticas y ciencias',
    description: 'Refuerzo académico para estudiantes de secundaria y primeros semestres de universidad.',
    tags: 'matematicas,ciencias,tutorias,educacion',
    rating: 4.7, categorySlug: 'educacion', authorEmail: 'julian@vokter.com',
  },
];

module.exports = { DEMO_PASSWORD, CATEGORIES, EXPERTS, DEMO_USER, CONTENTS };
