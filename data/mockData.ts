import { Pet, Shelter, AdoptionApplication, ChatMessage, Conversation } from "@/types";

const UNSPLASH_DOGS = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534361960057-19f4434a4550?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=600&auto=format&fit=crop",
];
const UNSPLASH_CATS = [
  "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548546738-8509cb246ed3?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop",
];
const UNSPLASH_RABBITS = [
  "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535241749838-299277b6305f?w=600&auto=format&fit=crop",
];

export const SHELTERS: Shelter[] = [
  {
    id: "shelter-1",
    name: "Sunny Paws Rescue",
    address: "123 Maple Street",
    city: "San Francisco",
    state: "CA",
    phone: "(415) 555-0101",
    email: "hello@sunnypaws.org",
    website: "https://sunnypaws.org",
    description: "A no-kill shelter dedicated to finding loving homes for every animal since 2005.",
    location: { lat: 37.7749, lng: -122.4194 },
    petCount: 42,
    established: "2005",
    avatar: "🐾",
  },
  {
    id: "shelter-2",
    name: "Happy Tails Foundation",
    address: "456 Oak Avenue",
    city: "Los Angeles",
    state: "CA",
    phone: "(213) 555-0202",
    email: "contact@happytails.org",
    description: "Community-driven rescue providing refuge and rehoming services in LA since 2010.",
    location: { lat: 34.0522, lng: -118.2437 },
    petCount: 67,
    established: "2010",
    avatar: "🐕",
  },
  {
    id: "shelter-3",
    name: "Paws & Hearts",
    address: "789 Pine Road",
    city: "Austin",
    state: "TX",
    phone: "(512) 555-0303",
    email: "info@pawshearts.org",
    description: "Matching the right animals with the right families across Central Texas.",
    location: { lat: 30.2672, lng: -97.7431 },
    petCount: 35,
    established: "2015",
    avatar: "❤️",
  },
];

