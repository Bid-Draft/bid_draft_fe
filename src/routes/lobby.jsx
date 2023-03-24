// import { useState } from 'react';
// import * as React from 'react';  
// import Stack from '@mui/material/Stack';  
// import Button from '@mui/material/Button';  
// import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import  {Dropdown, DropdownMenuItem} from '../components/dropdown/dropdown';


import * as React from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import '../App.css';
import Button from '@mui/material/Button'; 
import { useState } from 'react';


export const lobbyLoader = async ({ params }) => {
  const {gameId} = params
  const results = await fetch (`http://localhost:3000/api/v1/cards?id=${gameId}`);

  const  cards = await results.json();

  return {cards};
};
// const [bid1, bid1Set]  = useState("1")
// const [bid2, bid2Set]  = useState("1")
// const [bid3, bid3Set]  = useState("1")
const makeBid = async (set) => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/game?set=${set}`, {
        method: "POST"
    });
    const result = await response.json();
  } catch(error) {
    console.log(error)
  };
};

const Lobby = () => {
const [bid1, setBid1]  = useState("0")
const [bid2, setBid2]  = useState("0")
const [bid3, setBid3]  = useState("0")
// const handleChange = (event) => {
//   console.log(event)
//   bid1Set(event.target.value )
// }
  const result = useLoaderData()
  const cards = result.cards.cards
  return(
    <div class="row">
  <div class="column">
    <img src={cards[0].image} alt="Snow"></img>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {bid1} 
    onChange= {(event) => {
      setBid1(event.target.value);
    }}/>
  </div>
  <div class="column">
    <img src={cards[1].image} alt="Forest"></img>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {bid2} 
        onChange= {(event) => {
          setBid2(event.target.value);
        }}/>
    <Button 
        onClick={() => makeBid(bid1,bid2,bid3)}
        variant="contained">Place Bid</Button>  
  </div>
  <div class="column">
    <img src={cards[2].image} alt="Mountains"></img>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {bid3}
        onChange= {(event) => {
          setBid3(event.target.value);
        }}/>
  </div>
</div>

  )
}

export default Lobby;