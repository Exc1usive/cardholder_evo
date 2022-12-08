import React, { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Cash, ModalAddCashProps } from "../models/interfaces";
import { useAppSelector } from "../app/hooks";

export default function ModalAddCash({
  listCurrency,
  openAddCash,
  handleCloseAddCash,
  setUpdateForm,
  id,
}: ModalAddCashProps) {
  const [form, setForm] = useState<Cash>({
    amount: 0,
    currencyName: "",
    _id: "",
  });

  const currencyList = useAppSelector((state) => state.currency.currencyList);

  // These methods will update the state properties all string
  function updateForm(value: Partial<Cash>) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function onSubmit() {
    axios
      .post("api/wallet/cash/add", form)
      .then(() => {
        handleCloseAddCash();
        setUpdateForm((prev) => !prev);
      })
      .catch((err) => console.log(err));
  }

  return (
    <Modal open={openAddCash} onClose={handleCloseAddCash}>
      <Box className='modalBox'>
        <div className='modalWindow'>
          <div className='modalSmallInputGroup'>
            <div>
              <label>Сумма</label>
              <input
                type='number'
                className='input form-control smallInput'
                value={form.amount}
                onChange={(e) => updateForm({ amount: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label>Валюта</label>
              <select
                value={form.currencyName}
                onChange={(e) => updateForm({ currencyName: e.target.value })}
                className='form-control smallInput'
              >
                {currencyList.map((currency: string, index: number) => (
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
            <button onClick={handleCloseAddCash} className='btn btn-primary modalButton'>
              Скасувати
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
