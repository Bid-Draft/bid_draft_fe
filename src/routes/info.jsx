import * as React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import github from "../images/github.png";


const Info = () => {
    let navigate = useNavigate();
  return (
    <div className="info-container">
        <h3 class = "info-header"> Proebstel Draft </h3>
            The Proebstel Draft is a two-player, limited format variation of Magic: The Gathering, with a unique bidding mechanic. 
            At the start of the draft, both players are allocated a pool of 300 points. A deck of 90 cards is then unveiled incrementally 
            in sets of three cards. 
        
            Both players see each set of cards simultaneously and make secret bids using their points on each of the cards. The player who bids more points 
            wins the card and adds it to their pool for deck construction. However, if there is a tie in the bids, neither player gets 
            the card and it is removed from play.
        
            This process continues until all 90 cards have been bid on. Following the completion of the draft, players use the cards they've 
            won to construct their decks and use them to play a match of Magic: The Gathering.
        
    <p class = "info-spacing">
        <h3 class = "info-header"> Using This Web App</h3>
        <p>
        To use this web app, begin on the homepage where you'll find a dropdown menu containing a selection of Magic: The Gathering (MTG) sets. 
        Select your preferred set from the list, and then click to create a new game. Upon creating a game, the app will generate a unique URL for your game, 
        which can be copied and sent to a friend for them to join. Within the game, you have the ability to switch the display between your cards and your
         opponent's cards, by clicking on the 'Show Your Opponent's Cards' and 'Show Your Cards' buttons. If you want to add a card to a player's sideboard,
          simply click on that card. Also, the 'Copy Deck to Clipboard' function allows you to copy the currently displayed cards to your clipboard. Once the deck is copied, it can be pasted directly into the MTG app Cockatrice for further use. 
        </p>
    </p>
    <div class = "info-button-container">
        <button class ="start-button" onClick={() => navigate('/')}>Back to Home</button>
    </div>
    <div class = 'git-hub'>
        <a href="https://github.com/orgs/Bid-Draft/repositories" target="_blank" rel="noopener noreferrer">
            <button class='git-hub-button'>
                <img src={github} alt="git hub"/>
            </button>
        </a>
    </div>
    </div>
  );
};

export default Info;
