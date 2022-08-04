import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { Button, Paper, Stack, styled } from "@mui/material";
import { purple } from "@mui/material/colors";

const ColorButton = styled(Button)(({ theme }) => ({
  fontSize: 45,
  backgroundColor: purple[500],
  "&:hover": {
    backgroundColor: purple[700],
  },
}));

export default function PenaltyBar({ penalties, increment, decrement }) {
  return (
    <Stack
      direction="row"
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        "& > :not(style)": {
          m: 0,
          width: "22%",
          height: "15%",
          maxWidth: 105,
          maxHeight: 75,
        },
      }}
    >
      <Paper
        disabled
        variant="outlined"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: purple[700],
          "& svg": {
            fontSize: "4.5rem",
          },
        }}
      >
        <ReportProblemIcon />
      </Paper>
      <ColorButton
        disabled={penalties === 0}
        onClick={decrement}
        variant="contained"
      >
        -
      </ColorButton>
      <Button disabled variant="outlined" sx={{ fontSize: 45 }}>
        {penalties}
      </Button>
      <ColorButton
        onClick={increment}
        variant="contained"
        size="large"
        disableRipple
      >
        +
      </ColorButton>
    </Stack>
  );
}
