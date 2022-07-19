import { client } from "./supabase";

const init = async () => {
  await pause();

  const { response, status, error } = await client
    .from("timer")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || status !== 200) {
    console.error(error);
    return;
  }

  console.log(response);

  return response;
};

const start = async () => {
  const { response, error } = await client
    .from("timer")
    .update({ started: true, started_at: Date.now() })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return response;
};

const pause = async (timeLeft) => {
  const { response, error } = await client
    .from("timer")
    .update({ paused: true, duration: timeLeft })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return;
  }

  return response;
};

const unpause = async () => {
  const { response, error } = await client
    .from("timer")
    .update({ paused: false });

  if (error) {
    console.error(error);
  }
};

const timerService = { init, start, pause, unpause };
export default timerService;
