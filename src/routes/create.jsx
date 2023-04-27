import * as React from "react";
import { useState } from 'react';
import Select from "@mui/material/Select";
import Button from '@mui/material/Button'; 
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

const SelectSet = () => {

  if (localStorage.getItem('userId') === null){
    localStorage.setItem('userId', (uuidv4()));
  }

  const [set, setSet]  = useState("RTR")
  const handleChange = (event) => {
     setSet(event.target.value )
  }

  let navigate = useNavigate(); 
  const routeChange = (id) =>{ 
    let path = `/lobby/${id}`; 
    navigate(path);
  }

  const makeGame = async (set) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/game?set=${set}&player_one_uuid=${localStorage.getItem('userId')}`, {
          method: "POST"
      });
      const result = await response.json();
      routeChange(result.id);
    } catch(error) {
      console.log(error)
    };
  };

  return (
<FormControl fullWidth>
  <InputLabel> Set </InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value= {set}
    label="Age"
    onChange= {handleChange} 
  >
    <MenuItem value={"MOM"}>MOM</MenuItem>
    <MenuItem value={"ONE"}>ONE</MenuItem>
    <MenuItem value={"BRO"}>BRO</MenuItem>
    <MenuItem value={"DMU"}>DMU</MenuItem>
    <MenuItem value={"SNC"}>SNC</MenuItem>
    <MenuItem value={"NEO"}>NEO</MenuItem>
    <MenuItem value={"VOW"}>VOW</MenuItem>
    <MenuItem value={"MID"}>MID</MenuItem>
    <MenuItem value={"AFR"}>AFR</MenuItem>
    <MenuItem value={"STX"}>STX</MenuItem>
    <MenuItem value={"KHM"}>KHM</MenuItem>
    <MenuItem value={"ZNR"}>ZNR</MenuItem>
    <MenuItem value={"IKO"}>IKO</MenuItem>
    <MenuItem value={"M21"}>M21</MenuItem>
    <MenuItem value={"THB"}>THB</MenuItem>
    <MenuItem value={"ELD"}>ELD</MenuItem>
    <MenuItem value={"M20"}>M20</MenuItem>
    <MenuItem value={"WAR"}>WAR</MenuItem>
    <MenuItem value={"RNA"}>RNA</MenuItem>
    <MenuItem value={"GRN"}>GRN</MenuItem>
    <MenuItem value={"M19"}>M19</MenuItem>
    <MenuItem value={"DOM"}>DOM</MenuItem>
    <MenuItem value={"RIX"}>RIX</MenuItem>
    <MenuItem value={"XLN"}>XLN</MenuItem>
    <MenuItem value={"HOU"}>HOU</MenuItem>
    <MenuItem value={"AKH"}>AKH</MenuItem>
    <MenuItem value={"AER"}>AER</MenuItem>
    <MenuItem value={"KLD"}>KLD</MenuItem>
    <MenuItem value={"EMN"}>EMN</MenuItem>
    <MenuItem value={"SOI"}>SOI</MenuItem>
    <MenuItem value={"OGW"}>OGW</MenuItem>
    <MenuItem value={"BFZ"}>BFZ</MenuItem>
    <MenuItem value={"ORI"}>ORI</MenuItem>
    <MenuItem value={"DTK"}>DTK</MenuItem>
    <MenuItem value={"FRF"}>FRF</MenuItem>
    <MenuItem value={"KTK"}>KTK</MenuItem>
    <MenuItem value={"M15"}>M15</MenuItem>
    <MenuItem value={"JOU"}>JOU</MenuItem>
    <MenuItem value={"BNG"}>BNG</MenuItem>
    <MenuItem value={"THS"}>THS</MenuItem>
    <MenuItem value={"M14"}>M14</MenuItem>
    <MenuItem value={"DGM"}>DGM</MenuItem>
    <MenuItem value={"GTC"}>GTC</MenuItem>
    <MenuItem value={"RTR"}>RTR</MenuItem>
    <MenuItem value={"M13"}>M13</MenuItem>
    <MenuItem value={"AVR"}>AVR</MenuItem>
    <MenuItem value={"DKA"}>DKA</MenuItem>
    <MenuItem value={"ISD"}>ISD</MenuItem>
    <MenuItem value={"M12"}>M12</MenuItem>
  </Select>
  <Button 
        onClick={() => makeGame(set)}
        variant="contained">Start Draft</Button>  
</FormControl>
  );
}

export default SelectSet;