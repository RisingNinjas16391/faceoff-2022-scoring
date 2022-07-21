import { client } from "./supabase";

const init = async () => {
  const { data, error } = await client
    .from("timer")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const start = async () => {
  const { data, error } = await client
    .from("timer")
    .update({
      started: true,
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const pause = async (state) => {
  const { data, error } = await client
    .from("timer")
    .update({
      paused: true,
      state_key: state.key,
      state_duration: state.stateTimer,
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const update = async (state, started, paused) => {
  const { data, error } = await client
    .from("timer")
    .update({
      started,
      paused,
      state_key: state.key,
      state_duration: state.duration,
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const unpause = async () => {
  const { data, error } = await client
    .from("timer")
    .update({ paused: false })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const reset = async (key, duration) => {
  const { data, error } = await client
    .from("timer")
    .update({
      state_key: key,
      state_duration: duration,
      started: false,
      paused: true,
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const timerService = { init, start, pause, unpause, update, reset };
export default timerService;
