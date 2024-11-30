import React from "react";
import { Meal } from "../../interfaces";
import { secondsToTime } from "../../helpers";
import { cn } from "../../utils";
import { CookerContext } from "../../main";

interface IProps {
  meal: Meal;
}

export const MealCard: React.FC<IProps> = (props) => {
  const mealList = CookerContext.useSelector((state) => state.context.recipes);
  return (
    <li
      className={cn("shadow-md min-h-64 min-w-64 border rounded-lg py-1 px-3", {
        "min-h-72 min-w-72": mealList[0].id === props.meal.id,
      })}
    >
      <h3 className="text-lg font-bold text-center mb-2">{props.meal.name}</h3>
      <div className="flex gap-2">
        <p>Cooking time:</p>
        <span className="font-semibold">
          {secondsToTime(props.meal.cookingTime)}
        </span>
      </div>
      {props.meal.temperature && (
        <div className="flex gap-2">
          <p>Temperature:</p>
          <span className="font-semibold">{props.meal.temperature}&deg;</span>
        </div>
      )}
    </li>
  );
};
