import React from "react"
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function ModalEditCard(props: any) { // what to do with props?
  const {
    setAmount,
    selectedCurrency,
    onChangeCurrency,
    listCurrency,
    handleCloseEditCard,
    amount,
    cardId,
    setUpdateForm,
    cardName,
    onChangeName,
    openEditCard,
  } = props;

  function onSubmit() {
    let editedCard = {
      currencyName: selectedCurrency,
      amount: amount || 0,
      name: cardName,
      id: cardId,
    };
    axios
      .put("api/wallet/card/edit", editedCard)
      .then(() => {
        setUpdateForm((prev: boolean) => !prev);
        handleCloseEditCard();
      })
      .catch((err) => console.log(err));
  }

  function onDelete() {
    axios
      .delete(`/api/wallet/card/${cardId}`)
      .then(() => {
        setUpdateForm((prev: boolean) => !prev);
        handleCloseEditCard();
      })
      .catch((err) => console.log(err));
  }

  return (
    <Modal open={openEditCard} onClose={handleCloseEditCard}>
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
              <select value={selectedCurrency} onChange={onChangeCurrency} className='form-control'>
                {listCurrency.map((currency: string, index: number) => (
                  <option key={index} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label>Назва картки</label>
            <input className='input form-control ' value={cardName} onChange={onChangeName} />
          </div>
          <div className='modalButtonGroup'>
            <button onClick={() => onSubmit()} className='btn btn-primary modalButton'>
              Зберегти
            </button>
            <button onClick={handleCloseEditCard} className='btn btn-primary modalButton'>
              Скасувати
            </button>
            <button onClick={onDelete} className='btn btn-primary formButton modalDeleteButton'>
              Видалити
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
