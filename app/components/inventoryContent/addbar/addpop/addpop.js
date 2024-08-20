import React from "react";
import { Box, TextField, Button, Modal } from "@mui/material";
import styles from "./addpop.module.css";

export default function AddPop({ open, onClose, onCategoryChange, onTopicChange, onGenerateFlashcards, category, topic }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContainer}>
        <TextField
          className={styles.textField}
          placeholder="Enter category (e.g., Science)"
          value={category}
          onChange={onCategoryChange}
          variant="outlined"
        />
        <TextField
          className={styles.textField}
          placeholder="Enter topic (e.g., Planets)"
          value={topic}
          onChange={onTopicChange}
          variant="outlined"
        />
        <Button className={styles.generateButton} onClick={onGenerateFlashcards}>
          Generate Flashcards
        </Button>
      </Box>
    </Modal>
  );
}