import { Box, Paper, Typography } from "@mui/material";
import ElevatorView from "./ElevatorView";

export default function TeamScore({ team, name }) {
  if (team === null) {
    return;
  }

  return (
    <Paper variant="outlined" sx={{ backgroundColor: "#2C3333" }}>
      <Typography
        variant="h2"
        sx={{
          color: team.team,
          textAlign: "center",
          fontFamily: "Bank Gothic",
          fontSize: "75px",
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          color: "#FFFFFF",
          textAlign: "center",
          fontFamily: "Bank Gothic",
          fontSize: "50px",
        }}
      >
        {team.points}
      </Typography>
      <ElevatorView
        elevator={team.data ? team.data.elevator : []}
        multipliers={team.data ? team.data.multipliers : []}
        name={team.team}
      />
    </Paper>
  );
}
