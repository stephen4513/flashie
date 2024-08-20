// app/api/cancel_subscription/route.js

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth, adminDb } from '../../../config/firebaseadmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        const userDoc = await adminDb.collection('users').doc(userId).get();
        const subscriptionId = userDoc.data()?.subscriptionId;

        console.log('Subscription ID at cancellation:', subscriptionId);

        if (!subscriptionId) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        await stripe.subscriptions.del(subscriptionId);

        // Update Firestore to reflect the cancellation
        await adminDb.collection('users').doc(userId).set(
            { isSubscribed: false },
            { merge: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
    }
}