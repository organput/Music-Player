/* eslint-disable prettier/prettier */
import {configureStore} from '@reduxjs/toolkit';
import {themeReducer} from './slice';


export const themeStore = configureStore({
  reducer: {
    themeChange: themeReducer,
  },
  // middleware: (getDefaultMiddleware)=>
  //  getDefaultMiddleware({
  //   serializableCheck:false,
  //  }).concat(thunk),
});
