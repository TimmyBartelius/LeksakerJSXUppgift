import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "/components/CartContext";
import Header from "/components/Header";
import Footer from "/components/Footer";
import "/components/Cart.css";

const Cart = () => {
  const { cartItems, clearCart } = useCart();
  const [showThankYou, setShowThankYou] = useState(false);

  const handleClearCart = async () => {
    await clearCart(); //Tömmer Firebase-databasen, i detta fall Kundvagn som representerar kundens kundvagn, vi tömmer alltså INTE "huvudlistan" med alla produkter utan vi skapar en för kunden som blir unik för denne.
    setShowThankYou(true); //Vi visar tackmeddelandet
    setTimeout(() => setShowThankYou(false), 4000);
    //Vi döljer det hela efter 4 sekunder så varukorgen återgår till sin "standard" inställning där den är tom.
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const quantity = item.quantity ?? 1;
    return sum + item.price * quantity;
  }, 0);

  return (
    <main>
      <Header />
      <h2 id="your-cart">DIN VARUKORG</h2>

      {showThankYou && <p className="thank-you">Tack för ditt köp! 💖</p>}

      {cartItems.length === 0 && !showThankYou ? (
        <p className="thank-you">Varukorgen är tom</p>
      ) : (
        <>
          <ul className="listed-items">
            {cartItems.map((item) => (
              <li key={item.id} className="seperation">
                <p className="title-text">{item.title} </p>
                <img
                  src={item.image}
                  alt={item.title}
                  id="product-pic"
                ></img>{" "}
                <p className="quantity-text">{item.quantity ?? 1} st</p>{" "}
                <p className="price-text">{item.price} kr</p>
              </li>
            ))}
          </ul>
          <p className="total-price">Totalt: {totalPrice} kr</p>
          <button id="end-purchase-button" onClick={handleClearCart}>
            Slutför köp
          </button>
          <Link to="/Login" className="admin-link"></Link>
        </>
      )}

      <Footer />
    </main>
  );
};

export default Cart;
