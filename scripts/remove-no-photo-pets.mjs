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

async function removeNoPhotoPets() {
  const snap = await getDocs(collection(db, "pets"));
  let removed = 0;

  for (const d of snap.docs) {
    const pet = d.data();
    const hasPhoto = Array.isArray(pet.photos) && pet.photos.length > 0 && pet.photos[0]?.trim();
    if (!hasPhoto) {
      await deleteDoc(doc(db, "pets", d.id));
      console.log(`✗ Deleted: ${pet.name || d.id} (${pet.breed || "unknown breed"})`);
      removed++;
    } else {
      console.log(`✓ Kept:    ${pet.name} (${pet.breed})`);
    }
  }

  console.log(`\nDone. Removed ${removed} pets with no photos.`);
  process.exit(0);
}

removeNoPhotoPets().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
