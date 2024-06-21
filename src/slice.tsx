/* eslint-disable prettier/prettier */
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storage from './storage';

// let defaultMode = true;

// storage.load({
//   key:'theme',
// }).then(ret=>{defaultMode = ret.isDark;});

export const loadTheme = createAsyncThunk('theme/loadTheme', async () => {
  const storedTheme = await storage.load({
    key:'theme',
  });
  return storedTheme.isDark;
});

const themeSlice = createSlice({
    name: 'theme-mode',
    initialState: {
        isDark: true,
        loading: false,
    },
    reducers: {
        setTheme:state=>{
            state.isDark = !state.isDark;
            storage.save({
              key:'theme',
              data:{
                isDark:state.isDark,
              },
              expires: null,
            });
        },
        loadDefault:state=>{
          storage.load({
            key: 'theme',
          }).then(ret => {state.isDark = ret.isDark;})
          .catch(err=>{
            switch (err.name) {
              case 'NotFoundError':
                // TODO;
                break;
              case 'ExpiredError':
                // TODO
                break;
            }
          });
        },
    },
    extraReducers: (builder) => {
      builder
          .addCase(loadTheme.pending, (state) => {
              state.loading = true;
          })
          .addCase(loadTheme.fulfilled, (state, action) => {
              state.isDark = action.payload;
              state.loading = false;
          })
          .addCase(loadTheme.rejected, (state) => {
              state.loading = false;
          });
    },
});

export const {setTheme,loadDefault} = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
