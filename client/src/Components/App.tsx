import Sidemenu from "./Sidemenu";
import Cardmenu from "./Cardmenu";
import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Currency } from "../models/interfaces";
import { useAppSelector, useAppDispatch } from "../app/hooks"
import { getCurrency } from "../features/currency/currencySlice"

function App() {
  const [updateForm, setUpdateForm] = useState(true);
  const [id] = useState("62f3f90eff26bfc3d7624781");
  // const [listCurrency, setListCurrency] = useState<Currency>([]);

  const currencyList = useAppSelector((state) => state.currency.currencyList);
  const status = useAppSelector((state) => state.currency.status)
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (status === 'idle') {
      dispatch(getCurrency())
    }
    // console.log("currencyList");
    // console.log(currencyList);
  }, [currencyList, dispatch, status])

  // useEffect(() => {
  //   const getCurrency = async () => {
  //     await axios
  //       .get(`http://localhost:5000/api/currency`)
  //       .then((res) => {
  //         setListCurrency(res.data);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  //   getCurrency();  
  // }, []);

  return (
    <div className='App'>
      <Sidemenu
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        id={id}
        listCurrency={currencyList}
      />
      <Cardmenu
        updateForm={updateForm}
        setUpdateForm={setUpdateForm}
        id={id}
        listCurrency={currencyList}
      />
    </div>
  );
}

export default App;
