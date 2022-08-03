import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import Blink from "./Blink/Blink";

const FONT = {
  fontFamily: "Bank Gothic",
  textAlign: "center",
};

const BLINK = ["00:03", "00:02", "00:01"];

const TEAMS = [
  {
    name: "Wall-E",
    number: 1,
    participants: ["Jackson", "Alec", "Sanjay"],
  },
  {
    name: "Speedrunners",
    number: 2,
    participants: ["Troy", "Taha"],
  },
  {
    name: "Gamer Snakers",
    number: 3,
    participants: ["Sam", "Santi"],
  },
  {
    name: "The End",
    number: 4,
    participants: ["Sasha", "Nathan"],
  },
  {
    name: "Undecided",
    number: 6,
    participants: ["Max", "Lucas", "Austin"],
  },
  {
    name: "Pyreus",
    number: 8,
    participants: ["Alex", "Camden", "Adam"],
  },
];

export default function CompetitionClock({ timer, lead, isWinnerFinal }) {
  const [redTeam, setRedTeam] = useState(TEAMS[0]);

  const getLead = () => {
    if (lead === "red") {
      return `Red ${isWinnerFinal ? "Wins!" : "Lead"}`;
    } else if (lead === "blue") {
      return `Blue ${isWinnerFinal ? "Wins!" : "Lead"}`;
    } else {
      return `Tie${isWinnerFinal ? ": Sudden Death" : ""}`;
    }
  };

  const getLeadColor = () => {
    if (lead === "red") {
      return "red";
    } else if (lead === "blue") {
      return "blue";
    } else {
      return "purple";
    }
  };

  const getTime = () => {
    return new Date(timer.duration * 1000).toISOString().slice(14, 19);
  };

  const getTimeComponent = () => {
    const time = getTime();

    if (BLINK.includes(time)) {
      return (
        <Blink
          variant="h3"
          fontFamily={FONT.fontFamily}
          textAlign={FONT.textAlign}
          fontSize="125px"
          color="#EEAD1E"
          text={time}
        />
      );
    }

    return (
      <Typography
        variant="h3"
        sx={{
          ...FONT,
          fontSize: "125px",
          color: "#EEAD1E",
        }}
      >
        {time}
      </Typography>
    );
  };

  return (
    <Box className="CompetitionClock">
      {getTimeComponent()}
      <Typography
        variant="h2"
        sx={{
          ...FONT,
          fontSize: "75px",
          color: "#FFFFFF",
        }}
      >
        {timer.key === "finished" ? "Finished" : timer.display}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          ...FONT,
          fontSize: "75px",
          color: getLeadColor(),
        }}
      >
        {getLead()}
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          backgroundColor: "#2C3333",
          minWidth: "400px",
          position: "absolute",
          top: "100px",
          right: "40px",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            ...FONT,
            fontSize: "40px",
            color: "red",
          }}
        >
          {redTeam.name}
        </Typography>
        {redTeam.participants.map((name) => (
          <Typography
            key={name}
            variant="h4"
            sx={{ ...FONT, fontSize: "25px", color: "#FFFFFF" }}
          >
            {name}
          </Typography>
        ))}
      </Paper>
    </Box>
  );
}
