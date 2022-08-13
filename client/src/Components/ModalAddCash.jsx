import React, { useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export default function ModalAddCash(props) {
    const {
        listCurrency,
        openAddCash,
        handleCloseAddCash,
        setUpdateForm,
        id
      } = props
    
    const [form, setForm] = useState({
        amount: 0,
        currencyName: "UAH",
        id: id
    })
    
    // These methods will update the state properties all string
    function updateForm(value) {
        return setForm((prev) => {
        return { ...prev, ...value };
        });
    }

    function onSubmit() {
        axios
            .post("/api/wallet/cash/add", form)
            .then((res) => {
                console.log(res);
                handleCloseAddCash();
                setUpdateForm((prev) => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }
    
  return (
      <Modal
        open={openAddCash}
        onClose={handleCloseAddCash}
    >
        <Box className='modalBox'>
          <div className='modalWindow'>
            <div className='modalSmallInputGroup'> 
              <div>
                <label>Сумма</label>
                <input type='number' className='input form-control smallInput' value={form.amount} onChange={(e) => updateForm({amount: e.target.value})}/>
              </div> 
              <div>
                <label>Валюта</label>
                <select value={form.currency} onChange={(e) => updateForm({currencyName: e.target.value})} className="form-control smallInput">
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
                onClick={handleCloseAddCash}
                className="btn btn-primary modalButton"
              >
                Скасувати
              </button>
              </div>
          </div>
        </Box>
    </Modal>
        
  )
}
