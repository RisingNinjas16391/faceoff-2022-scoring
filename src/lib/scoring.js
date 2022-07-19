import { DEFAULTS } from "../components/ScoringPage";
import { client } from "./supabase";

const setPoints = async (team, points, data) => {
  const { response, error } = await client
    .from("points")
    .update({ points, data })
    .eq("team", team);

  if (error) {
    console.error(error);
    return;
  }

  return response;
};

const fetchTeam = async (team) => {
  const { data, status, error } = await client
    .from("points")
    .select("*")
    .eq("team", team)
    .single();

  if (status !== 200 || error) {
    console.error(error, status);
    return;
  }

  return data;
};

const reset = async () => {
  await setPoints("red", 0, DEFAULTS);
  await setPoints("blue", 0, DEFAULTS);

  await client.from("events").insert({ type: "reset" });
};

const scoringService = { setPoints, fetchTeam, reset };
export default scoringService;
