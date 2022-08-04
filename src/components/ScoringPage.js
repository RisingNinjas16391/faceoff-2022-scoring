import { useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import Head from "next/head";

import Elevator from "./Elevator";
import MultiplierBar, { MULTIPLY } from "./MultiplierBar";
import PenaltyBar from "./PenaltyBar";
import ClimbBar from "./ClimbBar";

import scoringService from "../lib/scoring";
import { useClient } from "../lib/supabase";

const PENALTY_DEDUCTION = 5;

export const DEFAULTS = {
  elevator: [
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ],
  multipliers: [false, false, false],
  penalties: 0,
  climb: [false, false],
};

export default function ScoringPage({ team, displayName }) {
  const [elevator, setElevator] = useState(DEFAULTS.elevator);
  const [multipliers, setMultipliers] = useState(DEFAULTS.multipliers);
  const [penalties, setPenalties] = useState(DEFAULTS.penalties);
  const [climb, setClimb] = useState(DEFAULTS.climb);

  const [loading, setLoading] = useState(true);
  const [points, setPoints] = useState(0);

  const client = useClient();

  const fetch = async () => {
    const response = await scoringService.fetchTeam(team);
    const scoringData = response.data;

    setPoints(0);

    setElevator(scoringData.elevator);
    setMultipliers(scoringData.multipliers);
    setPenalties(scoringData.penalties);
    setClimb(scoringData.climb);

    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      client
        .from("events")
        .on("INSERT", (v) => {
          const data = v.new;

          if (data.type === "reset") {
            fetch();
          }
        })
        .subscribe();
    }, 1000);

    return () => {
      client.removeAllSubscriptions().then(() => {
        console.log("Removed all subscriptions");
      });
    };
  }, [client]);

  useEffect(() => {
    updateScore();
  }, [multipliers, elevator, penalties, climb]);

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
    if (loading) {
      return;
    }

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

    if (points === totalPoints) {
      return;
    }

    scoringService
      .setPoints(team, totalPoints, { elevator, multipliers, climb, penalties })
      .then((r) => {
        setPoints(totalPoints);
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
          fontSize="3.5rem"
        >
          {displayName} Scoring
        </Typography>

        <ClimbBar handleClimbClick={handleClimbClick} climb={climb} />

        <PenaltyBar
          penalties={penalties}
          increment={handlePenaltyIncrement}
          decrement={handlePenaltyDecrement}
        />

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
