import { Button, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { useClient } from "../lib/supabase";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const client = useClient();
  const { signIn } = useAuth();

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { error } = signIn({ email: "ninjineers@ahschool.com", password });

    if (error) {
      alert("Wrong password!");
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
    </div>
  );
}
