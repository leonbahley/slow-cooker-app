import React from "react";
import { CookerContext } from "../../main";
import { secondsToTime } from "../../helpers";
import { cn } from "../../utils";

interface IProps {
  setTemperature: (value: number) => void;
}

export const Timer: React.FC<IProps> = (props) => {
  const cookerState = CookerContext.useSelector((state) => state);
  const cookerActor = CookerContext.useActorRef();
  const [timer, setTimer] = React.useState<number>(0);

  React.useEffect(() => {
    if (!["cooking", "paused"].includes(cookerState.value)) {
      setTimer(cookerState.context.recipes[0]?.cookingTime);
      return;
    }

    let interval: ReturnType<typeof setInterval>;
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev - 1 <= 0) {
          alert("Food burning");
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    if (cookerState.value === "paused") {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [cookerState.value]);

  return (
    <div className="shadow-md w-1/2 h-52 border rounded-md flex items-center justify-around mx-auto">
      <div className="flex gap-3 items-center">
        <span className="text-6xl font-bold">{secondsToTime(timer)}</span>
        <div
          className={cn("rounded-full h-7 w-7", {
            "bg-green-500": cookerState.value === "idle",
            "bg-orange-400": cookerState.value === "cooking",
            "bg-red-600": cookerState.value === "finished",
          })}
        />
      </div>
      <div className="flex flex-col gap-2">
        {cookerState.context.recipes[0]?.mode === "Custom" && (
          <div className="flex gap-2">
            <input
              onChange={(e) => props.setTemperature(Number(e.target.value))}
              type="number"
              className="border"
            />
            <span>C&deg;</span>
          </div>
        )}
        <button
          disabled={cookerState.value !== "cooking"}
          className="rounded-md py-1 border enabled:hover:bg-slate-300 text-xs disabled:opacity-50 min-w-52"
          onClick={() => {
            cookerActor.send({ type: "PAUSE" });
          }}
        >
          PAUSE
        </button>
        <button
          disabled={cookerState.value !== "paused"}
          className="rounded-md py-1 border enabled:hover:bg-slate-300 text-xs disabled:opacity-50 min-w-52"
          onClick={() => {
            cookerActor.send({ type: "RESUME" });
          }}
        >
          RESUME
        </button>
      </div>
    </div>
  );
};
