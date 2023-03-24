import * as React from "react";
import { useState } from 'react';
import Select from "@mui/material/Select";
import Button from '@mui/material/Button'; 
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useNavigate } from "react-router-dom";


const SelectSet = () => {
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
      const response = await fetch(`http://localhost:3000/api/v1/game?set=${set}`, {
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
    <MenuItem value={"RTR"}>RTR</MenuItem>
    <MenuItem value={"INS"}>INS</MenuItem>
    <MenuItem value={"KTK"}>KTK</MenuItem>
  </Select>
  <Button 
        onClick={() => makeGame(set)}
        variant="contained">Start Draft</Button>  
</FormControl>
  );
}

export default SelectSet;