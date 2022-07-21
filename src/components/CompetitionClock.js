import { Box, Typography } from "@mui/material";
import Blink from "./Blink/Blink";

const FONT = {
  fontFamily: "Bank Gothic",
  textAlign: "center",
};

const BLINK = ["00:03", "00:02", "00:01"];

export default function CompetitionClock({ timer, lead, isWinnerFinal }) {
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
        {timer.display}
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
    </Box>
  );
}
