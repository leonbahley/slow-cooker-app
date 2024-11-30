import { assertEvent, assign, fromPromise, setup } from "xstate";
import { Meal } from "../../interfaces";
import { fetchRecipes } from "./actors/fetchRecipes";

export const slowCookerMachine = setup({
  actors: {
    fetchRecipes: fromPromise(async () => {
      const recipes = await fetchRecipes();

      return recipes;
    }),
  },
  types: {
    context: {} as { recipes: Meal[]; error: null | string },
    events: {} as
      | { type: "LOAD_RECIPES" }
      | { type: "LOAD_MEAL"; temperature: number | undefined }
      | { type: "PAUSE" }
      | { type: "FINISH" }
      | { type: "RESUME" }
      | { type: "STOP" }
      | { type: "EMPTY_COOKER" },
  },
  actions: {
    addTemperatureError: assign({
      error: ({ context, event }) => {
        assertEvent(event, "LOAD_MEAL");
        if (
          context.recipes[0].mode !== "Preset" &&
          context.recipes[0].temperature !== event.temperature
        ) {
          return "The temperature is incorrect";
        }

        return null;
      },
    }),
  },
  guards: {
    isTemperatureValid: ({ context, event }) => {
      assertEvent(event, "LOAD_MEAL");
      if (context.recipes[0].mode === "Preset") {
        return true;
      }

      return context.recipes[0].temperature === event.temperature;
    },
  },
}).createMachine({
  context: { recipes: [], error: null },
  id: "slowCooker",
  initial: "idle",
  states: {
    idle: {
      on: {
        LOAD_RECIPES: {
          target: "loadingRecipes",
        },
        LOAD_MEAL: [
          {
            guard: "isTemperatureValid",
            target: "cooking",
            actions: assign({
              error: () => null,
            }),
          },
          {
            actions: "addTemperatureError",
          },
        ],
      },
    },
    loadingRecipes: {
      invoke: {
        id: "getRecipes",
        src: "fetchRecipes",
        onDone: {
          target: "idle",
          actions: assign({ recipes: ({ event }) => event.output }),
        },
        onError: {
          target: "loadingRecipesFailed",
        },
      },
    },
    cooking: {
      on: {
        PAUSE: {
          target: "paused",
        },
        FINISH: {
          target: "finished",
        },
      },
    },
    paused: {
      on: {
        RESUME: {
          target: "cooking",
        },
        STOP: {
          target: "idle",
        },
      },
    },
    finished: {
      on: {
        EMPTY_COOKER: {
          actions: assign({
            recipes: ({ context }) => context.recipes.slice(1),
          }),
          target: "idle",
        },
      },
    },
    loadingRecipesFailed: {
      entry: assign({
        error: () => "Network request failed",
      }),
      type: "final",
    },
  },
});
