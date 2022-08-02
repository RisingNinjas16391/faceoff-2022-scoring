import { Alert, Button, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [warn, setWarn] = useState(false);
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      return;
    }

    const { error } = await signIn({
      email: "ninjineers@ahschool.com",
      password,
    });

    if (error) {
      setWarn(true);
      setTimeout(() => setWarn(false), 3000);
    }
    setPassword("");
  };

  return (
    <div style={{ padding: 30 }}>
      <form onSubmit={handleSubmit}>
        <Paper>
          <Grid
            container
            spacing={3}
            direction={"column"}
            justify={"center"}
            alignItems={"center"}
          >
            <Grid item xs={12}>
              <TextField
                label="Password"
                type={"password"}
                value={password}
                onChange={handleChange}
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth type="submit">
                {" "}
                Login{" "}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
      {warn && <Alert severity="error">Incorrect password!</Alert>}
    </div>
  );
}
