import React, { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import styles from './submodal.module.css';
import StripeBtn from './stripeBtn/stripeBtn';

const SubscriptionModal = ({ open, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('');

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID; 
  const applyTrial = selectedPlan === 'trial'; 

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContainer}>
        <Typography variant="h6" className={styles.modalTitle}>
          Choose Your Plan
        </Typography>
      
        <Button
          className={`${styles.planButton} ${selectedPlan === 'pro' ? styles.active : ''}`}
          onClick={() => handlePlanSelect('pro')}
        >
          Paid Plan - $5/month
        </Button>
        <Button
          className={`${styles.planButton} ${selectedPlan === 'trial' ? styles.active : ''}`}
          onClick={() => handlePlanSelect('trial')}
        >
          2-Day Free Trial
        </Button>

        {/* Pass the selected plan and applyTrial flag to StripeBtn */}
        <StripeBtn priceId={priceId} applyTrial={applyTrial} />
      </Box>
    </Modal>
  );
};

export default SubscriptionModal;