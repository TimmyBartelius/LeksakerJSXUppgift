import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const clearExtraToys = async () => {
  try {
    const extraToysSnapshot = await getDocs(collection(db, "ExtraToys"));
    const deletions = extraToysSnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "ExtraToys", docSnap.id))
    );
    await Promise.all(deletions);
    console.log("ExtraToys har rensats.");
  } catch (error) {
    console.error("Fel vid rensning av ExtraToys:", error);
    throw error;
  }
};
