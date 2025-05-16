import { doc, deleteDoc } from "firebase/firestore";
import { db } from "/src/components/firebase";

const deleteExtraToy = async (id) => {
  try {
    await deleteDoc(doc(db, "ExtraToys", id));
    console.log(`Leksak med id ${id} har raderats från ExtraToys.`);
  } catch (error) {
    console.error("Kunde inte ta bort leksaken:", error);
  }
};

export default deleteExtraToy;
