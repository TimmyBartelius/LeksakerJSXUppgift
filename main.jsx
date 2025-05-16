import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
<<<<<<< HEAD:src/main.jsx
import App from "./App.jsx";
import { CartProvider } from "./components/CartContext.jsx";
=======
import App from "./src/App.jsx";
import { CartProvider } from "./src/components/CartContext.jsx";
>>>>>>> 9e245bada5dd8824f98106812d7194b351c83852:main.jsx

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </CartProvider>
  </React.StrictMode>
);

//Efter mycket om och men, har jag försökt undvika de tre dödsbokstäverna "DOM" men så som jag förstått det är detta ingen DOM manipulation då det går igenom Reacts DOM hanterare? Det var lite luddigt - får återkomma mer exakt vad det betydde innan jag vågar uttala mig självsäkert.

//Tillägg: Angående det ovan om DOM-manipulation, vi kopplar React till index.html när vi använder createRoot, detta för att ge React sökvägen för index.html. Så det är ingen DOM-manipulation, det ger bara React en väg till att koppla sig gentemot index.html - om jag fattat det rätt. Dubbelkolla med David senare.
