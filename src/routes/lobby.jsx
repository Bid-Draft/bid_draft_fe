import * as React from "react";
import { useLoaderData, useSearchParams, useParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import '../App.css';
import Button from '@mui/material/Button'; 
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
  {id: 529, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'},
  {id: 530, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'},
  {id: 531, image: 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'}])
const [justLoaded, setJustLoaded] = useState(false)
const [showBidButton, setShowBidButton] = useState(true)
const [newCards, setNewCards] = useState(false)
const [data, setData] = useState(null);
const [bids, setBids] = useState([]);
const [pendingCards, setPendingCards] = useState({});
const [playersCards, setPlayersCards] = useState([]);
const [opponentsCards, setOpponentsCards] = useState([]);
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

useEffect(() => {
  let intervalId;

  if (newCards && !afk) {
    intervalId = setInterval(() => {
    checkCards();
    const prevCount = checkCount
    setCheckCount(prevCount => prevCount + 1)
    console.log(checkCount)
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
    const response = await fetch(`http://localhost:3000/api/v1/bids?game_id=${game}&last_card=${cards[2].id}`, {
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

const joinGame = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/players?uuid=${localStorage.getItem('userId')}&game_id=${game}`, {
      method: "POST"
    });
    const result = await response.json();
    return result;
  } catch(error) {
    console.log(error);
  }
};

const assignBids = (data) => {
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
}, 3000);}


const makeBid = async (bid1,bid2,bid3) => {

  try {
    const response = await fetch(`http://localhost:3000/api/v1/bids`, {
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
    const results = await fetch (`http://localhost:3000/api/v1/cards?id=${game}`);
  
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
    const {id, ...rest} = obj;
    newObj[id] = rest;
  });
  setPendingCards(newObj);
}

function bidButton(bid1, bid2, bid3) {
  if (isNaN(bid1) || isNaN(bid2) || isNaN(bid3) || bid1 < 0 || bid2 < 0 || bid3 < 0) {
    setSnackbarMessage('Please enter valid integers for all bids.');
    setOpenSnackbar(true);
  } else if (bid1 + bid2 + bid3 > playersCurrency ){
    setSnackbarMessage('The sum of your bids cannot exceed your available points.');
    setOpenSnackbar(true);
  } else {
    makeBid(bid1, bid2, bid3);
    setShowBidButton(false);
    setNewCards(true);
  }
}

function copyToClipboardButton(playersCards) {
  const string = DeckStringGenerator(playersCards);
  navigator.clipboard.writeText(string)
}

  if (!justLoaded){
    getCards(game)
    joinGame(localStorage.getItem('userId'))
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
    
  <div>
    <h2>Your Points:{playersCurrency} Opponents Points:{opponentsCurrency} </h2> Cards: {cardsHandled + 3} / 90
    <div>
      {gameOver ? null : (
        <div class="row">
          <div class="column">
            <img src={cards[0]?.image ? cards[0]?.image : 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card' } alt="Snow" />
            <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              value={bid1}
              onChange={(event) => {
                setBid1(event.target.value);
              }}
            />
            {displayResults ? (
              <div class="w3-container">
                {displayBid(bids, 0)}
              </div>
            ) : null}
          </div>
          <div class="column">
            <img src={cards[1]?.image ? cards[1]?.image : 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'} alt="Forest" />
            <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              value={bid2}
              onChange={(event) => {
                setBid2(event.target.value);
              }}
            />
            {showBidButton ? (
              <Button onClick={() => bidButton(bid1, bid2, bid3)} variant="contained">
                Place Bid
              </Button>
            ) : null}
            {displayResults ? (
              <div class="w3-container">
                {displayBid(bids, 1)}
              </div>
            ) : null}
          </div>
          <div class="column">
            <img src={cards[2]?.image ? cards[2]?.image : 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=130520&type=card'} alt="Mountains" />
            <TextField
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              value={bid3}
              onChange={(event) => {
                setBid3(event.target.value);
              }}
            />
            {displayResults ? (
              <div class="w3-container">
                {displayBid(bids, 2)}
              </div>
            ) : null}
          </div>
        </div>
      )}
      <div class="bottom">
        <button onClick={() => setShowPlayersCards(!showPlayersCards)}>
          {showPlayersCards ? "Show Opponent's Cards" : "Show Your Cards"}
        </button>
        <Button onClick={() => copyToClipboardButton(playersCards)} variant="contained">
                Copy to Clipboard
        </Button>
        <div className="grid-container">
          {showPlayersCards ? (
            playersCards?.map((image) => (
              <img src={image?.image} alt={image?.alt} />
            ))
          ) : (
            opponentsCards?.map((image) => (
              <img src={image?.image} alt={image?.alt} />
            ))
          )}
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
  </div>
)
}

export default Lobby;