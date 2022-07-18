import { useEffect, useState } from "react";
import { useClient } from "../lib/supabase";
import { Button, Grid, Stack, Typography } from "@mui/material";
import Head from "next/head";
import Elevator from "./Elevator";
import MultiplierBar, { MULTIPLY } from "./MultiplierBar";

const PENALTY_DEDUCTION = 5;

// 40
// 20

const styles = {
  boxShadow: "none",
  fontSize: 45,
  backgroundColor: "#0063cc",
  borderColor: "#0063cc",
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
    boxShadow: "none",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
  },
  "&:focus": {
    boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
  },
};

export default function ScoringPage({ team, displayName }) {
  const [elevator, setElevator] = useState([
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]);
  const [multipliers, setMultipliers] = useState([false, false, false]);
  const [penalties, setPenalties] = useState(0);
  const [climb, setClimb] = useState([false, false]);

  const [points, setPoints] = useState(0);

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    updateScore();
  }, [multipliers, elevator, penalties, climb]);

  const client = useClient();

  const getTeams = () => {
    const fetch = async () => {
      const { data, status, error } = await client
        .from("points")
        .select("*")
        .eq("team", team)
        .single();

      if (status !== 200 || error) {
        return;
      }

      const scoringData = data.data;

      setElevator(scoringData.elevator);
      setMultipliers(scoringData.multipliers);
      setPenalties(scoringData.penalties);
    };

    fetch();
  };

  async function updatePoints(team, points) {
    const { data, error } = await client
      .from("points")
      .update({ points, data: { elevator, multipliers, penalties } })
      .eq("team", team);

    setPoints(points);

    return { data };
  }

  const handleClick = (rowIndex, entryIndex, value) => {
    const newElevator = [...elevator];
    newElevator[rowIndex][entryIndex] = value;

    setElevator(newElevator);
  };

  const handleMultiplyClick = (row, value) => {
    const multiply = [...multipliers];
    multiply[row] = value;

    setMultipliers(multiply);
  };

  const handlePenaltyIncrement = () => {
    setPenalties(penalties + 1);
  };

  const handlePenaltyDecrement = () => {
    setPenalties(penalties - 1);
  };

  const handleClimbClick = (index) => {
    const newClimb = [...climb];
    newClimb[index] = !climb[index];

    setClimb(newClimb);
  };

  const updateScore = () => {
    let totalPoints = 0;

    for (let i = 0; i < elevator.length; i++) {
      const row = elevator[i];

      for (let entry in row) {
        const isMultiplied = multipliers[entry];

        if (row[entry]) {
          if (isMultiplied) {
            totalPoints += 10 * MULTIPLY[entry];
          } else {
            totalPoints += 10;
          }
        }
      }
    }

    if (climb[0]) {
      totalPoints += 40;
    }

    if (climb[1]) {
      totalPoints += 20;
    }

    totalPoints -= PENALTY_DEDUCTION * penalties;
    updatePoints(team, totalPoints).then((r) => {
      console.log("Points updated to: ", totalPoints);
    });
  };

  const canClick = (rowIdx, entryIdx) => {
    if (rowIdx == 2) {
      return true;
    } else if (rowIdx == 1) {
      return elevator[2][entryIdx];
    } else if (rowIdx == 0) {
      return elevator[2][entryIdx] && elevator[1][entryIdx];
    }

    return true;
  };

  return (
    <>
      <Head>
        <title>{displayName} Scoring Page</title>
        <meta
          name="description"
          content={`The scoring page for ${team} team`}
        />
      </Head>
      <Grid>
        <Typography
          variant="h2"
          textAlign="center"
          gutterBottom
          color={team}
          fontFamily="Bank Gothic"
        >
          {displayName} Scoring
        </Typography>

        <Stack
          direction="row"
          spacing={4}
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "15px",
          }}
        >
          <Button
            variant="contained"
            color={climb[0] ? "success" : "error"}
            onClick={() => {
              handleClimbClick(0);
            }}
          >
            Autonomous Climb
          </Button>
          <Button
            variant="contained"
            color={climb[1] ? "success" : "error"}
            onClick={() => {
              handleClimbClick(1);
            }}
          >
            Endgame Climb
          </Button>
        </Stack>
        <Stack
          direction="row"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            "& > :not(style)": {
              m: 0,
              width: 105,
              height: 75,
            },
          }}
        >
          <Button variant="contained" disabled>
            Penalties
          </Button>
          <Button
            disabled={penalties === 0}
            onClick={handlePenaltyDecrement}
            variant="contained"
            sx={styles}
          >
            -
          </Button>
          <Button disabled variant="outlined">
            {penalties}
          </Button>
          <Button
            onClick={handlePenaltyIncrement}
            variant="contained"
            sx={styles}
            size="large"
            disableRipple
          >
            +
          </Button>
        </Stack>

        <Elevator
          elevator={elevator}
          canClick={canClick}
          team={team}
          handleClick={handleClick}
        />

        <MultiplierBar
          multipliers={multipliers}
          handleMultiplyClick={handleMultiplyClick}
        />

        <Typography variant="h4" textAlign="center" fontFamily="Bank Gothic">
          Points: {points}
        </Typography>
      </Grid>
    </>
  );
}