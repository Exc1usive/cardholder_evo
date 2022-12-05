import React, { useState, useEffect } from "react";
import ModalEditCash from "./ModalEditCash";
import ModalEditCard from "./ModalEditCard";
import axios from "axios";
import { Wallet, Balance, SidemenuProps } from "../models/interfaces";

export default function Sidemenu({
  updateForm,
  setUpdateForm,
  id,
  listCurrency,
}: SidemenuProps) {
  const [amount, setAmount] = useState(0);
  const [currencyName, setCurrencyName] = useState("");
  const [cardName, setCardName] = useState("");
  const [walletId, setWalletId] = useState("");
  const [wallet, setWallet] = useState<Wallet>({
    cash: [
      {
        _id: "",
        currencyName: "",
        amount: 0,
      },
    ],
    cards: [
      {
        _id: "",
        pan: "",
        expire_date: "",
        cvv: "",
        payment_system: "",
        card_type: "",
        card_holder: "",
        currencyName: "",
        amount: 0,
        name: "",
      },
    ],
  });

  // state for open and close modal EDIT CASH window
  const [openEditCash, setOpenEditCash] = useState(false);
  const handleOpenEditCash = () => setOpenEditCash(true);
  const handleCloseEditCash = () => setOpenEditCash(false);

  // state for open and close modal EDIT CARD window
  const [openEditCard, setOpenEditCard] = useState(false);
  const handleOpenEditCard = () => setOpenEditCard(true);
  const handleCloseEditCard = () => setOpenEditCard(false);

  useEffect(() => {
    axios
      .get(`api/wallet/${id}`)
      .then((res) => setWallet(res.data))
      .catch((err) => console.log(err));
  }, [id, updateForm]);

  function cashList() {
    return wallet.cash.map((cash, i) => {
      return (
        <div key={i} className='sideRow'>
          <li key={i}>
            {" "}
            {cash.amount} {cash.currencyName}{" "}
          </li>
          <button
            key={cash._id}
            name={cash._id}
            className='btn btn-dark'
            onClick={(e) => {
              setCurrencyName(cash.currencyName);
              setAmount(cash.amount);
              setWalletId(cash._id);
              handleOpenEditCash();
            }}
          >
            Редагувати
          </button>
        </div>
      );
    });
  }

  function cardList() {
    return wallet.cards.map((card) => {
      return (
        <div key={card._id} className='sideRow'>
          <li>
            {card.name}: {card.amount} {card.currencyName}{" "}
          </li>
          <button
            name={card._id}
            className='btn btn-dark'
            onClick={() => {
              setCurrencyName(card.currencyName);
              setAmount(card.amount);
              setWalletId(card._id);
              setCardName(card.name);
              handleOpenEditCard();
            }}
          >
            Редагувати
          </button>
        </div>
      );
    });
  }

  function balanceList() {
    let balances: Balance[] = [
      {
        currencyName: "",
        amount: 0,
      },
    ];
    listCurrency.map((currency: string): void => {
      let currentCurrency = {
        currencyName: currency,
        amount: 0,
      };
      wallet.cash.map((cash) => {
        if (cash.currencyName === currentCurrency.currencyName) {
          currentCurrency.amount += cash.amount;
        }
        return null;
      });
      wallet.cards.map((card) => {
        if (card.currencyName === currentCurrency.currencyName) {
          currentCurrency.amount += card.amount;
        }
        return null;
      });
      if (currentCurrency.amount !== 0) balances.push(currentCurrency);
      return null;
    });
    return balances.map((balance: Balance, i: number) => {
      if (balance.amount === 0) return null;
      return (
        <div key={i} className='sideRow'>
          <li>
            {balance["amount"]} {balance["currencyName"]}
          </li>
        </div>
      );
    });
  }

  return (
    <div className='sideMenu'>
      <div className='balance'>
        <div className='sideRow'>Баланс</div>
        {balanceList()}
        <hr className='sideHr' />
        <div className='sideRow'>Готівка</div>
        {cashList()}
        <hr className='sideHr' />
        <div className='sideRow'>Картки</div>
        {cardList()}
        <hr className='sideHr' />
      </div>

      <ModalEditCash
        listCurrency={listCurrency}
        cashId={walletId}
        selectedCurrency={currencyName}
        onChangeCurrency={(e) => setCurrencyName(e.target.value)}
        amount={amount}
        setAmount={(e) => setAmount(parseInt(e.target.value))}
        handleCloseEditCash={handleCloseEditCash}
        setUpdateForm={setUpdateForm}
        openEditCash={openEditCash}
      />

      <ModalEditCard
        listCurrency={listCurrency}
        cardId={walletId}
        selectedCurrency={currencyName}
        onChangeCurrency={(e) => setCurrencyName(e.target.value)}
        amount={amount}
        setAmount={(e) => setAmount(parseInt(e.target.value))}
        handleCloseEditCard={handleCloseEditCard}
        setUpdateForm={setUpdateForm}
        openEditCard={openEditCard}
        cardName={cardName}
        onChangeName={(e) => setCardName(e.target.value)}
      />
    </div>
  );
}
