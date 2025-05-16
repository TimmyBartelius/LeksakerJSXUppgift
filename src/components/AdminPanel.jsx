import { useEffect, useState } from "react";
import { db } from "/src/components/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import TextField from "/TextField";

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [errors, setErrors] = useState({}); // För nya produkter

  const productsCollection = collection(db, "produkter");

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(productsCollection);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    };
    fetchProducts();
  }, []);

  const updateProduct = async (id, updatedData) => {
    if (updatedData.pris !== undefined) {
      const priceNum = parseFloat(updatedData.pris);
      if (isNaN(priceNum) || priceNum < 0) return; // Enkel validering
      updatedData.pris = priceNum;
    }
    const productDoc = doc(db, "produkter", id);
    await updateDoc(productDoc, updatedData);
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedData } : p))
    );
  };

  const validateNewProduct = () => {
    const errs = {};
    if (newName.trim() === "") errs.newName = "Namn krävs";
    const priceNum = parseFloat(newPrice);
    if (newPrice.trim() === "") errs.newPrice = "Pris krävs";
    else if (isNaN(priceNum) || priceNum < 0) errs.newPrice = "Ogiltigt pris";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const addProduct = async () => {
    if (!validateNewProduct()) return;

    const docRef = await addDoc(productsCollection, {
      namn: newName,
      pris: parseFloat(newPrice),
    });

    setProducts((prev) => [
      ...prev,
      { id: docRef.id, namn: newName, pris: parseFloat(newPrice) },
    ]);
    setNewName("");
    setNewPrice("");
    setErrors({});
  };

  const deleteProduct = async (id) => {
    const productDoc = doc(db, "produkter", id);
    await deleteDoc(productDoc);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <TextField
        label="Pris"
        value={newPrice}
        onChange={setNewPrice}
        placeholder="Pris i SEK"
        error={errors.newPrice}
      />
    </div>
  );
}
