import { useState } from "react";
import Joi from "joi";
import "./Loginstyle.css";
import Header from "./Header";
import Footer from "./Footer";

const schema = Joi.string().required().messages({
  "string.empty": "Lösenordet krävs.",
});
//Vi ger villkor för lösenordet, det får inte vara ett tomt fält för då säger string.empty till, det måste vara minst 8 tecken annars säger string.min till, det får vara max 32 tecken annars säger string.max till.

export default function AdminPasswordInput({ onChange }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const correctPassword = "password";
  //Vi lägger till ett "standard lösenord" som är "rätt" vid inloggning, annars lägger vi upp att vi använder useState med tomma fält.
  const handleLogin = () => {
    const validation = schema.validate(password);
    if (validation.error) {
      //Om valideringsfel händer detta
      setError(validation.error.details[0].message);
      //Om valideringsfel, gå till errors, se efter vilket villkor som inte möts, skicka tillbaka knutet meddelande om fel
      setSuccessMessage("");
    } else if (password !== correctPassword) {
      //Annars händer detta (vid rätt lösenord)
      setError("Fel lösenord, försök igen tack!");
      //Om det specifika lösenordet inte skrivs in kommer det här error-meddelandet istället för det i listan ovan.
      setSuccessMessage("");
    } else {
      //Annars händer detta
      setError("");
      setSuccessMessage("Inloggningen lyckades!");
      //Om du lyckas logga in (i detta fall med rätt lösenord) så kommer detta meddelandet upp.
    }
  };

  return (
    <>
      <Header />
      <div className="admin-field">
        <label className="admin-text" htmlFor="admin-password">
          Admin-Login
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input-field"
          placeholder="Ange Lösenord"
        />
        <button onClick={handleLogin} id="LoginBtn">
          Logga In
        </button>
        {error && <p className="error-field">{error}</p>}
        {successMessage && <p className="success-field">{successMessage}</p>}
      </div>
      <Footer />
    </>
  );
}
