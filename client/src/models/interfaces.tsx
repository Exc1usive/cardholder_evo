export interface Wallet {
  cash: [
    {
      _id: string;
      currencyName: string;
      amount: number;
    }
  ];
  cards: [
    {
      _id: string;
      pan: string;
      expire_date: string;
      cvv: string;
      payment_system: string;
      card_type: string;
      card_holder: string;
      currencyName: string;
      amount: number;
      name: string;
    }
  ];
}

export interface Card {
  _id: string;
  pan: string;
  expire_date: string;
  cvv: string;
  payment_system: string;
  card_type: string;
  card_holder: string;
  currencyName: string;
  amount: number;
  name: string;
  original_pan: string;
  masked_pan: string;
}

export interface Cash {
  _id: string;
  currencyName: string;
  amount: number;
}

export type Currency = string[]

export interface Balance {
  currencyName: string;
  amount: number;
}

export interface CardmenuProps {
  updateForm: boolean;
  setUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  listCurrency: Currency;
}

export interface SidemenuProps {
  updateForm: boolean;
  setUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  listCurrency: Currency;
}

export interface ModalAddCardProprs {
  handleCloseAddCard: () => void;
  listCurrency: Currency;
  setUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  openAddCard: boolean;
}

export interface ModalAddCashProps {
  id: string;
  handleCloseAddCash: () => void;
  listCurrency: Currency;
  setUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  openAddCash: boolean;
}

export interface ModalEditCardProps {
  listCurrency: Currency;
  cardId: string;
  selectedCurrency: string;
  onChangeCurrency: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  amount: number;
  setAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCloseEditCard: () => void;
  setUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  openEditCard: boolean;
  cardName: string;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ModalEditCashProps {
  listCurrency: Currency;
  cashId: string;
  selectedCurrency: string;
  onChangeCurrency: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  amount: number;
  setAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCloseEditCash: () => void;
  setUpdateForm: React.Dispatch<React.SetStateAction<boolean>>;
  openEditCash: boolean;
}
