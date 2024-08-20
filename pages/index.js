// index.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import  { Container, Typography } from '@mui/material';
import styles from './index.module.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return (
    <Container className={styles.container} maxWidth={false}>
     
        <CircularProgress size={100}/>
        <p>cagando...</p>
      
    </Container> 
  );
};

export default HomePage;