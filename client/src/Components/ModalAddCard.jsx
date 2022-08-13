import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import InputMask from 'react-input-mask'
import Alert from '@mui/material/Alert';
import axios from 'axios'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

export default function ModalAddCard(props) {

    const { 
        handleCloseAddCard,
        listCurrency,
        setUpdateForm,
        openAddCard
    } = props

    const [cardValidationError, setCardValidationError] = useState(false)
    const [cardExists, setCardExists] = useState(false);

    const { register, formState: { errors }, handleSubmit } = useForm();

    const onSubmit = data => {
        if (cardValidationError === true) return null;
        axios
            .post("/api/wallet/card/add", {...data})
            .then((res) => {
                console.log(res.data);
                if (res.data === "Card already exist")
                    setCardExists(true)
                if (res.data === "Card added") {
                    handleCloseAddCard();
                    setUpdateForm((prev) => !prev)
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }; 

    const luhnCheck = val => {
        let checksum = 0; // running checksum total
        let j = 1; // takes value of 1 or 2
    
        // Process each digit one by one starting from the last
        for (let i = val.length - 1; i >= 0; i--) {
          let calc = 0;
          // Extract the next digit and multiply by 1 or 2 on alternative digits.
          calc = Number(val.charAt(i)) * j;
    
          // If the result is in two digits add 1 to the checksum total
          if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
          }
    
          // Add the units element to the checksum total
          checksum = checksum + calc;
    
          // Switch the value of j
          if (j === 1) {
            j = 2;
          } else {
            j = 1;
          }
        }
      
        //Check if it is divisible by 10 or not.
        return (checksum % 10) === 0;
    }

    const handleChangeCard = e => {
        let card = e.target.value
        card = card.replace(/\D+/g, "")

        // // Card validation via binlist API
        // if (cardValidationError === false) {
        //     if (card.length === 16) {
        //         axios
        //             .get(`https://lookup.binlist.net/${card}`)
        //             .then(res => {
        //             console.log(res);
        //         })
        //             .catch(() => setCardValidationError(true))
        //     } else setCardValidationError(false)
        // } else if (card.length < 16) {
        //     setCardValidationError(false)
        // } else return null;

        // Card validation via Luhn`s algorithm
        if (cardValidationError === false) {
            if (card.length === 16) {
                if (luhnCheck(card) === true) {
                    console.log("Card validate!");
                } else setCardValidationError(true)
            } else setCardValidationError(false)
        } else if (card.length < 16) {
            setCardValidationError(false)
        } else return null;

    
    }

  return (
    <>
    <Modal
    open={openAddCard}
    onClose={handleCloseAddCard}
    >
    <Box className='modalBox'>
    {
    cardValidationError ? <Alert severity="error">Такої картки не існує в світі, спробуйте іншу</Alert> :
    errors.pan ? <Alert severity="error">{errors.pan.message}</Alert> :
    errors.expire_date ? <Alert severity="error">{errors.expire_date.message}</Alert> :
    errors.cvv ? <Alert severity="error">{errors.cvv.message}</Alert> :
    errors.card_holder ? <Alert severity="error">{errors.card_holder.message}</Alert> :
    errors.amount && <Alert severity="error">{errors.amount.message}</Alert>
    }
    {cardExists && <Alert severity="error">Ця карта вже додана!</Alert>}

    <form 
        onSubmit={handleSubmit(onSubmit)}
        className="modalWindow"
    >  

        <div className='form-group'>
            <label>Номер картки</label>
            <InputMask 
            {...register("pan", { 
                required: 'Потрібно ввести номер картки', 
                pattern: {
                    value: /[0-9]{4}[ ][0-9]{4}[ ][0-9]{4}[ ][0-9]{4}/,
                    message: "Номер картки повинен складатися з 16 цифр"
                    }
                })} 
            onChange={handleChangeCard}
            className="form-control"
            mask='9999 **** **** 9999'
            placeholder="0000 0000 0000 0000"
            required/>
        </div>

        <div className='modalSmallInputGroup'>
            <div>
                <label>Строк дії</label>
                <InputMask 
                {...register("expire_date", {
                    required: 'Потрібно ввести строк дії картки', 
                    pattern: {
                        value: /(?:(?:0[1-9]|1[0-2]))[/](2[2-9])|(3[0-9])/,
                        message: "Строк дії введено невірно"
                    }
                })} 
                className="form-control modalSmallInput" 
                mask="99/99" 
                placeholder="00/00" 
                required/>
            </div>
            <div>
                <label>CVV</label>
                <InputMask 
                {...register("cvv", {
                    required: "Потрібно ввести CVV-код картки",
                    pattern: {
                        value: /[0-9]{3}/,
                        message: "CVV-код картки введено невірно"
                    }

                })} 
                className="form-control modalSmallInput" 
                mask="999" 
                placeholder="000" 
                required/>
            </div>
        </div>

        <div className='form-group'>
            <label>Власник картки</label>
            <input {...register("card_holder", {
                pattern: {
                    value: /^[a-zA-Z]+\s[a-zA-Z]+$/,
                    message: "Ім'я введено невірно"
                }
                })} 
                className="form-control"
                onKeyPress={(event) => {if (!/[a-zA-Z]|[ ]/.test(event.key)) event.preventDefault()}}
                onChange={(event) => {event.target.value = event.target.value.toUpperCase()}}
                />
        </div>

        <div className='form-group'>
            <label>Назва картки</label>
            <input {...register("name")} 
                className="form-control"
                maxLength="20"
            />
        </div>

        <div className='modalSmallInputGroup'>
            <div>
                <label>Сумма</label>
                <input {...register("amount", {
                    pattern: {
                        value: /[0-9]/,
                        message: "Кількість введено невірно"
                }
                })} 
                placeholder="0"
                className='input form-control'
                onKeyPress={(event) => {if (!/[0-9]/.test(event.key)) event.preventDefault()}}
                />
            </div>
            <div>
                <label>Валюта</label>
                <select {...register("currencyName")} className="form-control">
                    {listCurrency.map((currency, index) => (
                    <option key={index} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className='modalButtonGroup'>
            <input type="submit" value="Додати" className="btn btn-primary modalButton"/>
            <input type="button" value="Закрити" onClick={handleCloseAddCard} className="btn btn-primary modalButton"/>
        </div>

    </form>
    </Box>
    </Modal>
    </>
  )
}
