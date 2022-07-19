import { useEffect, useState } from "react";
import { useClient } from "../lib/supabase";
import timerService from "../lib/timer";
import useInterval from "./useInterval";

export default function useTimer() {
  const client = useClient();

  const [timer, setTimer] = useState(150);

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    timerService.init();
  }, []);

  useInterval(() => {
    if (!started || paused || timer === 0) {
      return;
    }

    setTimer((timer) => timer - 1);
  }, 1000);

  const start = () => {
    timerService.start();
    setStarted(true);
  };

  const pause = () => {
    timerService.pause(timer);
    setPaused(true);
  };

  const unpause = () => {
    timerService.unpause();
    setPaused(false);
  };

  return [timer, start, pause];
}
