import { Box, Button, Paper, Stack } from "@mui/material";

const MULTIPLY = [2, 3, 2];

export { MULTIPLY };

export default function MultiplierBar({ multipliers, handleMultiplyClick }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        "& > :not(style)": {
          m: 1,
          width: "25%",
          height: "15%",
          maxWidth: 128,
          maxHeight: 64,
        },
      }}
    >
      {multipliers.map((rowValue, idx) => {
        return (
          <Paper
            key={idx}
            elevation={3}
            component={Stack}
            direction="column"
            justifyContent="center"
          >
            <Button
              color={rowValue ? "success" : "error"}
              onClick={() => {
                handleMultiplyClick(idx, !rowValue);
              }}
            >
              {MULTIPLY[idx]}x
            </Button>
          </Paper>
        );
      })}
    </Box>
  );
}
