export interface Meal {
  id: number;
  name: string;
  mode: "Preset" | "Custom";
  cookingTime: number;
  temperature?: number;
}
