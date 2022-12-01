import Sidemenu from "./Sidemenu";
import Cardmenu from "./Cardmenu";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Currency } from "../models/interfaces";

function App() {
  const [updateForm, setUpdateForm] = useState(true);
  const [id] = useState("62f3f90eff26bfc3d7624781");
  const [listCurrency, setListCurrency] = useState<Currency>({
    currency: [""],
  });

  useEffect(() => {
    axios
      .get(`api/currency`)
      .then((res) => {
        setListCurrency(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className='App'>
      <Sidemenu
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        id={id}
        listCurrency={listCurrency.currency}
      />
      <Cardmenu
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        id={id}
        listCurrency={listCurrency.currency}
      />
    </div>
  );
}

export default App;
