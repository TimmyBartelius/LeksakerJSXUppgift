import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminPasswordInput from "./components/Login";
import Cart from "./pages/Cart";
import AdminPanel from "./components/AdminPanel.jsx";

function Home() {
  return <div>Hej från Home</div>;
}

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Login" element={<AdminPasswordInput />} />
        <Route path="/Cart/Login" element={<AdminPasswordInput />} />
        <Route path="/Login/AdminPanel" element={<AdminPanel />} />
      </Routes>
    </main>
  );
}

//Vi importerar HashRouter, Routes och Route från react-router-dom, just för att kunna göra våra sökvägar med HashRouter som vi delat in ovan. Våran Route behövder då en path som vi indikerar med / som vår "startsida", som vi även kallar för Home, som är en sida vi i sin tur har importerat från Home i pages.
