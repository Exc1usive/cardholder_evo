import Sidemenu from "./Sidemenu"
import Cardmenu from "./Cardmenu";
import React, { useState } from 'react'

function App() {
  const [updateForm, setUpdateForm] = useState(true)
  const [id] = useState("62f3f90eff26bfc3d7624781")
  const listCurrency = ['UAH', 'USD', 'EUR']
  return (

      <div className="App">
        <Sidemenu 
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          id={id}
          listCurrency={listCurrency}
        />
        <Cardmenu 
          updateForm={updateForm}
          setUpdateForm={setUpdateForm}
          id={id}
          listCurrency={listCurrency}
        />
      </div>


  );
}

export default App;
