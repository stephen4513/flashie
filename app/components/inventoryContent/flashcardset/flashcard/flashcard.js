import React from "react";
import styles from "./flashcard.module.css";
import { Box, Typography } from "@mui/material";

export default function Flashcard({ card, onFlip }) {
  return (
    <Box
      className={`${styles.flashcard} ${card.flipped ? styles.flipped : ""}`}
      onClick={onFlip}
    >
      <Typography className={styles.flashcardFront}>
        {card.front}
      </Typography>
      <Typography className={styles.flashcardBack}>
        {card.back}
      </Typography>
    </Box>
  );
}