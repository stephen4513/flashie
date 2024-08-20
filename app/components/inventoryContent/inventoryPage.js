import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import AddBar from "./addbar/addbar";
import AddPop from "./addbar/addpop/addpop";
import FlashcardSet from "./flashcardset/flashcardset";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import styles from "./inventoryPage.module.css";
import SubscriptionModal from './submodal/submodal';

export default function InventoryPages() {
  const [user, setUser] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log("User detected in useEffect:", currentUser);
        checkSubscriptionStatus(currentUser); // Check if user is subscribed
        fetchFlashcards(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkSubscriptionStatus = async (currentUser) => {
    try {
      // Replace with actual logic to check subscription status from Firestore or another service
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists() && userDoc.data().isSubscribed) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
        setSubscriptionModalOpen(true);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
    }
  };

  const fetchFlashcards = async (currentUser) => {
    if (!currentUser) return;
    try {
      const flashcardsRef = doc(db, "flashcards", currentUser.uid);
      const flashcardsSnap = await getDoc(flashcardsRef);
      if (flashcardsSnap.exists()) {
        console.log("Flashcards found:", flashcardsSnap.data());
        const categories = flashcardsSnap.data().categories || [];
        const initializedCategories = categories.map(category => ({
          ...category,
          flashcards: category.flashcards.map(card => ({ ...card, flipped: false }))
        }));
        setFlashcards(initializedCategories);
      } else {
        console.log("No flashcards found for this user.");
        setFlashcards([]);
      }
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  const handleAddClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setTopic(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleGenerateFlashcards = async () => {
    if (!topic || !category) return;

    const response = await fetch("/api/generates", {
      method: "POST",
      body: topic,
    });

    if (!response.ok) {
      console.error("Error with API request:", response.statusText);
      return;
    }

    try {
      const generatedFlashcards = await response.json();
      const newFlashcards = generatedFlashcards.flashcards.map(card => ({
        front: card.front,
        back: card.back,
        flipped: false
      }));

      const flashcardsRef = doc(db, "flashcards", user.uid);
      const flashcardsSnap = await getDoc(flashcardsRef);

      let categories = [];
      if (flashcardsSnap.exists()) {
        categories = flashcardsSnap.data().categories || [];
      }

      const categoryIndex = categories.findIndex(c => c.categoryName === category);
      if (categoryIndex > -1) {
        categories[categoryIndex].flashcards = [...categories[categoryIndex].flashcards, ...newFlashcards];
      } else {
        categories.push({ categoryName: category, flashcards: newFlashcards });
      }

      await setDoc(flashcardsRef, { categories }, { merge: true });

      setFlashcards(categories);
    } catch (error) {
      console.error("Failed to parse JSON or save flashcards:", error);
    }

    setShowInput(false);
    setTopic("");
    setCategory("");
  };

  const handleCardFlip = (categoryIndex, cardIndex) => {
    const updatedFlashcards = [...flashcards];
    const card = updatedFlashcards[categoryIndex].flashcards[cardIndex];
    card.flipped = !card.flipped;
    setFlashcards(updatedFlashcards);
  };

  return (
    <Box className={isSubscribed ? styles.mainContainer : `${styles.mainContainer} ${styles.blurred}`}>
      <AddBar onAddClick={handleAddClick} />
      <AddPop
        open={showInput}
        onClose={() => setShowInput(false)}
        onCategoryChange={handleCategoryChange}
        onTopicChange={handleInputChange}
        onGenerateFlashcards={handleGenerateFlashcards}
        category={category}
        topic={topic}
      />
      {flashcards.map((categoryObj, categoryIndex) => (
        <FlashcardSet
          key={categoryIndex}
          category={categoryObj.categoryName}
          cards={categoryObj.flashcards}
          onFlip={(cardIndex) => handleCardFlip(categoryIndex, cardIndex)} // Pass handleCardFlip here
        />
      ))}
      <SubscriptionModal 
        open={subscriptionModalOpen} 
        onClose={() => setSubscriptionModalOpen(false)} 
      />
    </Box>
  );
}
