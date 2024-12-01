import { assign, fromPromise, setup } from "xstate";
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
    context: {} as {
      recipes: Meal[];
      error: null | string;
      timer: number;
      temperature: number;
    },
    events: {} as
      | { type: "LOAD_RECIPES" }
      | { type: "SET_TEMPERATURE"; temperature: number }
      | { type: "LOAD_MEAL" }
      | { type: "PAUSE" }
      | { type: "FINISH" }
      | { type: "RESUME" }
      | { type: "STOP" }
      | { type: "EMPTY_COOKER" },
  },
  actions: {
    addTemperatureError: assign({
      error: ({ context }) => {
        if (
          context.recipes[0].mode !== "Preset" &&
          context.recipes[0].temperature !== context.temperature
        ) {
          return "The temperature is incorrect";
        }

        return null;
      },
    }),
  },
  guards: {
    isTemperatureValid: ({ context }) => {
      if (context.recipes[0].mode === "Preset") {
        return true;
      }

      return context.recipes[0].temperature === context.temperature;
    },
  },
}).createMachine({
  context: { recipes: [], error: null, timer: 0, temperature: 0 },
  id: "slowCooker",
  initial: "idle",
  states: {
    idle: {
      on: {
        LOAD_RECIPES: {
          target: "loadingRecipes",
        },
        SET_TEMPERATURE: {
          actions: assign({ temperature: ({ event }) => event.temperature }),
        },
        LOAD_MEAL: [
          {
            guard: "isTemperatureValid",
            target: "cooking",
            actions: assign({
              error: () => null,
              timer: ({ context }) => context.recipes[0].cookingTime,
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
      initial: "running",
      states: {
        running: {
          after: {
            1000: [
              {
                guard: ({ context }) => !!context.timer,
                actions: assign({
                  timer: ({ context }) => context.timer - 1,
                }),
                target: "#slowCooker.cooking",
              },
              { target: "#slowCooker.finished" },
            ],
          },
          on: {
            PAUSE: {
              target: "#slowCooker.paused",
            },
            FINISH: {
              target: "#slowCooker.finished",
            },
          },
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
            timer: 0,
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
