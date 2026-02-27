import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FitnessResponse } from '../types';

interface AuthState {
    signingIn: boolean;
    plan: FitnessResponse | null;
}

const initialState: AuthState = {
    signingIn: false,
    plan: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setSigningIn(state, action: PayloadAction<boolean>) {
            state.signingIn = action.payload;
        },
        setPlan(state, action: PayloadAction<FitnessResponse | null>) {
            state.plan = action.payload;
        },
    },
});

export const { setSigningIn, setPlan } = authSlice.actions;

export default authSlice.reducer;
