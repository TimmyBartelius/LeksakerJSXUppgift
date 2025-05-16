import { useState, useEffect } from "react";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Joi from "joi";
import "./AllToys-style.css";

export default function AllToys({ toys }) {
  const [cart, setCart] = useState([]);
  const [addedToCart, setAddedToCart] = useState(new Set());

  const toySchema = Joi.object({
    title: Joi.string().required(),
    image: Joi.string().uri().required(),
    breadtext: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().optional(),
  });

  useEffect(() => {
    const fetchCart = async () => {
      const cartCol = collection(db, "Kundvagn");
      const cartSnapshot = await getDocs(cartCol);
      const cartList = cartSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCart(cartList);
      setAddedToCart(new Set(cartList.map((item) => item.id)));
    };

    fetchCart();
  }, []);

  const addToyToCart = async (toyId) => {
    try {
      const toyData = toys.find((toy) => toy.id === toyId);

      if (!toyData) {
        console.error("Leksak hittades inte i listan");
        return;
      }

      const { error } = toySchema.validate(toyData);
      if (error) {
        console.error("Valideringsfel:", error.details);
        return;
      }

      // Uppdatera kundvagn (Firestore)
      const cartRef = doc(db, "Kundvagn", toyId);
      const cartSnapshot = await getDoc(cartRef);

      if (cartSnapshot.exists()) {
        const existingData = cartSnapshot.data();
        await setDoc(cartRef, {
          ...existingData,
          quantity: existingData.quantity + 1,
        });
      } else {
        await setDoc(cartRef, { ...toyData, quantity: 1 });
      }

      console.log("Leksak tillagd i kundvagnen!");

      // Uppdatera lokal state (cart och addedToCart)
      setCart((prevCart) => {
        const found = prevCart.find((item) => item.id === toyId);
        if (found) {
          return prevCart.map((item) =>
            item.id === toyId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, { id: toyId, ...toyData, quantity: 1 }];
        }
      });

      setAddedToCart((prev) => new Set(prev).add(toyId));
    } catch (error) {
      console.error("Fel vid tillägg av leksak till kundvagn:", error);
    }
  };

  const removeToyFromCart = async (toyId) => {
    try {
      const cartRef = doc(db, "Kundvagn", toyId);
      const cartSnapshot = await getDoc(cartRef);

      if (!cartSnapshot.exists()) return;
      const data = cartSnapshot.data();

      if (data.quantity > 1) {
        await setDoc(cartRef, { ...data, quantity: data.quantity - 1 });
      } else {
        await deleteDoc(cartRef);
      }

      setCart((prevCart) => {
        const found = prevCart.find((item) => item.id === toyId);
        if (!found) return prevCart;
        if (found.quantity > 1) {
          return prevCart.map((item) =>
            item.id === toyId ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return prevCart.filter((item) => item.id !== toyId);
        }
      });

      setAddedToCart((prev) => {
        const newSet = new Set(prev);
        newSet.delete(toyId);
        return newSet;
      });
    } catch (error) {
      console.error("Fel vid borttagning av leksak från kundvagn:", error);
    }
  };

  return (
    <div>
      <ul className="toy-card">
        {toys.map((toy) => (
          <li className="list-items" key={toy.id}>
            <div className="title-card">{toy.title}</div>
            <img className="title-picture" src={toy.image} alt={toy.title} />
            <button id="addBtn" onClick={() => addToyToCart(toy.id)}>
              LÄGG TILL
            </button>
            <button id="remBtn" onClick={() => removeToyFromCart(toy.id)}>
              TA BORT
            </button>
            <p id="quantityInCart">
              {" "}
              {cart.find((item) => item.id === toy.id)?.quantity || 0} st
            </p>
            <div className="text-card">{toy.breadtext}</div>
            <div className="price-card">{toy.price} kr</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

//Här kommer Firebase in, vi importerar React för att använda state och effect, sedan importerar vi även collection och documents från firebase för att kunna använda våra array/collections där.

//KOLLA UPP USEEFFECT MER INNAN DU UTTALAR DIG OM DEN, just nu är den magisk.

//Förklaringar av ändringar:
//State för kundvagn:

//Jag har lagt till en ny state-variabel cart för att hålla reda på leksaker som är tillagda i kundvagnen. Denna state uppdateras varje gång en leksak läggs till eller tas bort från kundvagnen.

//Hämta kundvagnens innehåll:

//En useEffect som hämtar leksakerna från samlingen "Kundvagn" och visar dem på hemsidan.

//Lägga till leksak i kundvagn:

//Funktionen addToyToCart lägger till en leksak i samlingen "Kundvagn" i Firestore och uppdaterar kundvagnslistan i React-komponenten.

//Ta bort leksak från kundvagn:

//Funktionen removeToyFromCart tar bort leksaken från samlingen "Kundvagn" i Firestore och uppdaterar den lokala cart-listan, så att den tas bort från användarens kundvagn på sidan utan att påverka samlingen "AllToys".
