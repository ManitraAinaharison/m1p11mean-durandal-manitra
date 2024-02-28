export interface TreeParent {
  text: string;
  items?: TreeChild[];
}

export interface TreeChild {
  text: string;
  value: any;
}
