export interface Ingredient {
  ingredientId: number;
  quantity: number;
}

export interface CreateHotPotFormSchema {
  name: string;
  description: string;
  imageURLs: (string | undefined)[] | undefined;
  size: number;
  tutorialVideo: {
    name: string;
    description: string;
  };
  ingredients: Ingredient[] | undefined;
}
export interface CreateHotPotSchema {
  name: string;
  material: string;
  size: string;
  description: string;
  imageURLs: (string | undefined)[] | undefined;
  price: number;
  basePrice: number;
  status: boolean;
  seriesNumbers: (string | undefined)[] | undefined;
}

export const SizeData = [
  {
    id: "S",
    name: "size S",
  },
  {
    id: "M",
    name: "size  M",
  },
  {
    id: "L",
    name: "size L",
  },
];

export interface CreateHotPotCustomFormSchema {
  name: string;
  groupIdentifier?: string;
  imageURLs: (string | undefined)[] | undefined;
  size: number;
  tutorialVideo: {
    name: string;
    description: string;
  };
  ingredients: IngredientTypeProps[] | undefined;
}

export interface IngredientTypeProps {
  ingredientTypeId: number;
  minQuantity: number;
}
