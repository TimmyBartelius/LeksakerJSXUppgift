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
import "/Edit.css";
import Header from "/src/components/Header";
import { clearExtraToys } from "/src/Components/clearExtraToys";
import deleteExtraToy from "/src/components/deleteToys";

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
      // Hämta standard från AllToys
      const snapshotOriginal = await getDocs(collection(db, "AllToys"));
      const listOriginal = snapshotOriginal.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOriginalProducts(listOriginal);

      // Hämta nya från ExtraToys
      const snapshotNew = await getDocs(collection(db, "ExtraToys"));
      const listNew = snapshotNew.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewProducts(listNew);

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
      image:
        "https://scontent-arn2-1.xx.fbcdn.net/v/t39.30808-6/458383024_10162048330247360_5508830640052136751_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=PUyAbWEdSBsQ7kNvwHzyqEA&_nc_oc=AdkXG8LUdaqK1HiAwY82eGYy_qfW6iOkgktdXRfq-GwA78ineTqWnCeGjDMawyPrVZJpDQNQNTsS0rtAvKlLSNgV&_nc_zt=23&_nc_ht=scontent-arn2-1.xx&_nc_gid=5oze6tWXtUWZ-unI_ZeUAg&oh=00_AfJAx2Ohb-dOC175vD2XjdeqNpF03cb14G9p8EM6A_dq5g&oe=682D2138",
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
          <div key={p.id}>
            <button onClick={() => deleteExtraToy(p.id)}>Ta bort</button>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <Header />
      <div className="edit-container">
        <button className="buttons-editor" onClick={clearExtraToys}>
          Ta bort ALLA nya produkter
        </button>
        <button className="buttons-editor" onClick={handleAddProduct}>
          Lägg till ny produkt
        </button>

        <div className="buttons-in-editor">
          <button
            className="buttons-editor"
            onClick={() => setShowOriginal((prev) => !prev)}
          >
            {showOriginal ? "Dölj originalprodukter" : "Visa originalprodukter"}
          </button>

          <button
            className="buttons-editor"
            onClick={() => setShowNew((prev) => !prev)}
          >
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
