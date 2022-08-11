import React from 'react'
import axios from 'axios'

export default function ModalEditCash(props) {
  
  const {
    setAmount,
    selectedCurrency,
    onChangeCurrency,
    listCurrency,
    handleCloseEditCash,
    amount,
    walletId,
    setUpdateForm
  } = props

  function onSubmit() {
    let editedCash = {
      currencyName: selectedCurrency,
      amount: amount,
      id: walletId,
    }
    axios
      .put("/api/wallets/cash/edit", editedCash)
        .then(res => {
          console.log(res);
          setUpdateForm(prev => !prev)
          handleCloseEditCash();
        })
        .catch(err => console.log(err))
  }

  function onDelete() {
    console.log(walletId);
    axios
      .delete(`/api/wallets/delete/${walletId}`)
      .then(res => {
        console.log(res)
        setUpdateForm(prev => !prev)
        handleCloseEditCash();
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
      <div className='modalButtonGroup'>
        <button 
          onClick={onSubmit}
          className="btn btn-primary formButton"
        >
          Зберегти
        </button>
        <button 
          onClick={handleCloseEditCash}
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
