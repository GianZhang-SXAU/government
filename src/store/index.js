// src/store/index.js
import { createSlice, configureStore } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: { data: null, type: null },
    reducers: {
        setUser: (state, action) => {
            state.data = action.payload.data;
            state.type = action.payload.type;
        },
        clearUser: (state) => {
            state.data = null;
            state.type = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

const store = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
});

export default store;
