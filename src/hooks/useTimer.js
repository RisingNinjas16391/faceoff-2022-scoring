import { useEffect, useState } from "react";
import useSound from "use-sound";
import timerService from "../lib/timer";
import useInterval from "./useInterval";

const STATES = [
  {
    key: "auto",
    display: "Autonomous",
    sound: "/start.mp3",
    duration: 30,
  },
  {
    key: "countdown",
    display: "Countdown",
    sound: "/countdown.mp3",
    duration: 8,
  },
  {
    key: "teleop",
    display: "TeleOp",
    duration: 90,
  },
  {
    key: "endgame",
    display: "End Game",
    sound: "/endgame.mp3",
    duration: 30,
  },
];

const STATE_KEYS = STATES.map((s) => s.key);

const STATE_DURATIONS = STATES.map((s) => s.duration);

const STATE_DETAILS = STATES.map((s) => ({
  key: s.key,
  display: s.display,
}));

const STATE_SOUNDS = [...STATES.map((s) => s.sound), "./finished.mp3"];

export default function useTimer() {
  const [state, setState] = useState(STATE_DETAILS[0]);
  const [stateTimer, setStateTimer] = useState(STATE_DURATIONS[0]);

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);

  const [sound, setSound] = useState("/start.mp3");
  const [play] = useSound(sound);

  useEffect(() => {
    const fetch = async () => {
      const data = await timerService.init();

      if (data) {
        const idx = STATE_KEYS.indexOf(data.state_key);

        setState(STATE_DETAILS[idx]);
        setStateTimer(data.state_duration);

        setStarted(data.started);
        setPaused(true);
      }
    };

    fetch();
  }, []);

  useInterval(() => {
    if (!started || paused || state.key === "finished") {
      return;
    }

    if (stateTimer === 1) {
      const currentIdx = STATE_KEYS.indexOf(state.key);

      if (STATE_KEYS.length - 1 === currentIdx) {
        setState({ key: "finished", display: "Finished" });
        setStateTimer(0);

        playSound();
        return;
      }

      const [details, duration] = [
        STATE_DETAILS[currentIdx + 1],
        STATE_DURATIONS[currentIdx + 1],
      ];

      setState(details);
      setStateTimer(duration);

      playSound();

      timerService.update({ ...details, duration }, started, paused);
      return;
    }

    setStateTimer((t) => t - 1);
  }, 1000);

  useInterval(() => {
    timerService
      .update({ ...state, duration: stateTimer }, started, paused)
      .then((r) => {
        console.log("Updating time database document", r);
      });
  }, 5000);

  const playSound = () => {
    if (sound !== undefined) {
      play();
    }

    setSound((sound) => STATE_SOUNDS[STATE_SOUNDS.indexOf(sound) + 1]);
  };

  const start = () => {
    timerService.start();
    setStarted(true);
    setPaused(false);

    playSound();
  };

  const toggle = () => {
    if (paused) {
      timerService.unpause();
    } else {
      timerService.pause({ ...state, stateTimer });
    }
    setPaused((paused) => !paused);
  };

  const reset = () => {
    timerService.reset(STATE_KEYS[0], STATE_DURATIONS[0]);

    setStateTimer(STATE_DURATIONS[0]);
    setState(STATE_DETAILS[0]);
    setSound(STATE_SOUNDS[0]);

    setPaused(true);
    setStarted(false);
  };

  return [{ ...state, duration: stateTimer }, start, toggle, reset, started];
}
