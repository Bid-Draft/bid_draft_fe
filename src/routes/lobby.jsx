import * as React from "react";
import { useLoaderData, useSearchParams, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import '../App.css';
import '../apiRoot'
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Gallery } from "react-grid-gallery";
import DeckStringGenerator from "../components/deck_string_generator"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const Lobby = () => {

if (localStorage.getItem('userId') === null){
  localStorage.setItem('userId', (uuidv4()));
}

const [bid1, setBid1]  = useState("0")
const [bid2, setBid2]  = useState("0")
const [bid3, setBid3]  = useState("0")
const [displayResults, setDisplayResults] = useState(false)
const [cards, setCards]  = useState([
  {id: 99999529, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'},
  {id: 99999530, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'},
  {id: 99999531, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'}])
const [justLoaded, setJustLoaded] = useState(false)
const [showBidButton, setShowBidButton] = useState(true)
const [newCards, setNewCards] = useState(false)
const [data, setData] = useState(null);
const [bids, setBids] = useState([]);
const [pendingCards, setPendingCards] = useState({});
const [playersCards, setPlayersCards] = useState([]);
const [opponentsCards, setOpponentsCards] = useState([]);
const [opponentsSideboardCards, setOpponentsSideboardCards] = useState([]);
const [playersCurrency, setPlayersCurrency] = useState("0");
const [opponentsCurrency, setOpponentsCurrency] = useState("0");
const [showPlayersCards, setShowPlayersCards] = useState(true);
const [gameOver, setGameOver] = useState(false);
const [timeLeft, setTimeLeft] = useState(60)
const game = useParams().gameId
const [checkTime, setCheckTime] = useState(2000)
const [checkCount, setCheckCount] = useState(0);
const [afk, setAfk] = useState(0);
const [cardsHandled, setCardsHandled] = useState(0);
const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [sideboardCards, setSideboardCards] = useState([]);

useEffect(() => {
  let intervalId;

  if (newCards && !afk) {
    intervalId = setInterval(() => {
    checkCards();
    const prevCount = checkCount
    setCheckCount(prevCount => prevCount + 1)
    if (checkCount === 150) {
      setCheckTime(30000);
    }
    if (checkCount === 170) {
      setAfk(true);
    };
    }, checkTime);
  }

  return () => clearInterval(intervalId);
}, [newCards, checkCount, checkTime, afk]);

const handleCloseSnackbar = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }

  setOpenSnackbar(false);
};

const checkCards = async () => {

  try {
    const response = await fetch(`https://vast-savannah-37442.herokuapp.com/api/v1/bids?game_id=${game}&last_card=${cards[2].id}`, {
    });
    const json = await response.json();
    if (json["complete"] === "true" ) {
        setCheckCount(0)
        setCheckTime(2000)
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

const handleCardMove = (card) => {
  const playerCard = playersCards.find((c) => c.id === card.id);
  const sideboardCard = sideboardCards.find((c) => c.id === card.id);
  const opponentsCard = opponentsCards.find((c) => c.id === card.id);
  const opponentsSideboardCard = opponentsSideboardCards.find((c) => c.id === card.id);
  if (playerCard) {
    setPlayersCards(playersCards.filter((c) => c.id !== card.id));
    setSideboardCards([...sideboardCards, card]);
  } else if (sideboardCard) {
    setSideboardCards(sideboardCards.filter((c) => c.id !== card.id));
    setPlayersCards([...playersCards, card]);
  } else if (opponentsCard) {
    setOpponentsCards(opponentsCards.filter((c) => c.id !== card.id));
    setOpponentsSideboardCards([...opponentsSideboardCards, card]);
  }  else if (opponentsSideboardCard) {
    setOpponentsSideboardCards(opponentsSideboardCards.filter((c) => c.id !== card.id));
    setOpponentsCards([...opponentsCards, card]);
};}

const joinGame = async () => {
  try {
    const response = await fetch(`https://vast-savannah-37442.herokuapp.com/api/v1/players?uuid=${localStorage.getItem('userId')}&game_id=${game}`, {
      method: "POST"
    });
    const result = await response.json();
    return result;
  } catch(error) {
    console.log(error);
  }
};

const assignBids = (data) => {
  console.log(playersCards)
  data.forEach((bid) => {
    if (bid.tied === "true") {
      
    } else if (bid.winner_uuid === localStorage.getItem('userId')) {
      
      setPlayersCards((prevState) => [...prevState, pendingCards[bid.card_id]]);

    } else {
      setOpponentsCards((prevState) => [...prevState, pendingCards[bid.card_id]]);
    }
  });
};

const delayedAfterGoodBidsReceived = async () => {
setTimeout(() => {
  getCards(game);
  setDisplayResults(false);
  setShowBidButton(true);
}, 7000);}


const makeBid = async (bid1,bid2,bid3) => {

  try {
    const response = await fetch(`https://vast-savannah-37442.herokuapp.com/api/v1/bids`, {
        method: "POST",
        body: JSON.stringify({gameId:game, bid1: bid1, bid2: bid2, bid3: bid3, card1Id: cards[0].id, card2Id: cards[1].id, card3Id: cards[2].id, uuid: localStorage.getItem('userId')})
    });
    const result = await response.json();
    return result
  } catch(error) {
    console.log(error)
  };
};

const getCards = async (game) => {
  try {
    const results = await fetch (`https://vast-savannah-37442.herokuapp.com/api/v1/cards?id=${game}`);
  
    const  data = await results.json();
   setCards(data.cards)
   assignPendingsCards(data.cards)
   assignCurrencies(data.currencies)
   setGameOver(data.gameOver)
   setCardsHandled(data.cardsHandled)
    return data
  } catch(error) {
    console.log(error)
  };
};

const getPlayersCards = async (game) => {
  try {
    const results = await fetch (`https://vast-savannah-37442.herokuapp.com/api/v1/cards/players?id=${game}`);
  
    const  data = await results.json();
    return data
  } catch(error) {
    console.log(error)
  };
};

const assignCardsAfterRefresh= (data) => {
  if (data.player_one_uuid === localStorage.getItem('userId')) {
    setPlayersCards(data.player_one_cards)
    setOpponentsCards(data.player_two_cards)
  } else {
    setPlayersCards(data.player_two_cards)
    setOpponentsCards(data.player_one_cards)
  }

}



const assignCurrencies = (data) => {

    if (data.player_one_uuid === localStorage.getItem('userId')) {
      setPlayersCurrency(data.player_one_currency)
      setOpponentsCurrency(data.player_two_currency)

    } else {
      setPlayersCurrency(data.player_two_currency)
      setOpponentsCurrency(data.player_one_currency)
    }
  };

  function assignPendingsCards(cards) {
    const newObj = {};
    
    cards.forEach(obj => {
      newObj[obj.id] = obj;
    });
    setPendingCards(newObj);
  }

function bidButton(bid1, bid2, bid3) {
  const intBid1 = parseInt(bid1);
  const intBid2 = parseInt(bid2);
  const intBid3 = parseInt(bid3);
  const parsedPlayersCurrency = parseInt(playersCurrency);

  if (isNaN(intBid1) || isNaN(intBid2) || isNaN(intBid3) || intBid1 < 0 || intBid2 < 0 || intBid3 < 0) {
    setSnackbarMessage('Please enter valid integers for all bids.');
    setOpenSnackbar(true);
  } else if (intBid1 + intBid2 + intBid3 > parsedPlayersCurrency) {
    setSnackbarMessage('The sum of your bids cannot exceed your available points.');
    setOpenSnackbar(true);
  } else {
    makeBid(bid1, bid2, bid3);
    setShowBidButton(false);
    setNewCards(true);
  }
}

function copyToClipboardButton(playersCards, sideboardCards) {
  const string = DeckStringGenerator(playersCards, sideboardCards);
  navigator.clipboard.writeText(string);
}


async function initializeGame() {
  if (!justLoaded){
    const cards = await getPlayersCards(game);
    assignCardsAfterRefresh(cards);
    getCards(game);
    joinGame(localStorage.getItem('userId'));
    setJustLoaded(true);
  }
}

initializeGame()

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
    
<div>
<h2>
  <div className="points-container">
    <div className="your-points">
     {!gameOver ? `Player Points: ${playersCurrency}` : null}
    </div>
    <div className = "cards-handled">
    {!gameOver ? `Cards: ${cardsHandled + 3} / 90` : <button class = "copy-button"
        onClick={() => copyToClipboardButton(playersCards, sideboardCards)}
        variant="contained"
      >
        Copy to Clipboard
      </button>}
    </div>
    <div className="opponents-points">
    {!gameOver ? `Opponents Points: ${opponentsCurrency}` : null}
    </div>
  </div>
</h2>
  <div>
    {gameOver ? null : (
      <div className="container">
        <div className="row">
          <div className="column">
            <div className = "card-container">
              <img
                src={
                  cards[0]?.image
                    ? cards[0]?.image
                    : "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card"
                }
                alt="Snow"
              />
              <input class = "bid-input"
                type="text"
                id="outlined-basic"
                value={bid1}
                onInput={(event) => {
                  setBid1(event.target.value);
                }}
              />
              {displayResults ? (
              <div class ="results">{displayBid(bids, 0)}</div>
              ) : null}
            </div>
          </div>
          <div className="column">
            <div className = "card-container">
              <img
                src={
                  cards[1]?.image
                    ? cards[1]?.image
                    : "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card"
                }
                alt="Forest"
              />
              <input class = "bid-input"
                type="text"
                id="outlined-basic"
                value={bid2}
                onInput={(event) => {
                  setBid2(event.target.value);
                }}
              />
              {displayResults ? (
              <div class ="results">{displayBid(bids, 1)}</div>
              ) : null}
          <div className="buttons-container">
            {showBidButton ? (
              <button class = "bid-button"
                onClick={() => bidButton(bid1, bid2, bid3)}
                variant="contained"
              >
                
                Place Bid
              </button>
              
            ) : null}
            {showBidButton ? (
                  <button class = "copy-button"
        onClick={() => copyToClipboardButton(playersCards, sideboardCards)}
        variant="contained"
      >
        Copy to Clipboard
      </button>) : null}
              </div>
            </div>
          </div>
          <div className="column">
            <div className = "card-container">  
            <img
              src={
                cards[2]?.image
                  ? cards[2]?.image
                  : "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card"
              }
              alt="Mountains"
            />
              <input class = "bid-input"
                type="text"
                id="outlined-basic"
                value={bid3}
                onInput={(event) => {
                  setBid3(event.target.value);
                }}
              />
              {displayResults ? (
              <div class ="results"> {displayBid(bids, 2)}</div>
              ) : null}
          </div>
        </div>
      </div>
    </div>
    )}
    <div>
<div>
  <div style={{ position: "relative" }}>
    <div className="main-deck-container">
    <button
      className="swap-cards-button"
      onClick={() => setShowPlayersCards(!showPlayersCards)}
    >
      {showPlayersCards
        ? "Show Opponent's Cards"
        : "Show Your Cards"}
    </button>
      <div className="deck-header">
      {showPlayersCards ? `Player Main Deck (${playersCards?.length})` : `Opponent's Main Deck (${opponentsCards?.length})`}
      </div>
      <div className="main-deck">
        {showPlayersCards
          ? playersCards?.map((image) => (
              <img
                key={image.id}
                src={image?.image}
                alt={image?.alt}
                onClick={() => handleCardMove(image)}
              />
            ))
          : opponentsCards?.map((image) => (
              <img
                key={image.id}
                src={image?.image}
                alt={image?.alt}
                onClick={() => handleCardMove(image)}
              />
            ))}
      </div>
    </div>
    <div className="side-board-container">
      <div className="deck-header">
      {showPlayersCards ? `Player Sideboard (${sideboardCards?.length})` : `Opponent's Sideboard (${opponentsSideboardCards?.length})`}
      </div>
      <div className="side-board">
        {showPlayersCards
          ? sideboardCards?.map((image) => (
              <img
                key={image.id}
                src={image?.image}
                alt={image?.alt}
                onClick={() => handleCardMove(image)}
              />
            ))
          : opponentsSideboardCards?.map((image) => (
              <img
                key={image.id}
                src={image?.image}
                alt={image?.alt}
                onClick={() => handleCardMove(image)}
              />
            ))}
      </div>
    </div>
  </div>


</div>
      </div>
               <div>
                 <Snackbar
                   open={openSnackbar}
                   autoHideDuration={6000}
                   onClose={handleCloseSnackbar}
                   anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                 >
                   <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                     {snackbarMessage}
                   </Alert>
                 </Snackbar>
               </div>
             </div>
           </div>
  )           

}

export default Lobby;