import { useNavigate } from "react-router-dom"; //Jag importerar useNavigate från react-router-dom för att kunna använda routern
import "/Footer.css";

//Jag importerar css style från Footer.css

const Footer = () => {
  //Jag säger att constanten (Footer) får en arrow-function som i sin tur säger åt constanten "navigate" att använda useNavigate från react-router-dom som vi tidigare importerat.
  const navigate = useNavigate();

  const handleClickAdmin = () => {
    navigate("/Login");
  };

  return (
    //Jag returnerar det som syns på skärmen och använder id för att stylea min footer, knappar för att navigera vidare från vilken sida man befinner sig på
    <main>
      <section id="footerBack">
        <button onClick={handleClickAdmin} id="adminLogin">
          <img src={`${import.meta.env.BASE_URL}Admin.PNG`} alt="AdminLogin" />
        </button>
      </section>
    </main>
  );
};

export default Footer;
//Jag exporterar Footern till App för att kunna använda den som tänkt.

//1. Footern skall avgränsa med samma blåa färg som Headern
//2. Det skall finnas en inlogg-ikon för admin (Om tid finns)
//3. Till höger skall det finnas en knapp som leder till alla produkter (samt rensar filtreringen)
