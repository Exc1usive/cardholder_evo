import React from 'react'
import axios from 'axios'

export default function ModalEditCard(props) {
  
  const {
    setAmount,
    selectedCurrency,
    onChangeCurrency,
    listCurrency,
    handleCloseEditCard,
    amount,
    walletId,
    setUpdateForm,
    cardName,
    onChangeName
  } = props

  function onSubmit() {
    let editedCard = {
      currencyName: selectedCurrency,
      amount: amount,
      name: cardName,
      id: walletId,
    }
    axios
      .put("/api/wallets/cards/edit", editedCard)
        .then(res => {
          console.log(res);
          setUpdateForm(prev => !prev)
          handleCloseEditCard();
        })
        .catch(err => console.log(err))
  }

  function onDelete() {
    console.log(walletId);
    axios
      .delete(`/api/wallets/delete/${walletId}`)
      .then(res => {
        console.log(res);
        setUpdateForm(prev => !prev)
        handleCloseEditCard();
      })
      .catch(err => console.log(err))
  }

  return (
    <div className='modalWindow'>
      <div className='smallInputGroup'> 
        <div>
          <label>Сумма</label>
          <input type='number' className='input form-control' value={amount} onChange={setAmount}/>
        </div>     
        <div>
          <label>Валюта</label>
          <select value={selectedCurrency} onChange={onChangeCurrency} className="form-control">
              {listCurrency.map((currency, index) => (
              <option key={index} value={currency}>{currency}</option>
              ))}
          </select>
        </div>  
      </div>
      <div className='modalEditCardName'>
        <label>Назва картки</label>
        <input className='input form-control ' value={cardName} onChange={onChangeName}/>
      </div>
        <div className='modalButtonGroup'>
        <button 
          onClick={() => onSubmit()}
          className="btn btn-primary formButton"
        >
          Зберегти
        </button>
        <button 
          onClick={handleCloseEditCard}
          className="btn btn-primary formButton"
        >
          Скасувати
        </button>
        <button 
          onClick={onDelete}
          className="btn btn-primary formButton"
        >
          Видалити
        </button>
        </div>
    </div>
  )
}
