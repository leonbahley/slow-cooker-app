import React from "react";
import { CookerContext } from "./main";
import { MealCard } from "./components/MealCard";
import { Timer } from "./components/Timer";
import { MealListSkeleton } from "./components/MealListSkeleton";
import { Controls } from "./components/Controls";

export const App = () => {
  const cookerActor = CookerContext.useActorRef();
  const cookerState = CookerContext.useSelector((state) => state);

  React.useEffect(() => {
    cookerActor.send({ type: "LOAD_RECIPES" });
  }, []);

  return (
    <main className="py-4">
      <h1 className="text-5xl text-center mb-11">SlowCooker App</h1>
      {cookerState.matches("loadingRecipes") ? (
        <MealListSkeleton />
      ) : (
        <ul className="flex gap-6 flex-wrap justify-center items-center">
          {cookerState.context.recipes.map((item) => (
            <MealCard key={item.id} meal={item} />
          ))}
        </ul>
      )}
      {cookerState.context.error && (
        <p className="text-center text-red-600 mx-auto mt-10">
          {cookerState.context.error}
        </p>
      )}
      <Controls />
      <Timer />
      {(cookerState.matches("paused") ||
        cookerState.matches({ cooking: "running" })) && (
        <h2 className="text-center mt-5 text-2xl">
          You are cooking You are cooking {cookerState.context.recipes[0].name}
        </h2>
      )}
    </main>
  );
};
