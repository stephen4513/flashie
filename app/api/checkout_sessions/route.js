import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '../../../config/firebaseadmin'; // Make sure this path is correct

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the ID token and extract the userId
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const origin = request.headers.get('origin') || 'https://flashie-chi.vercel.app' || 'http://localhost:3000';
        const requestData = await request.json();
        const { priceId, applyTrial } = requestData || {};

        if (!userId) {
            console.error('User ID is missing or invalid');
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
        
        const sessionParams = {
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            success_url: `${origin}/flashcards`,
            cancel_url: `${origin}/subscription-failed`,
            metadata: { userId: userId },
        };

        if (applyTrial) {
            sessionParams.subscription_data = {
                trial_period_days: 2,
            };
        }
        
        const checkoutSession = await stripe.checkout.sessions.create(sessionParams);

        // Store that the user is subscribed in Firestore without a subscriptionId initially
        await adminDb.collection('users').doc(userId).set(
            { isSubscribed: true }, 
            { merge: true }
        );        

        return NextResponse.json(checkoutSession);
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
}
