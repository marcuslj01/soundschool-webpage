// set-admin.mjs
import admin from "firebase-admin";
import dotenv from "dotenv";

// Last miljøvariabler
dotenv.config({ path: ".env.local" });

// Bruk samme konfigurasjon som i API-routes
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

async function setAdminClaim(uid) {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`User ${uid} is now admin!`);
    console.log("Log out and log in again to update token");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Soon to be admin
const soonToBeAdmin = "sViqqHVxDbW7p8QvheMOWp1jhQD2";
await setAdminClaim(soonToBeAdmin);
