// src/redux/companySlice.js
import { createSlice } from '@reduxjs/toolkit';

const companySlice = createSlice({
  name: 'company',
  initialState: {
    fei_number_count: 0,
    warning_letter_count: 0,
  },
  reducers: {
    setCompanyData(state, action) {
      state.fei_number_count = action.payload.fei_number_count;
      state.warning_letter_count = action.payload.warning_letter_count;
    },
    clearCompanyData(state) {
      state.fei_number_count = 0;
      state.warning_letter_count = 0;
    },
  },
});

export const { setCompanyData, clearCompanyData } = companySlice.actions;

export default companySlice.reducer;
