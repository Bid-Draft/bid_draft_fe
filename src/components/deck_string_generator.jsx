import React from 'react';

const DeckStringGenerator = (playersCards) => {
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

  const object = objectBuilder(playersCards);
  const string = stringBuilder(object);

  return string;
};

export default DeckStringGenerator;