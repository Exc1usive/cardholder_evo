const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();
const path = require("path");

const Wallet = require("./models/wallet.js");
const app = express();
const port = process.env.PORT || process.env.LOCAL_PORT;

app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// deployment

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

// deployment

// connect to mongoDB
const ATLAS_URL = process.env.ATLAS_URL;
mongoose.connect(ATLAS_URL, () => console.log("Successfully connect to mongoDB"));

async function getExtraCardDate(pan) {
  let res = await axios.get(`https://lookup.binlist.net/${pan.replace(/\D+/g, "")}`);
  return (data = {
    payment_system: res.data.scheme,
    card_type: res.data.type,
  });
}

// GET wallet via id
app.get("/api/wallet/:id", (req, res) => {
  Wallet.findOne({ _id: req.params.id })
    .then((wallet) => res.json(wallet))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// POST new cards
app.post("/api/wallet/card/add", (req, res) => {
  Wallet.exists({ cards: { $elemMatch: { pan: req.body.pan } } }, async (err, card) => {
    if (card) return res.json("Card already exist");

    const extraData = await getExtraCardDate(req.body.pan);

    if (!extraData) return res.json("Card already exist");

    const newWallet = {
      amount: req.body.amount,
      card_holder: req.body.card_holder,
      currencyName: req.body.currencyName,
      cvv: req.body.cvv,
      expire_date: req.body.expire_date,
      pan: req.body.pan,
      name: req.body.name,
      payment_system: extraData.payment_system,
      card_type: extraData.card_type,
    };

    Wallet.updateOne({ _id: "62f3f90eff26bfc3d7624781" }, { $push: { cards: newWallet } })
      .then(() => res.json("Card added"))
      .catch((err) => res.status(400).json(`Error: ${err}`));
  });
});

// POST new cash
app.post("/api/wallet/cash/add", (req, res) => {
  const newCash = {
    amount: req.body.amount,
    currencyName: req.body.currencyName,
  };
  Wallet.updateOne({ _id: req.body.id }, { $push: { cash: { ...newCash } } })
    .then(() => res.json("Cash added"))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

// DELETE card via id
app.delete("/api/wallet/card/:id", (req, res) => {
  Wallet.updateOne(
    {},
    {
      $pull: { cards: { _id: req.params.id } },
    },
    () => res.json("card deleted")
  );
});

// DELETE cash via id
app.delete("/api/wallet/cash/:id", (req, res) => {
  Wallet.updateOne(
    {},
    {
      $pull: { cash: { _id: req.params.id } },
    },
    () => res.json("card deleted")
  );
});

// PUT (edit) cash via id
app.put("/api/wallet/cash/edit", (req, res) => {
  Wallet.updateOne({ "cash._id": req.body.id }, { $set: { "cash.$": { ...req.body } } }, () =>
    res.json("cash updated")
  );
});

// PUT (edit) cards via id
app.put("/api/wallet/card/edit", (req, res) => {
  Wallet.findOne({ "cards._id": req.body.id }, (err, wallet) => {
    let card = wallet.cards.find(({ _id }) => _id.toString() === req.body.id);
    card.currencyName = req.body.currencyName;
    card.amount = req.body.amount;
    card.name = req.body.name;
    Wallet.updateOne({ "cards._id": req.body.id }, { $set: { "cards.$": { ...card } } }, () =>
      res.json("cards updated")
    );
  });
});

// GET currencyList
app.get("/api/currency", (req, res) => {
  res.json(["UAH", "USD", "EUR"]);
});

app.listen(port, () => console.log("Server start on port - " + port));
