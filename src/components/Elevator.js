import { Box, Checkbox, Paper, Stack } from "@mui/material";
import { red } from "@mui/material/colors";

export default function Elevator({ elevator, canClick, team, handleClick }) {
  return (
    <>
      {elevator.map((row, idx) => {
        return (
          <Box
            key={idx}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              "& > :not(style)": {
                m: 1,
                width: "25%",
                height: "25%",
              },
            }}
          >
            {row.map((entry, entryIdx) => {
              return (
                <Paper
                  key={entryIdx}
                  elevation={3}
                  component={Stack}
                  direction="column"
                  justifyContent="center"
                >
                  <Checkbox
                    checked={entry}
                    disabled={!(canClick(idx, entryIdx) || entry)}
                    onClick={() => {
                      handleClick(idx, entryIdx, !entry);
                    }}
                    sx={{
                      "& .MuiSvgIcon-root": { fontSize: "7em" },
                      "&.Mui-checked": {
                        color: team === "red" && red[600],
                      },
                    }}
                  ></Checkbox>
                </Paper>
              );
            })}
          </Box>
        );
      })}
    </>
  );
}
