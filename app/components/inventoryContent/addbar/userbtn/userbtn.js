import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../../../../firebase'; // Adjust the import path according to your project structure
import styles from './userbtn.module.css';

export default function UserButton() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    window.location.href = '/'; // Redirect to homepage after sign out
  };

  const handleCancelSubscription = () => {
    setOpenDialog(true);
  };

  const handleConfirmCancel = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.error('User is not authenticated');
            return;
        }

        const idToken = await user.getIdToken();

        // Make sure the fetch request points to the correct API route
        const response = await fetch('/api/cancel_subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            console.error('Error canceling subscription:', response.statusText);
            return;
        }

        console.log('Subscription canceled successfully');
        setOpenDialog(false);
        window.location.href = '/subscription-canceled';
    } catch (error) {
        console.error('Failed to cancel subscription:', error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <Box className={styles.userButtonContainer}>
      <Button className={styles.userButton} onClick={handleMenuClick}>
        User
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        className={styles.userMenu}
      >
        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        <MenuItem onClick={handleCancelSubscription}>Cancel Subscription</MenuItem>
      </Menu>

      {/* Cancel Subscription Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cancel Subscription"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel your subscription? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmCancel} color="primary" autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}