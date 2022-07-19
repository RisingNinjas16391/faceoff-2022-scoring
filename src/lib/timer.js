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

const pause = async (duration) => {
  const { data, error } = await client
    .from("timer")
    .update({ paused: true, duration })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const update = async (duration, started, paused) => {
  const { data, error } = await client
    .from("timer")
    .update({ duration, started, paused })
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

const reset = async () => {
  const { data, error } = await client
    .from("timer")
    .update({ duration: 150, started: false, paused: true })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return data;
};

const timerService = { init, start, pause, unpause, update, reset };
export default timerService;
