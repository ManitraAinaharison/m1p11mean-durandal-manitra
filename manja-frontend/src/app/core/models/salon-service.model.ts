export interface ServiceModel {
  name: string;
  slug: string;
  description: string;
  imgPath: string;
  subServices: SubServiceModel[];
}

export interface SubServiceModel {
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: number;
  ptgCommision: number;
  promotions: [{}];
  history: [];
} 