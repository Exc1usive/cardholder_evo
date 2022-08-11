import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ModalEditCash from './ModalEditCash';
import ModalEditCard from './ModalEditCard';
import axios from 'axios'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: "25px",
  boxShadow: 24,
  p: 4,
  color: 'white'
};

export default function Sidemenu(props) {

  const {
    updateForm,
    setUpdateForm,
    id,
    listCurrency
  } = props
  
  const [amount, setAmount] = useState(0);
  const [currencyName, setCurrencyName] = useState("");
  const [cardName, setCardName] = useState("");
  const [walletId, setWalletId] = useState("")
  const [wallet, setWallet] = useState({
    cash: [{
      currencyName: "",
      amount: 0,
  }],
  cards: [{
      pan: "",
      expire_date: "",
      cvv: 0,
      payment_system: "",
      card_type: "",
      card_holder: "",
      currencyName: "",
      amount: 0,
  }]
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
      .get(`/api/wallets/${id}`)
      .then(res => setWallet(res.data))
      .catch(error => console.log(error))
  }, [id, updateForm]);

  function cashList() {
    return wallet.cash.map((cash, i) => {
      return (
        <div key={i} className='cashCurrency'>
          <li key={i}> {cash.amount} {cash.currencyName} </li>
          <button 
            key={cash._id}
            name={cash._id}
            className="btn btn-dark"
            onClick={(e) => {
              setCurrencyName(cash.currencyName)
              setAmount(cash.amount)
              setWalletId(cash._id)
              handleOpenEditCash()
              }}
          >
            Редагувати
          </button>
        </div>
      )
    })
  }

  function cardList() {
    return wallet.cards.map((card, i) => {
      return (
        <div key={i} className='cashCurrency'>
          <li key={i}>{card.name} - {card.amount} {card.currencyName} </li>
          <button 
            key={card._id}
            name={i}
            className="btn btn-dark"
            onClick={(e) => {
              setCurrencyName(card.currencyName)
              setAmount(card.amount)
              setWalletId(card._id)
              setCardName(card.name)
              handleOpenEditCard()
              }}
          >
            Редагувати
          </button>
        </div>
      )
    })
  }

  function balanceList() {
    let balance = [];
    listCurrency.map((currency) => {
      let currentCurrency = {
        currencyName: currency,
        amount: 0
      }
      wallet.cash.map((cash) => {
        if (cash.currencyName === currentCurrency.currencyName) {
          currentCurrency.amount += cash.amount
        }
        return null;
      })
      wallet.cards.map((card) => {
        if (card.currencyName === currentCurrency.currencyName) {
          currentCurrency.amount += card.amount
        }
        return null;
      })
      if (currentCurrency.amount !== 0)
        balance.push(currentCurrency)
      return null;
    })
    return balance.map((currency, i) => (
      <div key={i}>
        <li>
          {currency.amount} {currency.currencyName} 
        </li>
      </div>
    ))
  }


  return (
    <div className='sideMenu'>
      <div className='balance'>
        <div className='cardBalance'>
          Баланс
            {balanceList()}
        </div>
        <hr className='sideHr'/>
        <div className='cashBalance'>
          Готівка
          {cashList()}
        </div>
        <hr className='sideHr'/>
        <div className='cashBalance'>
          Картки
          {cardList()}
        </div>
        <hr className='sideHr'/>
      </div>

      <Modal
        open={openEditCash}
        onClose={handleCloseEditCash}
      >
        <Box sx={style}>
          <ModalEditCash 
            listCurrency={listCurrency}
            walletId={walletId}
            selectedCurrency={currencyName}
            onChangeCurrency={e => setCurrencyName(e.target.value)}
            amount={amount}
            setAmount={e => setAmount(e.target.value)}
            handleCloseEditCash={handleCloseEditCash}
            setUpdateForm={setUpdateForm}
          />
        </Box>
      </Modal>

      <Modal
        open={openEditCard}
        onClose={handleCloseEditCard}
      >
        <Box sx={style}>
          <ModalEditCard 
            listCurrency={listCurrency}
            walletId={walletId}
            selectedCurrency={currencyName}
            onChangeCurrency={e => setCurrencyName(e.target.value)}
            cardName={cardName}
            onChangeName={e => setCardName(e.target.value)}
            amount={amount}
            setAmount={e => setAmount(e.target.value)}
            handleCloseEditCard={handleCloseEditCard}
            setUpdateForm={setUpdateForm}
          />
        </Box>
      </Modal>

    </div>
  )
}
