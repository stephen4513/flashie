import React from "react";
import styles from "./addbar.module.css";
import { Box, Typography, Button } from "@mui/material";
import UserButton from './userbtn/userbtn'; // Import the UserButton component

export default function AddBar({ onAddClick }) {
  return (
    <Box className={styles.add}>
      <Button className={styles.addFlashes} onClick={onAddClick}>
        ADD
      </Button>
      <Typography className={styles.title}>Flashcards</Typography>
      <UserButton />
    </Box>
  );
}
