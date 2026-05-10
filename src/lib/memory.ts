import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import { db } from "./firebase";

export interface UserMemory {
  userId: string;
  careerGoals: string[];
  preferredDomain: string;
  skillGaps: any[];
  completedTasks: string[];
  lastResumeAnalysis?: any;
  lastRoadmap?: any;
  interviewPerformance?: any[];
  updatedAt: any;
  streak?: number;
}


const MEMORY_COLLECTION = "user_memory";

export const MemoryService = {
  // Check if onboarding is complete
  async isOnboarded(userId: string): Promise<boolean> {
    const docRef = doc(db, MEMORY_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() && !!docSnap.data().preferredDomain;
  },

  // Get memory for a specific user

  async getMemory(userId: string = "aryan"): Promise<UserMemory | null> {
    const docRef = doc(db, MEMORY_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserMemory;
    }
    return null;
  },

  // Save or update memory
  async updateMemory(userId: string = "aryan", data: Partial<UserMemory>) {
    const docRef = doc(db, MEMORY_COLLECTION, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        userId,
        careerGoals: [],
        preferredDomain: "",
        skillGaps: [],
        completedTasks: [],
        updatedAt: serverTimestamp(),
        ...data
      });
    }
  },

  // Add a completed task
  async completeTask(userId: string = "aryan", taskId: string) {
    const docRef = doc(db, MEMORY_COLLECTION, userId);
    await updateDoc(docRef, {
      completedTasks: arrayUnion(taskId),
      updatedAt: serverTimestamp()
    });
  },

  // Add interview performance
  async addInterviewResult(userId: string = "aryan", result: any) {
    const docRef = doc(db, MEMORY_COLLECTION, userId);
    await updateDoc(docRef, {
      interviewPerformance: arrayUnion(result),
      updatedAt: serverTimestamp()
    });
  }
};
