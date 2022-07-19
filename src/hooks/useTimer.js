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
    const fetch = async () => {
      const data = await timerService.init();

      if (data) {
        setTimer(data.duration);

        setStarted(data.started);
        setPaused(true);
      }
    };

    fetch();
  }, []);

  useInterval(() => {
    if (!started || paused || timer === 0) {
      return;
    }

    setTimer((timer) => timer - 1);
  }, 1000);

  useInterval(() => {
    timerService.update(timer, started, paused);
    console.log("Updating time database document");
  }, 5000);

  const start = () => {
    timerService.start();
    setStarted(true);
  };

  const toggle = () => {
    if (paused) {
      timerService.unpause(timer);
    } else {
      timerService.pause(timer);
    }
    setPaused((paused) => !paused);
  };

  const reset = () => {
    timerService.reset();

    setPaused(true);
    setStarted(false);
    setTimer(150);
  };

  return [timer, start, toggle, reset, paused, started];
}
