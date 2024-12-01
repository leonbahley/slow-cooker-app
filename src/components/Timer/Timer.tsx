import { CookerContext } from "../../main";
import { secondsToTime } from "../../helpers";
import { cn } from "../../utils";

export const Timer = () => {
  const cookerState = CookerContext.useSelector((state) => state);
  const cookerActor = CookerContext.useActorRef();

  return (
    <div className="shadow-md w-1/2 h-52 border rounded-md flex items-center justify-around mx-auto">
      <div className="flex gap-3 items-center">
        <span className="text-6xl font-bold">
          {secondsToTime(cookerState.context.timer)}
        </span>
        <div
          className={cn("rounded-full h-7 w-7", {
            "bg-green-500": cookerState.matches("idle"),
            "bg-orange-400": cookerState.matches({ cooking: "running" }),
            "bg-red-600": cookerState.matches("finished"),
          })}
        />
      </div>
      <div className="flex flex-col gap-2">
        {cookerState.context.recipes[0]?.mode === "Custom" && (
          <div className="flex gap-2">
            <input
              onChange={(e) =>
                cookerActor.send({
                  type: "SET_TEMPERATURE",
                  temperature: Number(e.target.value),
                })
              }
              type="number"
              className="border"
            />
            <span>C&deg;</span>
          </div>
        )}
        <button
          disabled={!cookerState.matches({ cooking: "running" })}
          className="rounded-md py-1 border enabled:hover:bg-slate-300 text-xs disabled:opacity-50 min-w-52"
          onClick={() => {
            cookerActor.send({ type: "PAUSE" });
          }}
        >
          PAUSE
        </button>
        <button
          disabled={!cookerState.matches("paused")}
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
