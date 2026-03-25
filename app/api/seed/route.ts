import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import { PETS, SHELTERS, APPLICATIONS, CONVERSATIONS, MESSAGES } from "@/data/mockData";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getApp() {
  return getApps().length === 0 ? initializeApp(firebaseConfig, "seed") : getApps()[0];
}

export async function POST() {
  try {
    const app = getApp();
    const db = getFirestore(app);

    // Check if already seeded
    const existing = await getDocs(collection(db, "pets"));
    if (!existing.empty) {
      return NextResponse.json({ message: "Already seeded", count: existing.size });
    }

    // Batch 1: pets + shelters
    const batch1 = writeBatch(db);
    for (const pet of PETS) {
      batch1.set(doc(collection(db, "pets"), pet.id), pet);
    }
    for (const shelter of SHELTERS) {
      batch1.set(doc(collection(db, "shelters"), shelter.id), shelter);
    }
    await batch1.commit();

    // Batch 2: applications + conversations
    const batch2 = writeBatch(db);
    for (const app of APPLICATIONS) {
      batch2.set(doc(collection(db, "applications"), app.id), app);
    }
    for (const conv of CONVERSATIONS) {
      batch2.set(doc(collection(db, "conversations"), conv.id), conv);
    }
    await batch2.commit();

    // Messages (subcollection — must be separate)
    const batch3 = writeBatch(db);
    for (const [convId, msgs] of Object.entries(MESSAGES)) {
      for (const msg of msgs) {
        batch3.set(
          doc(collection(db, "conversations", convId, "messages"), msg.id),
          msg
        );
      }
    }
    await batch3.commit();

    return NextResponse.json({
      success: true,
      seeded: {
        pets: PETS.length,
        shelters: SHELTERS.length,
        applications: APPLICATIONS.length,
        conversations: CONVERSATIONS.length,
        messages: Object.values(MESSAGES).flat().length,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const app = getApp();
    const db = getFirestore(app);
    const petsSnap = await getDocs(collection(db, "pets"));
    return NextResponse.json({ seeded: !petsSnap.empty, petCount: petsSnap.size });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE — clear all seeded/dummy data from every collection
export async function DELETE() {
  try {
    const app = getApp();
    const db = getFirestore(app);

    const COLLECTIONS = ["pets", "shelters", "applications", "conversations"];

    for (const col of COLLECTIONS) {
      const snap = await getDocs(collection(db, col));
      const batch = writeBatch(db);
      for (const d of snap.docs) {
        // Delete messages subcollection for conversations
        if (col === "conversations") {
          const msgSnap = await getDocs(collection(db, "conversations", d.id, "messages"));
          const msgBatch = writeBatch(db);
          msgSnap.docs.forEach((m) => msgBatch.delete(m.ref));
          if (msgSnap.size > 0) await msgBatch.commit();
        }
        batch.delete(d.ref);
      }
      if (snap.size > 0) await batch.commit();
    }

    return NextResponse.json({ success: true, message: "All data cleared" });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
