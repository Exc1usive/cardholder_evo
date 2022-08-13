import React from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export default function ModalEditCash(props) {
  
  const {
    setAmount,
    selectedCurrency,
    onChangeCurrency,
    listCurrency,
    handleCloseEditCash,
    amount,
    cashId,
    setUpdateForm,
    openEditCash
  } = props

  function onSubmit() {
    let editedCash = {
      currencyName: selectedCurrency,
      amount: amount,
      id: cashId,
    }
    axios
      .put("/api/wallet/cash/edit", editedCash)
        .then(res => {
          console.log(res);
          setUpdateForm(prev => !prev)
          handleCloseEditCash();
        })
        .catch(err => console.log(err))
  }

  function onDelete() {
    axios
      .delete(`/api/wallet/cash/${cashId}`)
      .then(res => {
        console.log(res)
        setUpdateForm(prev => !prev)
        handleCloseEditCash();
      })
      .catch(err => console.log(err))
  }

  return (
    <Modal
    open={openEditCash}
    onClose={handleCloseEditCash}
  >
    <Box className='modalBox'>
    <div className='modalWindow'>
      <div className='modalSmallInputGroup'>   
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
          className="btn btn-primary modalButton"
        >
          Зберегти
        </button>
        <button 
          onClick={handleCloseEditCash}
          className="btn btn-primary modalButton"
        >
          Скасувати
        </button>
        <button 
          onClick={onDelete}
          className="btn btn-primary modalButton"
        >
          Видалити
        </button>
      </div>
    </div>
    </Box>
  </Modal>
  )
}
