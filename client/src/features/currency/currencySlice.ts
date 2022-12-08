import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import axios from "axios";

type CurrencyState = {
    currencyList: any;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
};

export const getCurrency = createAsyncThunk("currency/getCurrency", async () => {
    const response = await axios
        .get(`http://localhost:5000/api/currency`)
    // console.log("response data");
    // console.log(response.data);
    return response.data;
});

const initialState: CurrencyState = {
    currencyList: [],
    status: 'idle',
    error: null
};

export const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
          .addCase(getCurrency.pending, (state, action) => {
            state.status = 'loading'
          })
          .addCase(getCurrency.fulfilled, (state, action) => {
            state.status = 'succeeded'
            // Add any fetched posts to the array
            state.currencyList = state.currencyList.concat(action.payload)
          })
          .addCase(getCurrency.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
          })
      }
});

// export const {} = currencySlice.actions;

export const selectCurrency = (state: RootState) => state.currency.currencyList;

export default currencySlice.reducer;
