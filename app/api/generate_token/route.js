// pages/api/generateToken.js
import admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require(path.resolve('../../../firebase-adminsdk.json'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const auth = admin.auth();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { clerkUserId } = req.body;

    console.log("Received Clerk User ID:", clerkUserId); // Log the Clerk User ID

    if (!clerkUserId) {
      console.error("Error: Missing Clerk User ID");
      return res.status(400).json({ error: 'Missing Clerk User ID' });
    }

    try {
      // Generate a custom token for the Firebase user
      const firebaseToken = await auth.createCustomToken(clerkUserId);

      console.log("Generated Firebase token:", firebaseToken); // Log the generated token

      // Respond with the generated token
      res.status(200).json({ token: firebaseToken });
    } catch (error) {
      console.error('Error generating Firebase token:', error); // Log any errors
      res.status(500).json({ error: 'Failed to generate token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
