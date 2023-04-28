import React from 'react';

const DeckStringGenerator = (playersCards, sideboardCards) => {
  const objectBuilder = (cards) => {
    let result = {};
    cards.forEach(card => {
      if (!(`${card.name}` in result)){
        result[card.name] = 1;
      } else {
        result[card.name] += 1;
      }
    }); 
    return result;
  };

  const stringBuilder = (obj) => {
    let final = '';
    for (const key in obj) {
      const value = obj[key];
      final += `${value} ${key}\n`;
    }
    return final;
  };

  const mainDeckObject = objectBuilder(playersCards);
  const mainDeckString = stringBuilder(mainDeckObject);

  const sideboardObject = objectBuilder(sideboardCards);
  const sideboardString = stringBuilder(sideboardObject);

  const finalString = mainDeckString + "\nSideboard\n" + sideboardString;
  console.log(finalString)
  return finalString;
};

export default DeckStringGenerator;
