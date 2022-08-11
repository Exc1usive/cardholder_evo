import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import axios from 'axios'
import ModalAddWallet from './ModalAddWallet';
import ModalAddCash from './ModalAddCash';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    borderRadius: "25px",
    p: 4,
    color: 'white'
  };



export default function Cardmenu(props) {

    const {
        updateForm,
        setUpdateForm,
        id,
        listCurrency
    } = props

    // state for open and close modal ADD WALLET window
    const [openAddWallet, setOpenAddWallet] = useState(false);
    const handleOpenAddWallet = () => setOpenAddWallet(true);
    const handleCloseAddWallet = () => setOpenAddWallet(false);

    // state for open and close modal ADD CASH window
    const [openAddCash, setOpenAddCash] = useState(false);
    const handleOpenAddCash = () => setOpenAddCash(true);
    const handleCloseAddCash = () => setOpenAddCash(false);

    const [cards, setCards] = useState([{
        pan: "",
        expire_date: "",
        cvv: 0,
        payment_system: "",
        card_type: "",
        card_holder: "",
        currencyName: "",
        amount: 0,
        original_pan: "",
        masked_pan: "",
    }]);

    useEffect(() => {
        axios
            .get(`/api/wallets/${id}`)
            .then((res) => {
                setCards(res.data.cards)
                res.data.cards.map((card, i) => {
                    return setCards((prev) => {
                        prev[i].masked_pan = card.pan.slice(0,4) + " **** **** " + card.pan.slice(15, 19)
                        prev[i].original_pan = card.pan
                        prev[i].pan = prev[i].masked_pan
                        return prev
                })})
            })
            .catch(error => console.log(error)) 
      }, [id, updateForm]);

    const ButtonGroup = () => {
        return (
        <div className="buttonGroup">
            <button 
                className="btn btn-secondary"
                onClick={handleOpenAddWallet}
            >
                Додати карту
            </button>

            <button 
                className="btn btn-secondary"
                onClick={handleOpenAddCash}
            >
                Додати готівку
            </button>
        </div>
        )
    }

    const ModalGroup = () => {
        return (
        <div className='modalGroup'>
            <Modal
                open={openAddWallet}
                onClose={handleCloseAddWallet}
            >
                <Box sx={style}>
                    <ModalAddWallet 
                        handleCloseAddWallet={handleCloseAddWallet}
                        listCurrency={listCurrency}
                        setUpdateForm={setUpdateForm}
                    />
                </Box>
            </Modal>

            <Modal
                open={openAddCash}
                onClose={handleCloseAddCash}
            >
                <Box sx={style}>
                    <ModalAddCash 
                        id={id}
                        handleCloseAddCash={handleCloseAddCash}
                        listCurrency={listCurrency}
                        setUpdateForm={setUpdateForm}
                    />
                </Box>
            </Modal>
        </div>
        )
    }


    function handlePanClick(i) {
        setCards((prev) => {
            if (prev[i].pan === prev[i].masked_pan) {
                prev[i].pan = prev[i].original_pan
            } else {
                prev[i].pan = prev[i].masked_pan
            }
            setCards(prev)
        })
    }

    function handleCopyClick(i) {
        navigator.clipboard.writeText(cards[i].original_pan);
    }

    function checkImageExist(card_index) {
        let card_payment_system = cards[card_index].payment_system
        let imageExist = false
        
        switch (card_payment_system) {
            case "mastercard":
            case "visa":
                imageExist = true
                break;
            default:
                break;
        }

        return imageExist
    }

    function handleDeleteClick(id) {
        axios
      .delete(`/api/wallets/delete/${id}`)
      .then(res => {
        console.log(res);
        setUpdateForm(prev => !prev)
      })
      .catch(err => console.log(err))
    }

    const CardList = () => {
        return cards.map((card, i) => {
            return (
                <div className='cardList' key={i}>
                    <div className='cardBox' >
                    <div className='card'>
                    <div className='typeBox'>
                        {checkImageExist(i) ? <img className='cardPaymentSystemImage' src={`./${card.payment_system}.png`} alt='paymentSystem'></img>
                                            : <label className='cardPaymentSystemLabel'>{card.payment_system}</label>}
                        <label className='cardType'>{card.card_type}</label>
                    </div>
                        <p className='cardName'>{card.name}</p>
                        <p className='cardAmount'>{card.amount} {card.currencyName}</p>
                    <div className='panBox'>
                        <p id='cardId' className='cardPan' onClick={() => handlePanClick(i)}>{card.pan}</p>
                        <button className='copyPan btn btn-primary-outline' onClick={() => handleCopyClick(i)}>copy</button>
                    </div>
                        <p className='cardDateExpire'>{card.expire_date}</p>
                    </div>
                    </div>
                    <div className='cardBoxButton'>
                        <button className='btn btn-dark' onClick={() => handleDeleteClick(card._id)}>Видалити</button>
                    </div>
                </div>
            )
        })
    }

  return (
    <div className='cardMenu'>
        
        {<ButtonGroup />}

        {<CardList />}

        {<ModalGroup />}

    </div>
  )
}
