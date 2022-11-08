export interface Wallet {
  cash: [
    {
      _id: string
      currencyName: string,
      amount: number,
    },
  ],
  cards: [
    {
      _id: string,
      pan: string,
      expire_date: string,
      cvv: string,
      payment_system: string,
      card_type: string,
      card_holder: string,
      currencyName: string,
      amount: number,
      name: string,
    },
  ]
}

export interface Card {
  _id: string,
  pan: string,
  expire_date: string,
  cvv: string,
  payment_system: string,
  card_type: string,
  card_holder: string,
  currencyName: string,
  amount: number,
  name: string,
  original_pan: string,
  masked_pan: string,
}

export interface Cards extends Array<Card>{}

export interface Currency {
  currency: [string]
}