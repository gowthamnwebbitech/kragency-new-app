import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    cartId: string; // Unique ID for deletion
    gameId: number;
    gameName: string;
    price: number;
    quantity: number;
    digits: string;
    winAmount: number;
    provider?: string; // Added for UI display
}

interface CartState {
    items: CartItem[];
    totalAmount: number;
}

const initialState: CartState = {
    items: [],
    totalAmount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.items.push(action.payload);
            state.totalAmount += action.payload.price * action.payload.quantity;
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.cartId === action.payload);
            if (item) {
                state.totalAmount -= item.price * item.quantity;
                state.items = state.items.filter(i => i.cartId !== action.payload);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;