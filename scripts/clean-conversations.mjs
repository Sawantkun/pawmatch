import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBuxDW_-kwNxSNibO-WUGf1LYAAVsC03sM",
  authDomain: "furrmate-61970.firebaseapp.com",
  projectId: "furrmate-61970",
  storageBucket: "furrmate-61970.firebasestorage.app",
  messagingSenderId: "364051552649",
  appId: "1:364051552649:web:354cea0ffdad924d31a958",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clean() {
  const snap = await getDocs(collection(db, "conversations"));
  let removed = 0;

  for (const d of snap.docs) {
    const conv = d.data();
    // Delete conversations with no shelter name (broken ones)
    if (!conv.shelterName) {
      // Delete messages subcollection first
      const msgSnap = await getDocs(collection(db, "conversations", d.id, "messages"));
      for (const m of msgSnap.docs) {
        await deleteDoc(doc(db, "conversations", d.id, "messages", m.id));
      }
      await deleteDoc(doc(db, "conversations", d.id));
      console.log(`✗ Deleted broken conversation: ${d.id} (petId: ${conv.petId || "none"})`);
      removed++;
    } else {
      console.log(`✓ Kept: ${conv.shelterName} — ${conv.petName || "no pet"}`);
    }
  }

  console.log(`\nDone. Removed ${removed} broken conversations.`);
  process.exit(0);
}

clean().catch((err) => {
  console.error(err);
  process.exit(1);
});
