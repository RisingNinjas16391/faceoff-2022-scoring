import { useEffect, useState } from "react";
import { useClient } from "../lib/supabase";
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { red } from "@mui/material/colors";

const MULTIPLY = [2, 3, 2];
const PENALTY_DEDUCTION = 5;

export default function ScoringPage({ team }) {

    const [elevator, setElevator] = useState([
        [false, false, false],
        [false, false, false],
        [false, false, false]
    ]);
    const [multipliers, setMultipliers] = useState([false, false, false]);
    const [penalties, setPenalties] = useState(0);

    const [points, setPoints] = useState(0);

    useEffect(() => {
        getTeams();
    }, []);

    useEffect(() => {
        updateScore();
    }, [multipliers, elevator, penalties]);

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

        totalPoints -= PENALTY_DEDUCTION * penalties;
        updatePoints(team, totalPoints).then((r) => {
            console.log("Points updated to: ", totalPoints);
        });
    };

    return (
        <Grid>
            <Typography variant="h2" textAlign="center" gutterBottom>{team} Scoring</Typography>
            <ButtonGroup
                size="large"
                aria-label="small outlined button group"
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    "& > :not(style)": {
                        m: 0,
                        width: 105,
                        height: 50
                    }
                }}
            >
                <Button disabled variant="contained">
                    Penalties
                </Button>
                <Button onClick={handlePenaltyIncrement}>+</Button>
                <Button disabled>{penalties}</Button>
                <Button disabled={penalties === 0} onClick={handlePenaltyDecrement}>
                    -
                </Button>
            </ButtonGroup>
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
                                width: 128,
                                height: 128
                            }
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
                                        onClick={() => {
                                            handleClick(idx, entryIdx, !entry);
                                        }}
                                        sx={{
                                            "& .MuiSvgIcon-root": { fontSize: 128 },
                                            "&.Mui-checked": {
                                                color: team === "red" && red[600]
                                            }
                                        }}
                                    ></Checkbox>
                                </Paper>
                            );
                        })}
                    </Box>
                );
            })}

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    "& > :not(style)": {
                        m: 1,
                        width: 128,
                        height: 64
                    }
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
            <Typography variant="h5" textAlign="center">Points: {points}</Typography>
        </Grid>
    );
}