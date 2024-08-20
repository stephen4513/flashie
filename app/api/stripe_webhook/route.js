import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '../../../config/firebaseadmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
    const sig = request.headers.get('stripe-signature');

    let event;

    try {
        // Parse and verify the Stripe webhook event
        event = stripe.webhooks.constructEvent(
            await request.text(), // Use text() here since it's raw JSON
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('⚠️  Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
    }

    // Handle the event when checkout.session.completed is triggered
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const subscriptionId = session.subscription; // Subscription ID from the session
        const userId = session.metadata.userId; // Retrieve the userId from metadata
        
        console.log('Subscription ID at webhook:', subscriptionId);
        console.log('User ID from metadata:', userId);

        // If both subscriptionId and userId are present, save them in Firestore
        if (subscriptionId && userId) {
            try {
                await adminDb.collection('users').doc(userId).set(
                    { subscriptionId }, 
                    { merge: true }
                );
                console.log('Subscription ID stored in Firestore');
            } catch (error) {
                console.error('Error storing Subscription ID in Firestore:', error);
            }
        } else {
            console.error('Subscription ID or User ID is missing.');
        }
    }

    return NextResponse.json({ received: true });
}
