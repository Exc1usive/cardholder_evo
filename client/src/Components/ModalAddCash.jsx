import React, { useState } from 'react'
import axios from 'axios'

export default function ModalAddCash(props) {
    const {
        listCurrency,
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
            .post("/api/wallets/cash/add", form)
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
        <div className='modalWindow'>
          <div className='smallInputGroup'> 
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
              className="btn btn-primary formButton"
            >
              Зберегти
            </button>
            <button 
              onClick={handleCloseAddCash}
              className="btn btn-primary formButton"
            >
              Скасувати
            </button>
            </div>
        </div>
      )
}
