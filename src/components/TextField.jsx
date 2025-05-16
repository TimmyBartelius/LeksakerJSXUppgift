import { useState, useEffect } from "react";
import { db } from "/src/components/firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Joi from "joi";
import "./Edit.css";
import Header from "/src/components/Header";

export default function TextField() {
  const [originalProducts, setOriginalProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [editCache, setEditCache] = useState({});
  const [showOriginal, setShowOriginal] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const schema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    price: Joi.number().min(0).required(),
    breadtext: Joi.string().allow(""),
    image: Joi.string().uri().allow(""),
    quantity: Joi.number().min(0),
  });

  useEffect(() => {
    const fetchProducts = async () => {
      // Hämta originalprodukter från AllToys
      const snapshotOriginal = await getDocs(collection(db, "AllToys"));
      const listOriginal = snapshotOriginal.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOriginalProducts(listOriginal);

      // Hämta nya produkter från ExtraToys
      const snapshotNew = await getDocs(collection(db, "ExtraToys"));
      const listNew = snapshotNew.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewProducts(listNew);

      // Skapa editCache för båda listorna
      const cache = {};
      [...listOriginal, ...listNew].forEach((p) => {
        cache[p.id] = {
          title: p.title,
          price: p.price,
          breadtext: p.breadtext,
          image: p.image,
          quantity: p.quantity,
        };
      });
      setEditCache(cache);
    };

    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    const newProduct = {
      title: "Ny produkt",
      breadtext: "Beskrivning",
      image: "https://via.placeholder.com/100",
      price: 0,
      quantity: 1,
    };

    const validation = schema.validate(newProduct);
    if (validation.error) {
      console.error("Valideringsfel:", validation.error.details[0].message);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "ExtraToys"), newProduct);
      const added = { id: docRef.id, ...newProduct };

      setEditCache((prev) => ({
        ...prev,
        [docRef.id]: { ...newProduct },
      }));
      setNewProducts((prev) => [...prev, added]);
    } catch (error) {
      console.error("Fel vid tillägg av produkt:", error.message);
    }
  };

  const handleSave = async (id) => {
    const updated = editCache[id];
    const validation = schema.validate(updated);
    if (validation.error) {
      console.error("Valideringsfel:", validation.error.details[0].message);
      return;
    }

    const isNew = newProducts.some((p) => p.id === id);
    const collectionName = isNew ? "ExtraToys" : "AllToys";

    try {
      await updateDoc(doc(db, collectionName, id), updated);

      if (isNew) {
        setNewProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
      } else {
        setOriginalProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
        );
      }
    } catch (error) {
      console.error("Fel vid uppdatering:", error.message);
    }
  };

  const handleEdit = (id, field, value) => {
    setEditCache((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]:
          field === "price" || field === "quantity" ? Number(value) : value,
      },
    }));
  };

  const renderProductList = (list, type) => (
    <ul className={`list-${type}`}>
      {list.map((p) => (
        <li className="list-items-edit" key={p.id}>
          <p>Titel:</p>
          <div
            className="sections-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleEdit(p.id, "title", e.currentTarget.textContent)
            }
          >
            {editCache[p.id]?.title}
          </div>

          <p>Pris:</p>
          <div
            className="sections-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleEdit(p.id, "price", e.currentTarget.textContent)
            }
          >
            {editCache[p.id]?.price}
          </div>

          <p>Informationstext:</p>
          <div
            className="sections-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleEdit(p.id, "breadtext", e.currentTarget.textContent)
            }
          >
            {editCache[p.id]?.breadtext}
          </div>

          <p>Bildlänk:</p>
          <div
            className="sections-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleEdit(p.id, "image", e.currentTarget.textContent)
            }
          >
            {editCache[p.id]?.image}
          </div>

          <p>Antal i lager:</p>
          <div
            className="sections-edit"
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleEdit(p.id, "quantity", e.currentTarget.textContent)
            }
          >
            {editCache[p.id]?.quantity}
          </div>

          <button className="save-btn" onClick={() => handleSave(p.id)}>
            Spara
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Header />
      <div className="edit-container">
        <button onClick={handleAddProduct}>Lägg till ny produkt</button>

        <div className="toggle-buttons">
          <button onClick={() => setShowOriginal((prev) => !prev)}>
            {showOriginal ? "Dölj originalprodukter" : "Visa originalprodukter"}
          </button>

          <button onClick={() => setShowNew((prev) => !prev)}>
            {showNew ? "Dölj nya produkter" : "Visa nya produkter"}
          </button>
        </div>

        {showOriginal && (
          <>
            <h2>Originalprodukter</h2>
            {renderProductList(originalProducts, "original")}
          </>
        )}

        {showNew && (
          <>
            <h2>Nya produkter</h2>
            {renderProductList(newProducts, "new")}
          </>
        )}
      </div>
    </>
  );
}
