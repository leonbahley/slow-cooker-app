import { intervalToDuration } from "date-fns";

export const secondsToTime = (time: number) => {
  const hours =
    intervalToDuration({ start: 0, end: time * 1000 }).hours || "00";
  const minutes =
    intervalToDuration({ start: 0, end: time * 1000 }).minutes || "00";
  const seconds =
    intervalToDuration({ start: 0, end: time * 1000 }).seconds || "00";

  return `${hours} : ${minutes} : ${seconds}`;
};
