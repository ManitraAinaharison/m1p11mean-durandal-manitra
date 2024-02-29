module.exports.services = services = [
  {
    name: "Coiffure",
    description:
      "Offrez-vous une parenthèse de détente et de beauté avec notre service de coiffure. Nos experts sauront sublimer votre chevelure et vous offrir un style unique qui vous ressemble. Découvrez un moment de bien-être où chaque coupe, chaque couleur est pensée pour révéler votre beauté naturelle.",
    imgPath: "/path/of/coiffure/img",
    subServices: [
      {
        name: "Coupe de cheveux pour femmes",
        price: 30,
        duration: 7200,
        description:
          "Transformation de votre look avec une coupe tendance et adaptée à votre style.",
        ptgCommission: 20,
        slug: "coupe-de-cheuveux-pour-femmes",
      },
      {
        name: "Coupe homme",
        price: 20,
        duration: 1800,
        description:
          "Une coupe précise pour une allure impeccable, réalisée en un temps record.",
        ptgCommission: 20,
        slug: "coupe-homme",
      },
      {
        name: "Teinture de cheveux",
        price: 60,
        duration: 3600,
        description:
          "Ravivez votre couleur ou osez un changement radical avec notre teinture professionnelle.",
        ptgCommission: 20,
        slug: "teinture-de-cheuveux",
      },
      {
        name: "Décoloration",
        price: 20,
        duration: 3600,
        description:
          "Optez pour une décoloration maîtrisée pour un look audacieux et moderne.",
        ptgCommission: 20,
        slug: "decoloration",
      },
      {
        name: "Shampoing et mise en plis",
        price: 59,
        duration: 5400,
        description:
          "Détendez-vous et profitez d'un moment de soin avec notre shampoing revitalisant et notre mise en plis professionnelle.",
        ptgCommission: 20,
        slug: "shampoing-et-mise-en-plis",
      },
      {
        name: "Coiffure de mariage",
        price: 99,
        duration: 7200,
        description:
          "Sublimez votre journée spéciale avec une coiffure élégante et sophistiquée.",
        ptgCommission: 20,
        slug: "coiffure-de-mariage",
      },
    ],
    slug: "coiffure",
  },
  {
    name: "Manucure",
    description:
      "Découvrez nos services de manucure pour des ongles impeccables. Profitez d'une pause détente et laissez nos professionnels prendre soin de vos mains.",
    imgPath: "/path/of/manucure/img",
    subServices: [
      {
        name: "Manucure Express",
        price: 35,
        duration: 1800,
        description:
          "Un soin express pour des ongles impeccables en un rien de temps.",
        ptgCommission: 15,
        slug: "manucure-express",
      },
      {
        name: "Pose de Vernis",
        price: 20,
        duration: 1200,
        description: "Un vernis de couleur pour sublimer vos ongles.",
        ptgCommission: 10,
        slug: "pose-de-vernis",
      },
      {
        name: "Soin des Mains",
        price: 45,
        duration: 2400,
        description:
          "Un soin hydratant et nourrissant pour des mains douces et soignées.",
        ptgCommission: 20,
        slug: "soin-des-mains",
      },
      {
        name: "French Manucure",
        price: 40,
        duration: 2100,
        description: "Une manucure élégante avec un bord blanc classique.",
        ptgCommission: 18,
        slug: "french-manucure",
      },
      {
        name: "Traitement des Cuticules",
        price: 25,
        duration: 1500,
        description: "Un soin pour nourrir et hydrater les cuticules.",
        ptgCommission: 12,
        slug: "traitement-des-cuticules",
      },
    ],
    slug: "manucure",
  },
  {
    name: "Massage",
    description:
      "Plongez dans un univers de relaxation avec nos différents massages. Laissez-vous dorloter par nos masseurs professionnels et oubliez le stress du quotidien.",
    imgPath: "/path/of/massage/img",
    subServices: [
      {
        name: "Massage Relaxant",
        price: 80,
        duration: 3600,
        description:
          "Un massage doux et relaxant pour libérer les tensions et apaiser l'esprit.",
        ptgCommission: 25,
        slug: "massage-relaxant",
      },
      {
        name: "Massage Thaï",
        price: 90,
        duration: 4200,
        description:
          "Un massage traditionnel thaïlandais pour rééquilibrer le corps et l'esprit.",
        ptgCommission: 30,
        slug: "massage-thai",
      },
      {
        name: "Massage aux Pierres Chaudes",
        price: 100,
        duration: 4500,
        description:
          "Un massage relaxant utilisant des pierres chaudes pour détendre les muscles en profondeur.",
        ptgCommission: 35,
        slug: "massage-aux-pierres-chaudes",
      },
      {
        name: "Massage Sportif",
        price: 85,
        duration: 3900,
        description:
          "Un massage tonique pour préparer les muscles à l'effort ou favoriser leur récupération après l'effort.",
        ptgCommission: 28,
        slug: "massage-sportif",
      },
      {
        name: "Massage du Dos",
        price: 50,
        duration: 2400,
        description:
          "Un massage ciblé sur le dos pour soulager les tensions et les douleurs musculaires.",
        ptgCommission: 20,
        slug: "massage-du-dos",
      },
    ],
    slug: "massage",
  },
  {
    name: "Maquillage",
    description:
      "Révélez votre beauté avec notre service de maquillage. Nos maquilleurs professionnels vous proposent un maquillage adapté à vos envies et à votre style.",
    imgPath: "/path/of/maquillage/img",
    subServices: [
      {
        name: "Maquillage de Soirée",
        price: 50,
        duration: 2700,
        description: "Un maquillage sophistiqué pour briller en soirée.",
        ptgCommission: 20,
        slug: "maquillage-de-soiree",
      },
      {
        name: "Maquillage Mariée",
        price: 80,
        duration: 3600,
        description:
          "Un maquillage élégant et naturel pour sublimer la mariée.",
        ptgCommission: 30,
        slug: "maquillage-mariee",
      },
      {
        name: "Maquillage Artistique",
        price: 60,
        duration: 3000,
        description:
          "Un maquillage créatif pour des événements spéciaux ou des séances photo.",
        ptgCommission: 25,
        slug: "maquillage-artistique",
      },
      {
        name: "Maquillage Yeux Smoky",
        price: 40,
        duration: 1800,
        description: "Un maquillage fumé pour un regard intense et séduisant.",
        ptgCommission: 15,
        slug: "maquillage-yeux-smoky",
      },
    ],
    slug: "maquillage",
  },
  {
    name: "Soins du Visage",
    description:
      "Prenez soin de votre peau avec nos soins du visage personnalisés. Retrouvez une peau éclatante et lumineuse grâce à nos esthéticiennes expertes.",
    imgPath: "/path/of/soins-visage/img",
    subServices: [],
    slug: "soins-du-visage",
  },
].map((service) => ({
  ...service,
  isDeleted: false,
}));

module.exports.subServices = subServices = services
  .map((service) => service.subServices)
  .flat(1);
