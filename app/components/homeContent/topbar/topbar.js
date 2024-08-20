import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from './topbar.module.css';
import AuthModal from './authmodal/authmodal';

const TopBar = () => {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);

    return (
        <Box className={styles.barContainer}>
            <Box className={styles.buttonsContainer}>
                <Button className={styles.button} onClick={() => setLoginOpen(true)}>Log In</Button>
                <Button className={styles.button} onClick={() => setRegisterOpen(true)}>Register</Button>
            </Box>
            <AuthModal open={isLoginOpen} onClose={() => setLoginOpen(false)} isLogin={true} />
            <AuthModal open={isRegisterOpen} onClose={() => setRegisterOpen(false)} isLogin={false} />
        </Box>
    );
};

export default TopBar;