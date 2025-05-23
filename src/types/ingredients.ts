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
  unit: string;
  minStockLevel: number;
  price: number;
  ingredientTypeID: number;
  measurementValue: number;
}

export interface IngredientType {
  id: string;
  name: string;
}

export interface IngredientTypeSchema {
  name: string;
}
