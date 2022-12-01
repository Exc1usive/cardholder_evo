import React, { useState } from "react";
import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import Alert from "@mui/material/Alert";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import luhnCheck from "../utils/luhnCheck";
import { Card } from "../models/interfaces"

export default function ModalAddCard(props:any) { // what to do with props?
  const { handleCloseAddCard, listCurrency, setUpdateForm, openAddCard } = props;

  const [cardValidationError, setCardValidationError] = useState(false);
  const [cardExists, setCardExists] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  var onSubmit : (data: Card) => void;
  onSubmit = (data) => {
    if (cardValidationError === true) return null;
    axios
      .post("api/wallet/card/add", { ...data })
      .then((res) => {
        if (res.data === "Card already exist") setCardExists(true);
        if (res.data === "Card added") {
          handleCloseAddCard();
          setUpdateForm((prev: boolean) => !prev);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChangeCard = (e: { target: { value: string; }; }): void => {
    let card = e.target.value;
    card = card.replace(/\D+/g, "");

    // // Card validation via binlist API
    // if (cardValidationError === false) {
    //     if (card.length === 16) {
    //         axios
    //             .get(`https://lookup.binlist.net/${card}`)
    //             .then()
    //             .catch(() => setCardValidationError(true))
    //     } else setCardValidationError(false)
    // } else if (card.length < 16) {
    //     setCardValidationError(false)
    // } else return;

    // Card validation via Luhn`s algorithm
    if (cardValidationError === false) {
      if (card.length === 16) {
        if (luhnCheck(card) === false) {
          setCardValidationError(true);
        }
      } else setCardValidationError(false);
    } else if (card.length === 15) {
      setCardValidationError(false);
      setCardExists(false);
    } else return;
  };

  return (
    <>
      <Modal open={openAddCard} onClose={handleCloseAddCard}>
        <Box className='modalBox'>
          {cardValidationError ? (
            <Alert severity='error'>Такої картки не існує в світі, спробуйте іншу</Alert>
          ) : errors.pan ? (
            <Alert severity='error'>{errors.pan.message as unknown as string}</Alert>
          ) : errors.expire_date ? (
            <Alert severity='error'>{errors.expire_date.message as unknown as string}</Alert>
          ) : errors.cvv ? (
            <Alert severity='error'>{errors.cvv.message as unknown as string}</Alert>
          ) : errors.card_holder ? (
            <Alert severity='error'>{errors.card_holder.message as unknown as string}</Alert>
          ) : (
            errors.amount && (
              <Alert severity='error'>{errors.amount.message as unknown as string}</Alert>
            )
          )}
          {cardExists && <Alert severity='error'>Ця карта вже додана!</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} className='modalWindow'>
            <div className='form-group'>
              <label>Номер картки</label>
              <InputMask
                {...register("pan", {
                  required: "Потрібно ввести номер картки",
                  pattern: {
                    value: /[0-9]{4}[ ][0-9]{4}[ ][0-9]{4}[ ][0-9]{4}/,
                    message: "Номер картки повинен складатися з 16 цифр",
                  },
                })}
                onChange={handleChangeCard}
                className='form-control'
                mask='9999 **** **** 9999'
                placeholder='0000 0000 0000 0000'
                required
              />
            </div>

            <div className='modalSmallInputGroup'>
              <div>
                <label>Строк дії</label>
                <InputMask
                  {...register("expire_date", {
                    required: "Потрібно ввести строк дії картки",
                    pattern: {
                      value: /(?:(?:0[1-9]|1[0-2]))[/]((2[2-9])|([3-9][0-9]))/,
                      message: "Строк дії введено невірно",
                    },
                  })}
                  className='form-control modalSmallInput'
                  mask='99/99'
                  placeholder='00/00'
                  required
                />
              </div>
              <div>
                <label>CVV</label>
                <InputMask
                  {...register("cvv", {
                    required: "Потрібно ввести CVV-код картки",
                    pattern: {
                      value: /[0-9]{3}/,
                      message: "CVV-код картки введено невірно",
                    },
                  })}
                  className='form-control modalSmallInput'
                  mask='999'
                  placeholder='000'
                  required
                />
              </div>
            </div>

            <div className='form-group'>
              <label>Власник картки</label>
              <input
                {...register("card_holder", {
                  pattern: {
                    value: /^[a-zA-Z]+\s[a-zA-Z]+$/,
                    message: "Ім'я введено невірно",
                  },
                })}
                className='form-control'
                onKeyPress={(event) => {
                  if (!/[a-zA-Z]|[ ]/.test(event.key)) event.preventDefault();
                }}
                onChange={(event) => {
                  event.target.value = event.target.value.toUpperCase();
                }}
              />
            </div>

            <div className='form-group'>
              <label>Назва картки</label>
              <input {...register("name")} className='form-control' maxLength={20} />
            </div>

            <div className='modalSmallInputGroup'>
              <div>
                <label>Сумма</label>
                <input
                  {...register("amount", {
                    pattern: {
                      value: /[0-9]/,
                      message: "Кількість введено невірно",
                    },
                    value: "0",
                  })}
                  placeholder='0'
                  className='input form-control'
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) event.preventDefault();
                  }}
                />
              </div>
              <div>
                <label>Валюта</label>
                <select {...register("currencyName")} className='form-control'>
                  {listCurrency.map((currency: [string], index: number) => (
                    <option key={index} value={currency}>
                      {currency}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className='modalButtonGroup'>
              <input type='submit' value='Додати' className='btn btn-primary modalButton' />
              <input
                type='button'
                value='Закрити'
                onClick={handleCloseAddCard}
                className='btn btn-primary modalButton'
              />
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
}
