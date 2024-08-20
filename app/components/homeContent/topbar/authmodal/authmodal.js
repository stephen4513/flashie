import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Modal } from '@mui/material';
import { auth } from '../../../../../firebase';  // Adjust this import path according to your project structure
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import styles from './authmodal.module.css';
import Image from 'next/image';

const AuthModal = ({ open, onClose, isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  
  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      console.error("Error signing in:", error);
      // Handle errors appropriately (e.g., show a message to the user)
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (error) {
      console.error("Error signing up:", error);
      // Handle errors appropriately (e.g., show a message to the user)
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      console.error("Error with Google Auth:", error);
      // Handle COOP-related errors gracefully, or show a message to the user
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContainer}>
        <Typography className={styles.modalTitle} variant="h6">
          {isLogin ? 'Login' : 'Create your account'}
        </Typography>
        <Button className={styles.providerButton} onClick={handleGoogleAuth}>
          <Image src='/googleicon.png' alt="Google" width={20} height={20} className={styles.icon} />
          Sign in with Google
        </Button>
        <div className={styles.divider}>or</div>
        <Box className={styles.formContainer}>
          {!isLogin && (
            <TextField 
              label="Username (Optional)" 
              fullWidth 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className={styles.textField}
            />
          )}
          <TextField 
            label="Email address" 
            fullWidth 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className={styles.textField}
          />
          <TextField 
            label="Password" 
            type="password" 
            fullWidth 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className={styles.textField}
          />
          <Button className={styles.authButton} onClick={isLogin ? handleSignIn : handleSignUp}>
            {isLogin ? 'Continue' : 'Continue'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AuthModal;
