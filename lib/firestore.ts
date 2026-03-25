import {
  collection, doc, getDoc, getDocs, setDoc,
  updateDoc, addDoc, query, where,
  onSnapshot, orderBy, DocumentData, deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Pet, Shelter, AdoptionApplication, ChatMessage, Conversation } from "@/types";

// ---------- USERS ----------

export interface UserDoc {
  id: string;
  name: string;
  email: string;
  role: "adopter" | "shelter" | "admin";
  savedPets: string[];
  avatar?: string;
  preferences?: {
    lifestyle: string;
    homeType: string;
    activityLevel: string;
    experience: string;
    preferredSize: string;
    preferredAge: string;
    preferredSpecies: string;
    allergies: boolean;
  };
}

export async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as UserDoc;
}

export async function createUserDoc(uid: string, data: UserDoc): Promise<void> {
  await setDoc(doc(db, "users", uid), data);
}

export async function updateUserDoc(uid: string, data: Partial<UserDoc>): Promise<void> {
  await updateDoc(doc(db, "users", uid), data as DocumentData);
}

// ---------- PETS ----------

export async function getAllPets(): Promise<Pet[]> {
  const snap = await getDocs(collection(db, "pets"));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Pet);
}

export async function getFirestorePetById(id: string): Promise<Pet | null> {
  const snap = await getDoc(doc(db, "pets", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Pet;
}

export async function createPet(pet: Omit<Pet, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "pets"), pet);
  return ref.id;
}

export async function updatePet(id: string, data: Partial<Pet>): Promise<void> {
  await updateDoc(doc(db, "pets", id), data as DocumentData);
}

export async function deletePet(id: string): Promise<void> {
  await deleteDoc(doc(db, "pets", id));
}

// ---------- SHELTERS ----------

export async function getAllShelters(): Promise<Shelter[]> {
  const snap = await getDocs(collection(db, "shelters"));
  return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Shelter);
}

export async function getFirestoreShelterById(id: string): Promise<Shelter | null> {
  const snap = await getDoc(doc(db, "shelters", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Shelter;
}

// ---------- APPLICATIONS ----------

export async function getApplicationsByUser(userId: string): Promise<AdoptionApplication[]> {
  const q = query(collection(db, "applications"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdoptionApplication);
}

export async function getApplicationsByShelterId(shelterId: string): Promise<AdoptionApplication[]> {
  const q = query(collection(db, "applications"), where("shelterId", "==", shelterId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdoptionApplication);
}

export async function createApplication(data: Omit<AdoptionApplication, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "applications"), data);
  return ref.id;
}

export async function updateApplicationStatus(
  id: string,
  status: AdoptionApplication["status"]
): Promise<void> {
  await updateDoc(doc(db, "applications", id), { status });
}

// ---------- CONVERSATIONS ----------

export async function getConversationsByUser(userId: string): Promise<Conversation[]> {
  const q = query(collection(db, "conversations"), where("userId", "==", userId));
  const snap = await getDocs(q);
  const convs = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Conversation);
  // Sort client-side to avoid requiring a composite Firestore index
  return convs.sort(
    (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
  );
}

export async function getConversationsByShelterId(shelterId: string): Promise<Conversation[]> {
  const q = query(collection(db, "conversations"), where("shelterId", "==", shelterId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Conversation);
}

export async function getConversationByPetAndUser(
  petId: string,
  userId: string
): Promise<Conversation | null> {
  const q = query(
    collection(db, "conversations"),
    where("petId", "==", petId),
    where("userId", "==", userId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Conversation;
}

export async function createConversation(data: Omit<Conversation, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "conversations"), data);
  return ref.id;
}

export async function updateConversation(id: string, data: Partial<Conversation>): Promise<void> {
  await updateDoc(doc(db, "conversations", id), data as DocumentData);
}

// ---------- MESSAGES (real-time) ----------

export function subscribeToMessages(
  convId: string,
  callback: (msgs: ChatMessage[]) => void
): () => void {
  const q = query(
    collection(db, "conversations", convId, "messages"),
    orderBy("timestamp", "asc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ChatMessage));
  });
}

export async function sendMessage(
  convId: string,
  msg: Omit<ChatMessage, "id">
): Promise<void> {
  await addDoc(collection(db, "conversations", convId, "messages"), msg);
  await updateConversation(convId, {
    lastMessage: msg.text,
    lastMessageTime: msg.timestamp,
    unreadCount: 0,
  });
}
