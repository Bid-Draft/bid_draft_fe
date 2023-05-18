import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import logo from "../images/logo.png";
import '../App.css';

const SelectSet = () => {
  if (localStorage.getItem("userId") === null) {
    localStorage.setItem("userId", uuidv4());
  }

  const [set, setSet] = useState("RTR");
  const handleChange = (event) => {
    setSet(event.target.value);
  };

  let navigate = useNavigate();
  const routeChange = (id) => {
    let path = `/lobby/${id}`;
    navigate(path);
  };

  const makeGame = async (set) => {
    try {
      const response = await fetch(
        `https://vast-savannah-37442.herokuapp.com/api/v1/game?set=${set}&player_one_uuid=${localStorage.getItem(
          "userId"
        )}`,
        {
          method: "POST",
        }
      );
      const result = await response.json();
      routeChange(result.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div class = "home-page">
    <div class = "home-background">
    <img class = "logo" src={logo} alt="Your image description" />
      <div>
        <div class ="select-set">
          <select 
            name="set"
            id="set-select"
            value={set}
            onChange={handleChange}
          >
        <option value={"MOM"}>MOM</option>
        <option value={"ONE"}>ONE</option>
        <option value={"BRO"}>BRO</option>
        <option value={"DMU"}>DMU</option>
        <option value={"SNC"}>SNC</option>
        <option value={"NEO"}>NEO</option>
        <option value={"VOW"}>VOW</option>
        <option value={"MID"}>MID</option>
        <option value={"AFR"}>AFR</option>
        <option value={"STX"}>STX</option>
        <option value={"KHM"}>KHM</option>
        <option value={"ZNR"}>ZNR</option>
        <option value={"IKO"}>IKO</option>
        <option value={"M21"}>M21</option>
        <option value={"THB"}>THB</option>
        <option value={"ELD"}>ELD</option>
        <option value={"M20"}>M20</option>
        <option value={"WAR"}>WAR</option>
        <option value={"RNA"}>RNA</option>
        <option value={"GRN"}>GRN</option>
        <option value={"M19"}>M19</option>
        <option value={"DOM"}>DOM</option>
        <option value={"RIX"}>RIX</option>
        <option value={"XLN"}>XLN</option>
        <option value={"HOU"}>HOU</option>
        <option value={"AKH"}>AKH</option>
        <option value={"AER"}>AER</option>
        <option value={"KLD"}>KLD</option>
        <option value={"EMN"}>EMN</option>
        <option value={"SOI"}>SOI</option>
        <option value={"OGW"}>OGW</option>
        <option value={"BFZ"}>BFZ</option>
        <option value={"ORI"}>ORI</option>
        <option value={"DTK"}>DTK</option>
        <option value={"FRF"}>FRF</option>
        <option value={"KTK"}>KTK</option>
        <option value={"M15"}>M15</option>
        <option value={"JOU"}>JOU</option>
        <option value={"BNG"}>BNG</option>
        <option value={"THS"}>THS</option>
        <option value={"M14"}>M14</option>
        <option value={"DGM"}>DGM</option>
        <option value={"GTC"}>GTC</option>
        <option value={"RTR"}>RTR</option>
        <option value={"M13"}>M13</option>
        <option value={"AVR"}>AVR</option>
        <option value={"DKA"}>DKA</option>
        <option value={"ISD"}>ISD</option>
        <option value={"M12"}>M12</option>
          </select>
          <button class ="start-button" onClick={() => makeGame(set)}>Start</button>
        </div>
        </div>
    </div>
  </div>
  );
};

export default SelectSet;
