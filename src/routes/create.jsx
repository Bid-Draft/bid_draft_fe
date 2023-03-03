// import { useState } from 'react';
// import * as React from 'react';  
// import Stack from '@mui/material/Stack';  
// import Button from '@mui/material/Button';  
// import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// import  {Dropdown, DropdownMenuItem} from '../components/dropdown/dropdown';


import * as React from "react";
import { useState } from 'react';
import Select from "@mui/material/Select";
import Button from '@mui/material/Button'; 
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export default function SelectSet() {
  const [set, setSet]  = useState("RTR")
  const handleChange = (event) => {
     setSet(event.target.value )
     console.log({set})
  }
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
        onClick={() => {
         fetch(`http://localhost:3000/api/v1/game?set=${set}`, {
          method: 'POST'
         })
        }}
        variant="contained">Start Draft</Button>  
</FormControl>
  );
}

// export default function BasicButtons() {  
//   return (  
//     <Stack spacing={2} direction="row">  
//       <Button 
//         onClick={() => {
//          fetch("http://localhost:3000/api/v1/game?set=rtr", {
//           method: 'POST'
//          })
//         }}
//         variant="contained">Start Draft</Button>  
//     </Stack>  
//   );  
// }  