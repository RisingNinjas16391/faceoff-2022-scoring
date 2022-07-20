import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Image from "next/image";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "gray",
  ...theme.typography.body2,
  padding: theme.spacing(3.5),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function ElevatorView({ name, elevator }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0.5}>
        {elevator.map((row, idx) => {
          return row.map((entry, entryIdx) => {
            return (
              <Grid key={entryIdx} item xs={4}>
                <Item>
                  <Image
                    src={entry ? `/${name}.png` : "/nothing.png"}
                    alt="ALandscape picture"
                    width={50}
                    height={50}
                  />
                </Item>
              </Grid>
            );
          });
        })}
      </Grid>
    </Box>
  );
}
