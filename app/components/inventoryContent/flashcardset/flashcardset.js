import React from "react";
import Flashcard from "./flashcard/flashcard";
import styles from "./flashcardset.module.css";
import { Box, Typography } from "@mui/material";

export default function FlashcardSet({ category, cards, onFlip }) {
  return (
    <Box className={styles.flashcardSet}>
      <Typography className={styles.categoryTitle}>{category}</Typography>
      <Box className={styles.flashcardsContainer}>
        {cards.map((card, index) => (
          <Flashcard
            key={index}
            card={card}
            onFlip={() => onFlip(index)}
          />
        ))}
      </Box>
    </Box>
  );
}