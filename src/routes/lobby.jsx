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


export const lobbyLoader = async ({ params }) => {
  const {gameId} = params
  console.log({gameId})
  const results = await fetch (`http://localhost:3000/api/v1/game?id=${gameId}`);

  const  cards = await results.json();

  return {cards};
};

export default function Lobby() {
 <div> Rectum</div>
}