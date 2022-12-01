import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalAddCard from "./ModalAddCard";
import ModalAddCash from "./ModalAddCash";
import { Cards, Card } from "../models/interfaces";

export default function Cardmenu(props: any) { // what to do with props?
  const { updateForm, setUpdateForm, id, listCurrency } = props;

  const [cards, setCards] = useState<Cards>([
    {
      _id: "",
      pan: "",
      expire_date: "",
      cvv: "",
      payment_system: "",
      card_type: "",
      card_holder: "",
      currencyName: "",
      amount: 0,
      name: "",
      original_pan: "",
      masked_pan: "",
    },
  ]);

  useEffect(() => {
    axios
      .get(`api/wallet/${id}`)
      .then((res) => {
        setCards(res.data.cards);
        res.data.cards.map((card: Card, i: number) => {
          return setCards((prev) => {
            prev[i].masked_pan = card.pan.slice(0, 4) + " **** **** " + card.pan.slice(15, 19);
            prev[i].original_pan = card.pan;
            prev[i].pan = prev[i].masked_pan;
            return prev;
          });
        });
      })
      .catch((err) => console.log(err));
  }, [id, updateForm]);

  const ModalAddCardButton = () => {
    // state for open and close modal ADD WALLET window
    const [openAddCard, setOpenAddCard] = useState(false);
    const handleOpenAddCard = () => setOpenAddCard(true);
    const handleCloseAddCard = () => setOpenAddCard(false);
    return (
      <>
        <button className='btn btn-secondary cardMenuButton' onClick={handleOpenAddCard}>
          Додати карту
        </button>

        <ModalAddCard
          handleCloseAddCard={handleCloseAddCard}
          listCurrency={listCurrency}
          setUpdateForm={setUpdateForm}
          openAddCard={openAddCard}
        />
      </>
    );
  };

  const ModalAddCashButton = () => {
    // state for open and close modal ADD CASH window
    const [openAddCash, setOpenAddCash] = useState(false);
    const handleOpenAddCash = () => setOpenAddCash(true);
    const handleCloseAddCash = () => setOpenAddCash(false);

    return (
      <>
        <button className='btn btn-secondary cardMenuButton' onClick={handleOpenAddCash}>
          Додати готівку
        </button>

        <ModalAddCash
          id={id}
          handleCloseAddCash={handleCloseAddCash}
          listCurrency={listCurrency}
          setUpdateForm={setUpdateForm}
          openAddCash={openAddCash}
        />
      </>
    );
  };

  const CardList = () => {
    function handlePanClick(i: number) {
      setCards((prev) => {
        if (prev[i].pan === prev[i].masked_pan) {
          prev[i].pan = prev[i].original_pan;
        } else {
          prev[i].pan = prev[i].masked_pan;
        }
        return prev;
      });
    }

    function handleCopyClick(i: number) {
      navigator.clipboard.writeText(cards[i].original_pan);
    }

    function checkImageExist(card_index: number) {
      let card_payment_system = cards[card_index].payment_system;
      let imageExist = false;

      switch (card_payment_system) {
        case "mastercard":
        case "visa":
          imageExist = true;
          break;
        default:
          break;
      }

      return imageExist;
    }

    function handleDeleteClick(id: string) {
      axios
        .delete(`/api/wallet/card/${id}`)
        .then(() => {
          setUpdateForm((prev:boolean) => !prev);
        })
        .catch((err) => console.log(err));
    }

    return (
      <>
        {" "}
        {cards.map((card, i) => {
          return (
            <div className='cardList' key={i}>
              <div className='cardBox'>
                <div className='card'>
                  {checkImageExist(i) ? (
                    <img
                      className='cardPaymentSystemImage'
                      src={`./${card.payment_system}.png`}
                      alt='paymentSystem'
                    ></img>
                  ) : (
                    <label className='cardPaymentSystemLabel'>{card.payment_system}</label>
                  )}
                  <label className='cardType'>{card.card_type}</label>
                  <p className='cardName'>{card.name}</p>
                  <p className='cardAmount'>
                    {card.amount} {card.currencyName}
                  </p>
                  <div className='panBox'>
                    <p id='cardId' className='cardPan' onClick={() => handlePanClick(i)}>
                      {card.pan}
                    </p>
                    <button
                      className='copyPan btn btn-primary-outline'
                      onClick={() => handleCopyClick(i)}
                    >
                      copy
                    </button>
                  </div>
                  <p className='cardDateExpire'>{card.expire_date}</p>
                </div>
              </div>
              <div>
                <button
                  className='btn btn-dark cardDeleteButton'
                  onClick={() => handleDeleteClick(card._id)}
                >
                  Видалити
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className='cardMenu'>
      <div className='buttonGroup'>
        {<ModalAddCardButton />}
        {<ModalAddCashButton />}
      </div>

      {<CardList />}
    </div>
  );
}
