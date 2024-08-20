import React from 'react';
import { Box } from '@mui/material';
import TopBar from './topbar/topbar';
import ThreeDCard from './3Dcard/3Dcard';
import Carrousel from './carrousel/carrousel';
import styles from './homePage.module.css';

const HomePage = () => {
    return (
        <Box className={styles.mainContainer}>
            <TopBar />
            <Box className={styles.contentContainer}>
                <Box className={styles.carrouselOneContainer}>
                    <Carrousel />
                </Box>
                <Box className={styles.content}>
                    <Box className={styles.backgroundCard}>
                        <ThreeDCard />
                    </Box>
                </Box>
                <Box className={styles.carrouselTwoContainer}>
                    <Carrousel />
                </Box>
            </Box>
        </Box>
    );
};

export default HomePage;