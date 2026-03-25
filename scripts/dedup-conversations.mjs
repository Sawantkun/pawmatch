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

async function dedup() {
  const snap = await getDocs(collection(db, "conversations"));
  const seen = new Map(); // key: userId+petId → first doc id
  let removed = 0;

  // Sort by lastMessageTime descending so we keep the most recent one
  const docs = snap.docs.sort((a, b) =>
    (b.data().lastMessageTime || "").localeCompare(a.data().lastMessageTime || "")
  );

  for (const d of docs) {
    const conv = d.data();
    const key = `${conv.userId}__${conv.petId || conv.shelterId}`;
    if (seen.has(key)) {
      // Delete messages subcollection first
      const msgSnap = await getDocs(collection(db, "conversations", d.id, "messages"));
      for (const m of msgSnap.docs) {
        await deleteDoc(doc(db, "conversations", d.id, "messages", m.id));
      }
      await deleteDoc(doc(db, "conversations", d.id));
      console.log(`✗ Removed duplicate: ${d.id} (${conv.shelterName} / ${conv.petName})`);
      removed++;
    } else {
      seen.set(key, d.id);
      console.log(`✓ Kept: ${d.id} (${conv.shelterName} / ${conv.petName})`);
    }
  }

  console.log(`\nDone. Removed ${removed} duplicates.`);
  process.exit(0);
}

dedup().catch((err) => {
  console.error(err);
  process.exit(1);
});
