import { createContext, useContext, useEffect, useState } from "react";
import { db } from "/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// Skapa Context
const CartContext = createContext();

// Provider-komponent
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Kundvagn"), (snapshot) => {
      //Se till att ändra detta - kolla på Davids exempel i guiderna, onSnapshot tar en "bild" av databasen, därför "unsubscribe" måste köras så den vet vart det skall ta slut för att fåttag i listan. Det funkar som det är, om du HINNER så byter du ut det - lämna det annars ifred.
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    });

    return () => unsubscribe();
  }, []);

  // töm kundvagnen
  const clearCart = async () => {
    const cartCol = collection(db, "Kundvagn");
    const cartSnapshot = await getDocs(cartCol);

    const deletePromises = cartSnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "Kundvagn", docSnap.id))
    );

    await Promise.all(deletePromises);
    console.log("Kundvagnen är tömd.");
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
