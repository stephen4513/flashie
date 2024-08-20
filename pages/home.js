import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'; 
import { auth } from '../firebase'; // Ensure this path is correct based on your project structure
import HomePage from '../app/components/homeContent/homePage';
import { Container } from '@mui/material';

export default function Home() {
    const router = useRouter();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleEmailLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/flashcards');
        } catch (error) {
            console.error('Error during email login:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/flashcards');
        } catch (error) {
            console.error('Error during Google login:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsSignedIn(true);
                router.push('/flashcards');
            } else {
                setIsSignedIn(false);
            }
            setIsLoaded(true);
        });

        return () => unsubscribe();
    }, [router]);

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return <HomePage />;
}
