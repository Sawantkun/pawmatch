export interface Pet {
  id: string;
  name: string;
  species: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed: string;
  age: number; // months
  ageLabel: string; // "2 years", "6 months"
  size: "small" | "medium" | "large" | "xlarge";
  gender: "male" | "female";
  photos: string[];
  bio: string;
  traits: string[];
  medicalRecords: MedicalRecord[];
  shelterId: string;
  shelterName: string;
  location: { lat: number; lng: number; city: string; state: string };
  status: "available" | "pending" | "adopted";
  vaccinated: boolean;
  neutered: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  adoptionFee: number;
  postedAt: string; // ISO date
  color: string;
  weight: string;
}

export interface MedicalRecord {
  id: string;
  name: string;
  date: string;
  type: "vaccination" | "surgery" | "checkup" | "dental" | "other";
  vet: string;
  notes?: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  location: { lat: number; lng: number };
  petCount: number;
  established: string;
  avatar: string;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  userId: string;
  userName: string;
  shelterId: string;
  status: "pending" | "approved" | "rejected" | "interview";
  submittedAt: string;
  notes?: string;
  homeType: string;
  hasChildren: boolean;
  hasOtherPets: boolean;
  experience: string;
  motivation: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  shelterId: string;
  shelterName: string;
  petId?: string;
  petName?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  userAvatar?: string;
}
