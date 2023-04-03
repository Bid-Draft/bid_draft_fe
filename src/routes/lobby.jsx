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
const [showBidButton, setShowBidButton] = useState(true)
const [newCards, setNewCards] = useState(false)
const [data, setData] = useState(null);
const [bids, setBids] = useState([]);
const [pendingCards, setPendingCards] = useState({});
const [playersCards, setPlayersCards] = useState([]);
const [opponentsCards, setOpponentsCards] = useState([]);

useEffect(() => {
  let intervalId;

  if (newCards) {
    intervalId = setInterval(() => {
      checkCards();
    }, 4000);
  }

  return () => clearInterval(intervalId);
}, [!newCards]);

const checkCards = async () => {

  try {
    const response = await fetch(`http://localhost:3000/api/v1/bids?game_id=${game}&last_card=${cards[2].id}`, {
        // body: JSON.stringify({gameIdd:"test", card1Id:"45"})
    });
    const json = await response.json();
    if (json["complete"] === "true" ) {
        setBids(json["bids"])
        assignBids(json["bids"])
        setNewCards(false);
        setDisplayResults(true);
        delayedAfterGoodBidsReceived()
      }
  } catch(error) {
    console.log(error)
  };
};
// const checkCards = async () => {
//   const response = await fetch(`http://localhost:3000/api/v1/bids?game_id=${game}&last_card=${cards[2].id}`);
//   const json = await response.json();
  // if (json["complete"] === "true" ) {
  //   setBids(json["bids"])
  //   assignBids(json["bids"])
  //   setNewCards(false);
  //   setDisplayResults(true);
  //   delayedAfterGoodBidsReceived()
  // }
// };

const assignBids = (data) => {
  data.forEach((bid) => {
    console.log("doin it");
    if (bid.tied === "true") {
      // handle tied bids
    } else if (bid.winner_uuid === localStorage.getItem('userId')) {
      console.log("won");
      console.log(pendingCards[bid.card_id].id);
    } else {
      console.log("lost");
    }
  });
};


const delayedAfterGoodBidsReceived = async () => {
setTimeout(() => {
  getCards(game);
  setDisplayResults(false);
  setShowBidButton(true);
}, 10000);}


const makeBid = async (bid1,bid2,bid3) => {

  try {
    const response = await fetch(`http://localhost:3000/api/v1/bids`, {
        method: "POST",
        body: JSON.stringify({gameId:game, bid1: bid1, bid2: bid2, bid3: bid3, card1Id: cards[0].id, card2Id: cards[1].id, card3Id: cards[2].id, uuid: localStorage.getItem('userId'
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
   assignPendingsCards(data.cards)
    return data
  } catch(error) {
    console.log(error)
  };
};

function assignPendingsCards(cards) {
  const newObj = {};
  
  cards.forEach(obj => {
    const {id, ...rest} = obj;
    newObj[id] = rest;
  });
  console.log(newObj)
  setPendingCards(newObj);
}
   function bidButton(bid1,bid2,bid3) {
    makeBid(bid1,bid2,bid3)  
    setShowBidButton(false)
    setNewCards(true)
  }

  if (!justLoaded){
    getCards(game)
    setJustLoaded(true)
  }

function displayBid(bids, int) {
  let winner = "";
  let loser = "";
  if (bids[int].winner_uuid === localStorage.getItem('userId')) {
    winner = "Your";
    loser = "opponent's";
  } else {
    winner = "Opponent's";
    loser = "your";
  }
  if (bids[int].tied === "true") {
    return `tied with bids of ${bids[int].winner_bid}`;
  } else {
    return `${winner} bid of ${bids[int].winner_bid} beat ${loser} bid of ${bids[int].loser_bid}`;
  }
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
    {displayBid(bids,0)}
  </div>
) : null}
  </div>
  <div class="column"  >
    <img src={cards[1].image} alt="Forest"></img>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" value= {bid2} 
        onChange= {(event) => {
          setBid2(event.target.value);
        }}/>
{showBidButton ?     
  <Button
    onClick={() => bidButton(bid1, bid2, bid3)}
    variant="contained"
  >
    Place Bid
  </Button> 
  :    
  null
}
{displayResults ? (
    <div class="w3-container">
    {displayBid(bids,1)}
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
      {displayBid(bids,2)}
  </div>
) : null}
  </div>
</div>

  )
}

export default Lobby;