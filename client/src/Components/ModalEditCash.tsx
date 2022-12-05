import React from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ModalEditCashProps } from "../models/interfaces";

export default function ModalEditCash(props: ModalEditCashProps) {
  const {
    listCurrency,
    cashId,
    selectedCurrency,
    onChangeCurrency,
    amount,
    setAmount,
    handleCloseEditCash,
    setUpdateForm,
    openEditCash,
  } = props;

  function onSubmit() {
    let editedCash = {
      currencyName: selectedCurrency,
      amount: amount || 0,
      id: cashId,
    };
    axios
      .put("api/wallet/cash/edit", editedCash)
      .then(() => {
        setUpdateForm((prev) => !prev);
        handleCloseEditCash();
      })
      .catch((err) => console.log(err));
  }

  function onDelete() {
    axios
      .delete(`/api/wallet/cash/${cashId}`)
      .then(() => {
        setUpdateForm((prev) => !prev);
        handleCloseEditCash();
      })
      .catch((err) => console.log(err));
  }

  return (
    <Modal open={openEditCash} onClose={handleCloseEditCash}>
      <Box className='modalBox'>
        <div className='modalWindow'>
          <div className='modalSmallInputGroup'>
            <div>
              <label>Сумма</label>
              <input
                type='number'
                className='input form-control'
                value={amount}
                onChange={setAmount}
              />
            </div>
            <div>
              <label>Валюта</label>
              <select
                value={selectedCurrency}
                onChange={onChangeCurrency}
                className='form-control'
              >
                {listCurrency.map((currency: string, index: number) => (
                  <option key={index} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='modalButtonGroup'>
            <button onClick={onSubmit} className='btn btn-primary modalButton'>
              Зберегти
            </button>
            <button
              onClick={handleCloseEditCash}
              className='btn btn-primary modalButton'
            >
              Скасувати
            </button>
            <button
              onClick={onDelete}
              className='btn btn-primary modalButton modalDeleteButton'
            >
              Видалити
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
