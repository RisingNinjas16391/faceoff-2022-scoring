import { Button, Stack } from "@mui/material";

export default function ClimbBar({ handleClimbClick, climb }) {
  return (
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
  );
}
