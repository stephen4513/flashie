import React, { useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import styles from './3Dcard.module.css';

const ThreeDCard = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * 10;
        const rotateY = (centerX - x) / centerX * 10;

        setRotation({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotation({ x: 0, y: 0 });
    };

    return (
        <Box 
            className={styles.cardContainer} 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Box 
                className={styles.card} 
                style={{
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
            >
                <Box className={styles.cardFront}>
                    <Typography className={styles.title}>Flashie.ai</Typography>
                    <Typography className={styles.description}>Una mejor forma de estudiar</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default ThreeDCard;