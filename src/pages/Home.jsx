import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "/src/components/firebase";
import "../components/Home.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AllToys from "../components/Firebase/AllToys";

export default function Home() {
  const [allToys, setAllToys] = useState([]);

  useEffect(() => {
    const fetchToys = async () => {
      const allToysSnapshot = await getDocs(collection(db, "AllToys"));
      const extraToysSnapshot = await getDocs(collection(db, "ExtraToys"));

      const allToysList = allToysSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const extraToysList = extraToysSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const combinedToys = [...allToysList, ...extraToysList];

      setAllToys(combinedToys);
    };
    fetchToys();
  }, []);

  return (
    <main>
      <Header />
      <div>
        <h2 className="headline">VÅRA PRODUKTER</h2>
      </div>
      <AllToys toys={allToys} />
      <Footer />
    </main>
  );
}

//1. Header på toppen (CHECK)

//2. Produkter i ett rutnät (krav för G) 1 rad när skärmen är smal, 2 när det går. (CHECK)
//2a) Du har en lista för produkter (AllToys), en lista för kundvagn (Kundvagn/Cart) och senare en lista för att redigera produkter (Edit) - som på grupprojeketet

//3. Bild på produkt, lägg-till/ta-bort till höger om bilden, kort beskrivning av varan under och pris i stor text. (CHECK)

//3a) Bilden finns på Figma - skall ha en border och ligga i en stor container tillsammans med resten. (CHECK)
//3b) Lägg-till/ta-bort, skall ligga i samma höjd som bilden - du skall kunna trycka på lägg till för att skicka en produkt till varukorgen men också ta bort för att kunna ta bort den eller om du har fler av samma i vagnen. (En counter skall finnas i mitten (överkurs, om du har tid)) (CHECK FÖRUTOM VG KRAVET)
//3c) Priset skall vara tydligt och stort, det skall stå ut i rutan och synas som mest. (CHECK)

//4. Footer på botten (CHECK)
