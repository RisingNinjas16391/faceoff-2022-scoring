import styles from "./Blink.module.css";
import { Typography } from "@mui/material";

export default function Blink({
  variant,
  fontFamily,
  textAlign,
  color,
  fontSize,
  text,
}) {
  return (
    <Typography
      className={styles.blink}
      variant={variant}
      sx={{
        fontFamily,
        textAlign,
        color,
        fontSize,
      }}
    >
      {text}
    </Typography>
  );
}
