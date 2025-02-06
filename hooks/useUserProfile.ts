import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@clerk/clerk-expo";

interface UserProfile {
  firstName: string;
  lastName: string;
  username: string;
  profileImage: string;
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

  return {
    getUserProfile,
    saveUserProfile,
  };
};