export const PETS: Pet[] = [
  {
    id: "pet-1",
    name: "Biscuit",
    species: "dog",
    breed: "Golden Retriever",
    age: 18,
    ageLabel: "1.5 years",
    size: "large",
    gender: "male",
    photos: [UNSPLASH_DOGS[0], UNSPLASH_DOGS[1]],
    bio: "Biscuit is a joyful, energetic Golden Retriever who loves fetch, morning runs, and cuddles on the couch. He's incredibly affectionate and gets along with everyone he meets — kids, adults, and other dogs alike. A true sunshine in fur coat.",
    traits: ["Playful", "Gentle", "Friendly", "Energetic", "Loyal"],
    medicalRecords: [
      { id: "mr-1", name: "Annual Vaccination", date: "2025-11-01", type: "vaccination", vet: "Dr. Sarah Chen", notes: "Rabies, DHPP, Bordetella" },
      { id: "mr-2", name: "Neutering", date: "2025-03-15", type: "surgery", vet: "Dr. Mark Torres", notes: "Recovered well, no complications" },
    ],
    shelterId: "shelter-1",
    shelterName: "Sunny Paws Rescue",
    location: { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" },
    status: "available",
    vaccinated: true,
    neutered: true,
    goodWithKids: true,
    goodWithPets: true,
    adoptionFee: 150,
    postedAt: "2026-02-10",
    color: "Golden",
    weight: "65 lbs",
  },
  {
    id: "pet-2",
    name: "Luna",
    species: "cat",
    breed: "British Shorthair",
    age: 30,
    ageLabel: "2.5 years",
    size: "medium",
    gender: "female",
    photos: [UNSPLASH_CATS[0], UNSPLASH_CATS[1]],
    bio: "Luna is a serene, graceful British Shorthair who adores cozy afternoons with a good book (or at least the person reading one). She's independent yet loving, and will warm up to you at her own perfect pace. Ideal for apartment living.",
    traits: ["Calm", "Independent", "Curious", "Affectionate", "Low-maintenance"],
    medicalRecords: [
      { id: "mr-3", name: "Spaying", date: "2024-08-20", type: "surgery", vet: "Dr. Lisa Park", notes: "Fully recovered" },
      { id: "mr-4", name: "Dental Cleaning", date: "2025-09-05", type: "dental", vet: "Dr. Lisa Park" },
    ],
    shelterId: "shelter-2",
    shelterName: "Happy Tails Foundation",
    location: { lat: 34.0522, lng: -118.2437, city: "Los Angeles", state: "CA" },
    status: "available",
    vaccinated: true,
    neutered: true,
    goodWithKids: false,
    goodWithPets: false,
    adoptionFee: 100,
    postedAt: "2026-01-28",
    color: "Blue-grey",
    weight: "12 lbs",
  },

  {
    id: "pet-4",
    name: "Shadow",
    species: "cat",
    breed: "Maine Coon",
    age: 48,
    ageLabel: "4 years",
    size: "large",
    gender: "male",
    photos: [UNSPLASH_CATS[2], UNSPLASH_CATS[3]],
    bio: "Shadow is a majestic Maine Coon who carries himself with quiet dignity. Despite his grand size, he is extraordinarily gentle. He loves sitting on high perches, watching the world, and receiving exactly the right amount of attention — never too much, never too little.",
    traits: ["Majestic", "Gentle", "Quiet", "Independent", "Observant"],
    medicalRecords: [
      { id: "mr-7", name: "Annual Check-up", date: "2025-10-12", type: "checkup", vet: "Dr. Emily Ross" },
    ],
    shelterId: "shelter-3",
    shelterName: "Paws & Hearts",
    location: { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX" },
    status: "pending",
    vaccinated: true,
    neutered: true,
    goodWithKids: true,
    goodWithPets: true,
    adoptionFee: 120,
    postedAt: "2026-02-15",
    color: "Black",
    weight: "18 lbs",
  },
  {
    id: "pet-5",
    name: "Rosie",
    species: "dog",
    breed: "Beagle",
    age: 36,
    ageLabel: "3 years",
    size: "small",
    gender: "female",
    photos: [UNSPLASH_DOGS[4], UNSPLASH_DOGS[5]],
    bio: "Rosie is a sweet, nose-to-the-ground Beagle who turns every walk into an epic scent adventure. She's perfectly house-trained, loves children, and has a gentle soul. Her soulful eyes and floppy ears will melt your heart instantly.",
    traits: ["Curious", "Gentle", "Scent-driven", "Social", "Loves kids"],
    medicalRecords: [
      { id: "mr-8", name: "Vaccination Update", date: "2025-12-01", type: "vaccination", vet: "Dr. Sarah Chen" },
      { id: "mr-9", name: "Spaying", date: "2024-05-22", type: "surgery", vet: "Dr. Mark Torres" },
    ],
    shelterId: "shelter-2",
    shelterName: "Happy Tails Foundation",
    location: { lat: 34.0522, lng: -118.2437, city: "Los Angeles", state: "CA" },
    status: "available",
    vaccinated: true,
    neutered: true,
    goodWithKids: true,
    goodWithPets: true,
    adoptionFee: 130,
    postedAt: "2026-01-20",
    color: "Tri-color",
    weight: "22 lbs",
  },
  {
    id: "pet-6",
    name: "Coco",
    species: "rabbit",
    breed: "Holland Lop",
    age: 12,
    ageLabel: "1 year",
    size: "small",
    gender: "female",
    photos: [UNSPLASH_RABBITS[0], UNSPLASH_RABBITS[1]],
    bio: "Coco is a charming Holland Lop with the most perfect floppy ears. She is incredibly social and loves to binky (that joyful bunny leap!) around the room. Perfect for calm households who want a gentle, curious, low-allergen companion.",
    traits: ["Gentle", "Playful", "Social", "Quiet", "Low-allergen"],
    medicalRecords: [
      { id: "mr-10", name: "Wellness Check", date: "2026-02-01", type: "checkup", vet: "Dr. Karen Wolf" },
    ],
    shelterId: "shelter-3",
    shelterName: "Paws & Hearts",
    location: { lat: 30.2672, lng: -97.7431, city: "Austin", state: "TX" },
    status: "available",
    vaccinated: true,
    neutered: true,
    goodWithKids: true,
    goodWithPets: false,
    adoptionFee: 75,
    postedAt: "2026-03-05",
    color: "Chocolate",
    weight: "4 lbs",
  },
  {
    id: "pet-7",
    name: "Duke",
    species: "dog",
    breed: "German Shepherd",
    age: 60,
    ageLabel: "5 years",
    size: "large",
    gender: "male",
    photos: [UNSPLASH_DOGS[1], UNSPLASH_DOGS[3]],
    bio: "Duke is an intelligent, loyal German Shepherd who spent his first years as a working dog and is now ready for a peaceful forever home. He is calm, highly trained, obedient, and deeply bonded to his trusted humans. Best suited for experienced dog owners.",
    traits: ["Intelligent", "Loyal", "Calm", "Trained", "Protective"],
    medicalRecords: [
      { id: "mr-11", name: "Hip Evaluation", date: "2025-08-15", type: "checkup", vet: "Dr. James Nguyen", notes: "Excellent joint health" },
      { id: "mr-12", name: "Annual Vaccination", date: "2025-11-20", type: "vaccination", vet: "Dr. James Nguyen" },
    ],
    shelterId: "shelter-1",
    shelterName: "Sunny Paws Rescue",
    location: { lat: 37.7749, lng: -122.4194, city: "San Francisco", state: "CA" },
    status: "available",
    vaccinated: true,
    neutered: true,
    goodWithKids: false,
    goodWithPets: false,
    adoptionFee: 180,
    postedAt: "2026-02-28",
    color: "Black & Tan",
    weight: "78 lbs",
  },
  {
    id: "pet-8",
    name: "Bella",
    species: "cat",
    breed: "Siamese Mix",
    age: 24,
    ageLabel: "2 years",
    size: "small",
    gender: "female",
    photos: [UNSPLASH_CATS[4], UNSPLASH_CATS[0]],
    bio: "Bella is a talkative, theatrical Siamese mix who will narrate your entire day with her melodic voice. She is loving, opinionated, and endlessly entertaining. If you want a feline companion who truly communicates with you, Bella is your match.",
    traits: ["Vocal", "Affectionate", "Smart", "Entertaining", "Bonding"],
    medicalRecords: [
      { id: "mr-13", name: "Spaying", date: "2025-01-10", type: "surgery", vet: "Dr. Lisa Park" },
      { id: "mr-14", name: "Annual Vaccination", date: "2025-12-15", type: "vaccination", vet: "Dr. Lisa Park" },
    ],
    shelterId: "shelter-2",
    shelterName: "Happy Tails Foundation",
    location: { lat: 34.0522, lng: -118.2437, city: "Los Angeles", state: "CA" },
    status: "available",
    vaccinated: true,
    neutered: true,
    goodWithKids: true,
    goodWithPets: false,
    adoptionFee: 90,
    postedAt: "2026-03-10",
    color: "Cream & Brown",
    weight: "9 lbs",
  },
];

export const APPLICATIONS: AdoptionApplication[] = [
  {
    id: "app-1",
    petId: "pet-1",
    petName: "Biscuit",
    userId: "user-1",
    userName: "Jordan Lee",
    shelterId: "shelter-1",
    status: "pending",
    submittedAt: "2026-03-20",
    homeType: "House with yard",
    hasChildren: true,
    hasOtherPets: false,
    experience: "Owned dogs before",
    motivation: "Looking for an active companion for my family. My kids have been asking for a dog for years.",
  },
  {
    id: "app-2",
    petId: "pet-3",
    petName: "Mango",
    userId: "user-2",
    userName: "Priya Sharma",
    shelterId: "shelter-1",
    status: "interview",
    submittedAt: "2026-03-18",
    homeType: "Apartment",
    hasChildren: false,
    hasOtherPets: false,
    experience: "First time dog owner",
    motivation: "Work from home and have plenty of time to train and bond with a puppy.",
  },
  {
    id: "app-3",
    petId: "pet-2",
    petName: "Luna",
    userId: "user-3",
    userName: "Marcus Webb",
    shelterId: "shelter-2",
    status: "approved",
    submittedAt: "2026-03-10",
    homeType: "Apartment",
    hasChildren: false,
    hasOtherPets: false,
    experience: "Had cats growing up",
    motivation: "Quiet person, ideal match for an independent cat companion.",
  },
  {
    id: "app-4",
    petId: "pet-5",
    petName: "Rosie",
    userId: "user-4",
    userName: "Sofia Chen",
    shelterId: "shelter-2",
    status: "rejected",
    submittedAt: "2026-03-05",
    homeType: "Apartment (no yard)",
    hasChildren: true,
    hasOtherPets: true,
    experience: "None",
    motivation: "Kids love dogs",
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    userId: "user-1",
    userName: "Alex Rivera",
    shelterId: "shelter-1",
    shelterName: "Sunny Paws Rescue",
    petId: "pet-1",
    petName: "Biscuit",
    lastMessage: "Yes, Biscuit would love a meet-and-greet this weekend!",
    lastMessageTime: "2026-03-25T08:30:00",
    unreadCount: 2,
  },
  {
    id: "conv-2",
    userId: "user-1",
    userName: "Alex Rivera",
    shelterId: "shelter-2",
    shelterName: "Happy Tails Foundation",
    petId: "pet-2",
    petName: "Luna",
    lastMessage: "That's a great question about Luna's temperament.",
    lastMessageTime: "2026-03-24T15:20:00",
    unreadCount: 0,
  },
];

export const MESSAGES: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Alex Rivera",
      text: "Hi! I'm really interested in adopting Biscuit. He looks wonderful!",
      timestamp: "2026-03-24T10:00:00",
      read: true,
    },
    {
      id: "msg-2",
      conversationId: "conv-1",
      senderId: "shelter-1",
      senderName: "Sunny Paws Rescue",
      text: "Hello Alex! Thank you for your interest in Biscuit 🐾 He is such a sweet boy and would be perfect for an active family.",
      timestamp: "2026-03-24T10:15:00",
      read: true,
    },
    {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "user-1",
      senderName: "Alex Rivera",
      text: "That's great! Would it be possible to schedule a meet-and-greet? I have a big yard and love hiking.",
      timestamp: "2026-03-24T10:30:00",
      read: true,
    },
    {
      id: "msg-4",
      conversationId: "conv-1",
      senderId: "shelter-1",
      senderName: "Sunny Paws Rescue",
      text: "Yes, Biscuit would love a meet-and-greet this weekend!",
      timestamp: "2026-03-25T08:30:00",
      read: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-5",
      conversationId: "conv-2",
      senderId: "user-1",
      senderName: "Alex Rivera",
      text: "Hi there! I saw Luna's profile and she looks perfect for my calm apartment lifestyle. Is she good with quiet environments?",
      timestamp: "2026-03-24T14:00:00",
      read: true,
    },
    {
      id: "msg-6",
      conversationId: "conv-2",
      senderId: "shelter-2",
      senderName: "Happy Tails Foundation",
      text: "That's a great question about Luna's temperament.",
      timestamp: "2026-03-24T15:20:00",
      read: true,
    },
  ],
};

export function getPetById(id: string): Pet | undefined {
  return PETS.find((p) => p.id === id);
}

export function getShelterById(id: string): Shelter | undefined {
  return SHELTERS.find((s) => s.id === id);
}

export function getPetsByShelterId(shelterId: string): Pet[] {
  return PETS.filter((p) => p.shelterId === shelterId);
}

export function filterPets(params: {
  species?: string;
  size?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  goodWithKids?: boolean;
  goodWithPets?: boolean;
  status?: string;
  search?: string;
}): Pet[] {
  return PETS.filter((pet) => {
    if (params.species && params.species !== "all" && pet.species !== params.species) return false;
    if (params.size && params.size !== "all" && pet.size !== params.size) return false;
    if (params.gender && params.gender !== "all" && pet.gender !== params.gender) return false;
    if (params.minAge !== undefined && pet.age < params.minAge) return false;
    if (params.maxAge !== undefined && pet.age > params.maxAge) return false;
    if (params.goodWithKids && !pet.goodWithKids) return false;
    if (params.goodWithPets && !pet.goodWithPets) return false;
    if (params.status && params.status !== "all" && pet.status !== params.status) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      if (!pet.name.toLowerCase().includes(q) && !pet.breed.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}
