export interface ServiceModel {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  imgPath: string;
  subServices: SubServiceModel[];
}

export interface SubServiceModel {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: number;
  ptgCommission: number;
  promotions?: [{}];
  history?: [];
}

export interface ServiceMinimalData extends Pick<ServiceModel, 'slug' | 'name'>{}
