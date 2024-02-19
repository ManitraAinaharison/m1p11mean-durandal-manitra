export interface ServiceModel {
  name: string;
  slug: string;
  description: string;
  imgPath: string;
  subServices: SubService[];
}

export interface SubService {
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: number;
  ptgCommision: number;
  promotions: [{}];
  history: [];
} 