
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  categoryId: string;
}

export interface SelectedPlace extends Place {
  order: number;
}

export interface MapPosition {
  x: number;
  y: number;
}

export interface CategorySelection {
  categoryId: string;
  placeId: string;
}
