import { collection, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from "..firebase";

const clearCart = async () => {
  const cartCollection = collection(db, "Kundvagn");
  const cartSnapshot = await getDocs(cartCollection);

  const deletePromises = cartSnapshot.docs.map((docSnap) =>
    deleteDoc(doc(db, "Kundvagn", docSnap.id))
  );

  await Promise.all(deletePromises);
  console.log("Kundvagnen är rensad!");
};
