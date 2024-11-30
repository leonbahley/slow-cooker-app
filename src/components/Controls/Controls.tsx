import React from "react";
import { CookerContext } from "../../main";

interface IProps {
  temperature: number | undefined;
}

export const Controls: React.FC<IProps> = (props) => {
  const cookerActor = CookerContext.useActorRef();
  const cookerState = CookerContext.useSelector((state) => state);

  return (
    <div className="flex gap-5 my-10 justify-center">
      <button
        disabled={
          !cookerState.context.recipes.length || cookerState.value !== "idle"
        }
        className="btn-primary"
        onClick={() => {
          cookerActor.send({
            type: "LOAD_MEAL",
            temperature: props.temperature,
          });
        }}
      >
        LOAD MEAL
      </button>
      <button
        disabled={cookerState.value !== "cooking"}
        className="btn-primary"
        onClick={() => {
          cookerActor.send({ type: "FINISH" });
        }}
      >
        FINISH COOKING
      </button>
      <button
        disabled={cookerState.value !== "finished"}
        className="btn-primary"
        onClick={() => {
          cookerActor.send({ type: "EMPTY_COOKER" });
        }}
      >
        EMPTY COOKER
      </button>
      <button
        disabled={cookerState.value !== "paused"}
        className="btn-primary"
        onClick={() => {
          cookerActor.send({ type: "STOP" });
        }}
      >
        STOP COOKING
      </button>
    </div>
  );
};
