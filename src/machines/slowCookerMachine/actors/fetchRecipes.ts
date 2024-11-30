import { Meal } from "../../../interfaces";
import { mealQueue } from "../../../mocks";

export const fetchRecipes = (): Promise<Meal[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(mealQueue);
    }, 2000);
  });
