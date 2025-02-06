import {
  collection,
  doc,
  getDoc,
  getDocs,
  getDocsFromServer,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@clerk/clerk-expo";

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
  preferences?: {
    education?: {
      secondary_school: string;
      university?: string;
    };
    faith?: {
      religion: "Christian" | "Muslim" | "Traditional" | "Buddhist" | "Other";
      denomination?: string | null;
    };
    industry?: string[];
    locations?: string[];
  };
}

export const useUserProfile = () => {
  const { userId } = useAuth();

  const getUserProfile = async () => {
    if (!userId) return null;
    const docRef = doc(db, "users-test", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
  };

  const saveUserProfile = async (data: UserProfile) => {
    if (!userId) throw new Error("No user ID found");
    const docRef = doc(db, "users-test", userId);
    await setDoc(docRef, data, { merge: true });
  };

  const saveUserPreferences = async (
    preferences: UserProfile["preferences"]
  ) => {
    if (!userId) throw new Error("No user ID found");
    const docRef = doc(db, "users-test", userId);
    await setDoc(docRef, { preferences }, { merge: true });
  };

  const isUsernameAvailable = async (username: string): Promise<boolean> => {
    if (!username) return false;
    const usersRef = collection(db, "users-test");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocsFromServer(q);
    return querySnapshot.empty;
  };

  return {
    getUserProfile,
    saveUserProfile,
    saveUserPreferences,
    isUsernameAvailable,
  };
};
