import { Box, Divider } from "@mui/material";
import Head from "next/head";

import { useEffect, useState } from "react";
import CompetitionClock from "../components/CompetitionClock";
import TeamScore from "../components/TeamScore";
import useTimer from "../hooks/useTimer";
import scoringService from "../lib/scoring";
import { client } from "../lib/supabase";

export default function Home() {
  const [red, setRed] = useState({});
  const [blue, setBlue] = useState({});

  const [update, setUpdate] = useState(null);
  const [isWinnerFinal, setWinnerFinal] = useState(false);

  const [state, start, toggle, reset, started] = useTimer();

  useEffect(() => {
    getTeams();

    setTimeout(() => {
      client
        .from("points")
        .on("UPDATE", (v) => {
          setUpdate(v.new);
        })
        .subscribe();
    }, 1000);

    return () => {
      client.removeAllSubscriptions().then(() => {
        console.log("Removed all subscriptions");
      });
    };
  }, []);

  useEffect(() => {
    if (update) {
      updateTeam(update);
      setUpdate(null);
    }
  }, [update]);

  useEffect(() => {
    const eventListener = (event) => {
      const code = event.code;

      if (code === "KeyR") {
        reset();
        scoringService.reset();
      } else if (code === "Enter" && !started) {
        start();
      } else if (code === "Space" && started) {
        event.preventDefault();
        toggle();
      } else if (code === "KeyF" && state.key === "finished") {
        setWinnerFinal(!isWinnerFinal);
      }
    };

    document.addEventListener("keydown", eventListener);

    return () => {
      document.removeEventListener("keydown", eventListener);
    };
  });

  const getTeams = () => {
    client
      .from("points")
      .select("*")
      .then(({ data, error }) => {
        if (!error) {
          for (let team in data) {
            updateTeam(data[team]);
          }
        }
      });
  };

  const updateTeam = (updated) => {
    if (updated.team === "red") {
      setRed(updated);
    } else if (updated.team === "blue") {
      setBlue(updated);
    }
  };

  const getLead = () => {
    if (!(red && blue) || red.points === blue.points) {
      return "tie";
    } else if (red.points > blue.points) {
      return "red";
    } else {
      return "blue";
    }
  };

  return (
    <div>
      <Head>
        <title>Faceoff 2022 Scoring</title>
        <meta name="description" content="Scoring website for Faceoff 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <style jsx global>{`
        body {
          background: #121212;
        }
      `}</style>

      <Box>
        <CompetitionClock
          lead={getLead()}
          timer={state}
          isWinnerFinal={isWinnerFinal}
        />
        <Divider></Divider>
        <Box
          sx={{
            display: "flex",
            "& > :not(style)": {
              m: 1,
              width: 1280,
              height: 400,
            },
          }}
        >
          <TeamScore name="Blue" team={blue} />
          <TeamScore name="Red" team={red} />
        </Box>
      </Box>
    </div>
  );
}
