import { Meal } from "../interfaces";

export const mealQueue: Meal[] = [
  {
    id: 1,
    name: "Beef Stew",
    mode: "Preset",
    cookingTime: 5,
  },
  {
    id: 2,
    name: "Chicken",
    mode: "Custom",
    cookingTime: 1800,
    temperature: 200,
  },
  {
    id: 3,
    name: "Fish",
    mode: "Preset",
    cookingTime: 1800,
  },
];
