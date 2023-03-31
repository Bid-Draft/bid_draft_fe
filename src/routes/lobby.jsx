import * as React from "react";
import { useLoaderData, useSearchParams, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import '../App.css';
import Button from '@mui/material/Button'; 
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { compose } from "@mui/system";



const Lobby = () => {

if (localStorage.getItem('userId') === null){
  localStorage.setItem('userId', (uuidv4()));
}

const [bid1, setBid1]  = useState("0")
const [bid2, setBid2]  = useState("0")
const [bid3, setBid3]  = useState("0")
const [displayResults, setDisplayResults] = useState(false)
const [cards, setCards]  = useState([
  {id: 529, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130550&type=card'},
  {id: 530, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129465&type=card'},
  {id: 531, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=129710&type=card'}])
const [justLoaded, setJustLoaded] = useState(false)
const [newCards, setNewCards] = useState(false)
const [data, setData] = useState(null);
const [bids, setBids] = useState([]);
const [lastCardId, setLastCardId] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    checkCards();
  }, 4000);

  return () => clearInterval(interval);
}, []);

const checkCards = async () => {
  const response = await fetch(`http://localhost:3000/api/v1/bids?game_id=${game}`);
  const json = await response.json();
  console.log(newCards)
  // setLastCardId(json["bids"][0]["card_id"])
  // if (json["complete"] === "true" && lastCardId === json["bids"][0]["card_id"]) {
  if (json["complete"] === "true" ) {
    setBids(json["bids"])
    setDisplayResults(true);
    delayCards()
    setLastCardId(json["bids"][2]["card_id"])
  }
};

const delayCards = async () => {
setTimeout(() => {
  setNewCards(false);
  getCards(game);
  setDisplayResults(false);
}, 10000);}


const makeBid = async (bid1,bid2,bid3) => {

  try {
    const response = await fetch(`http://localhost:3000/api/v1/bids`, {
        method: "POST",
        body: JSON.stringify({gameId:game, bid1: bid1, bid2: bid2, bid3: bid3, uuid: localStorage.getItem('userId'
        )})
    });
    const result = await response.json();
    return result
  } catch(error) {
    console.log(error)
  };
};
const game = useParams().gameId

const getCards = async (game) => {
  try {
    const results = await fetch (`http://localhost:3000/api/v1/cards?id=${game}`);
  
    const  data = await results.json();
   setCards(data.cards)
    return data
  } catch(error) {
    console.log(error)
  };
};

   function bidButton(bid1,bid2,bid3) {  
    const test = makeBid(bid1,bid2,bid3)
    setNewCards(true)
  }

  if (!justLoaded){
    getCards(game)
    setJustLoaded(true)
  }

  return(
    
    <div class="row">
  <div class="column">
    <img src={cards[0].image} alt="Snow"></img>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {bid1} 
    onChange= {(event) => {
      setBid1(event.target.value);
    }}/>
    {displayResults ? (
  <div class="w3-container">
    {/* if (bids[0]) {
      setCount(1);
    } else if (count === 1) {
      setCount(2);
    } else {
      setCount(0);
    } */}
  }
    <p>The w3-container class is an important#{game} w3.CSS class.</p>
  </div>
) : null}
  </div>
  <div class="column"  >
    <img src={cards[1].image} alt="Forest"></img>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {bid2} 
        onChange= {(event) => {
          setBid2(event.target.value);
        }}/>
    {newCards ? null :    
    <Button
        onClick={() => bidButton(bid1,bid2,bid3)}
        variant="contained">Place Bid</Button> }
{displayResults ? (
  <div class="w3-container">
    <p>The w3-container class is an important#{game} w3.CSS class.</p>
  </div>
) : null}

  </div>
  <div class="column">
    <img src={cards[2].image} alt="Mountains"></img>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {bid3}
        onChange= {(event) => {
          setBid3(event.target.value);
        }}/>
        {displayResults ? (
  <div class="w3-container">
    <p>The w3-container class is an important#{game} w3.CSS class.</p>
  </div>
) : null}
  </div>
</div>

  )
}

export default Lobby;