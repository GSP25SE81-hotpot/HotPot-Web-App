export interface Ingredient {
  ingredientId: number;
  name: string;
  description: string;
  imageURL: string;
  minStockLevel: number;
  quantity: number;
  measurementUnit: string;
  ingredientTypeID: number;
  ingredientTypeName: string;
  price: number;
  createdAt: string;
  updatedAt: string | null;
  isLowStock: boolean;
}

export interface IngredientAddSchema {
  name: string;
  description: string;
  imageURL: string | undefined;
  quantity: number;
  measurementUnit: string;
  ingredientTypeID: string;
  price: number;
  minStockLevel: number;
}

export interface IngredientTypeSchema {
  name: string;
}
