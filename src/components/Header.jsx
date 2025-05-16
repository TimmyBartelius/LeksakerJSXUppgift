import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();

  const handleClickLogo = () => {
    navigate("/");
  };
  const handleClickCart = () => {
    navigate("/Cart");
  };

  //TODO: Gör handleclick för sommar, vinter, bräd och batterileksaker (Om tid finns, VG kriterie)
  return (
    <header>
      <section id="allLogosHeader">
        <nav href="home">
          <img
            onClick={handleClickLogo}
            id="logo"
            src={`${import.meta.env.BASE_URL}Logga`}
            alt="Logga"
          ></img>
        </nav>
        <p id="franchise">SVENSKA LEKSAKER AB</p>
        <nav href="cart">
          <img
            onClick={handleClickCart}
            id="cartLogo"
            src={`${import.meta.env.BASE_URL}Cart`}
            alt="Cart"
          />
        </nav>
      </section>
      <div id="allProductsBtns">
        <nav className="picForCat">
          <img
            src={`${import.meta.env.BASE_URL}Sommarbild`}
            alt="Sommarleksaker"
          />
          <p className="categories">Sommarleksaker</p>
          <p className="hidden-categories-text">SOMMAR</p>
        </nav>
        <nav className="picForCat">
          <img
            src={`${import.meta.env.BASE_URL}Vinterbild`}
            alt="Vinterleksaker"
          />
          <p className="categories">Vinterleksaker</p>
          <p className="hidden-categories-text">VINTER</p>
        </nav>
        <nav className="picForCat">
          <img
            src={`${import.meta.env.BASE_URL}Brädspelsbild`}
            alt="Brädspel"
          />
          <p className="categories">Brädspel</p>
          <p className="hidden-categories-text">BRÄD</p>
        </nav>
        <nav className="picForCat">
          <img
            src={`${import.meta.env.BASE_URL}Batteridrivna`}
            alt="Batteridrivna leksaker"
          />
          <p className="categories">Batteridrivet</p>
          <p className="hidden-categories-text">BATTERI</p>
        </nav>
      </div>
    </header>
  );
};

export default Header;

//1. Headern behöver logga, cart, Produkt-knapp samt blå bakgrund (CHECK)
//2. Logga skall visa sig tryckbar, på klick skall den leda till "hem"-skärmen, alltså startsidan (CHECK)
//3. Cart skall visa sig tryckbar, på klick skall den leda till "kundvagnen"(CHECK)
