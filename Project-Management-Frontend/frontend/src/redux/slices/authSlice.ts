import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    roles: string[];
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isInitializing: true,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            try {
                localStorage.setItem('taskflow_token', action.payload);
                sessionStorage.setItem('taskflow_token', action.payload);
            } catch (e) {
                console.error("Storage error:", e);
            }
        },
        loginSuccess: (state, action: PayloadAction<{ user: User; token?: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.isInitializing = false;
            state.user = action.payload.user;

            if (action.payload.token) {
                state.token = action.payload.token;
                try {
                    localStorage.setItem('taskflow_user', JSON.stringify(action.payload.user));
                    localStorage.setItem('taskflow_token', action.payload.token);
                    sessionStorage.setItem('taskflow_user', JSON.stringify(action.payload.user));
                    sessionStorage.setItem('taskflow_token', action.payload.token);
                } catch (e) {
                    console.error("Storage error:", e);
                }
            }
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.isInitializing = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isInitializing = false;
            try {
                localStorage.removeItem('taskflow_user');
                localStorage.removeItem('taskflow_token');
                sessionStorage.removeItem('taskflow_user');
                sessionStorage.removeItem('taskflow_token');
            } catch (e) {
                console.error("Storage clear error:", e);
            }
        },
        setInitializing: (state, action: PayloadAction<boolean>) => {
            state.isInitializing = action.payload;
        }
    },
});

export const { loginStart, setToken, loginSuccess, loginFailure, logout, setInitializing } = authSlice.actions;

export default authSlice.reducer;
