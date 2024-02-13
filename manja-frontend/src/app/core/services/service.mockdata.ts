import { ServiceModel, SubService } from '../models/salon-service.model';

export const salonServiceMockData: ServiceModel[] = [
  {
    name: 'Hair Styling',
    slug: 'hair-styling',
    description: 'Various hair styling services',
    imgPath:
      'https://assets-global.website-files.com/60993dcfc8e83c6e36ae8b81/60a5aef88e07303a3df5cd5b_makeup-salon-webflow-template.jpg',
    subServices: [
      {
        name: 'Hair Coloring',
        slug: '',
        description: 'Get a fresh hair color!',
        duration: 120,
        price: 80,
        ptgCommision: 0.15,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Men Haircut',
        slug: 'men-haircut',
        description: "Classic men's haircut",
        duration: 30,
        price: 25,
        ptgCommision: 0.12,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Blowout',
        slug: 'blowout',
        description: 'Professional blow-dry styling',
        duration: 45,
        price: 40,
        ptgCommision: 0.1,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Updo',
        slug: 'updo',
        description: 'Elegant updo hairstyles',
        duration: 60,
        price: 60,
        ptgCommision: 0.18,
        promotions: [{}],
        history: [],
      },
    ],
  },
  {
    name: 'Makeup Artistry',
    slug: 'makeup-artistry',
    description: 'Expert makeup services',
    imgPath:
      'https://assets-global.website-files.com/60993dcfc8e83c6e36ae8b81/60a5aef88e07303a3df5cd5b_makeup-salon-webflow-template.jpg',
    subServices: [
      {
        name: 'Bridal Makeup',
        slug: 'bridal-makeup',
        description: 'Gorgeous bridal makeup',
        duration: 90,
        price: 150,
        ptgCommision: 0.2,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Evening Glam',
        slug: 'evening-glam',
        description: 'Dramatic evening makeup',
        duration: 60,
        price: 80,
        ptgCommision: 0.18,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Natural Look',
        slug: 'natural-look',
        description: 'Subtle and natural makeup',
        duration: 45,
        price: 60,
        ptgCommision: 0.15,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Airbrush Makeup',
        slug: 'airbrush-makeup-look',
        description: 'Flawless airbrush makeup',
        duration: 75,
        price: 120,
        ptgCommision: 0.17,
        promotions: [{}],
        history: [],
      },
    ],
  },
  {
    name: 'Nail Services',
    slug: 'nail-services',
    description: 'Beautiful nail treatments',
    imgPath:
      'https://assets-global.website-files.com/60993dcfc8e83c6e36ae8b81/60a5aef88e07303a3df5cd5b_makeup-salon-webflow-template.jpg',
    subServices: [
      {
        name: 'Manicure',
        slug: 'manicure',
        description: 'Classic nail grooming',
        duration: 45,
        price: 35,
        ptgCommision: 0.2,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Pedicure',
        slug: 'pedicure',
        description: 'Relaxing foot care',
        duration: 60,
        price: 50,
        ptgCommision: 0.18,
        promotions: [{}],
        history: [],
      },
      // Add 3 more nail-related sub-services
      // ...
    ],
  },
  {
    name: 'Facial Treatments',
    slug: 'facial-treatments',
    description: 'Revitalize your skin',
    imgPath:
      'https://assets-global.website-files.com/60993dcfc8e83c6e36ae8b81/60a5aef88e07303a3df5cd5b_makeup-salon-webflow-template.jpg',
    subServices: [
      {
        name: 'Deep Cleansing Facial',
        slug: 'deep-cleansing-facial',
        description: 'Thorough skin cleansing',
        duration: 75,
        price: 90,
        ptgCommision: 0.15,
        promotions: [{}],
        history: [],
      },
      {
        name: 'Anti-Aging Facial',
        slug: 'anti-aging-facial',
        description: 'Combat signs of aging',
        duration: 90,
        price: 120,
        ptgCommision: 0.17,
        promotions: [{}],
        history: [],
      },
      // Add 3 more facial-related sub-services
      // ...
    ],
  },
];

export const subServiceMockData: SubService[] = salonServiceMockData
  .map((s) => s.subServices)
  .flat();
