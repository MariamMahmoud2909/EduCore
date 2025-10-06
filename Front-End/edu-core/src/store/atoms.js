import { atom } from 'jotai';

// Parse stored user data
const storedUser = localStorage.getItem('user');
const parsedUser = storedUser ? JSON.parse(storedUser) : null;

// Auth State
export const userAtom = atom(parsedUser);
export const isAuthenticatedAtom = atom((get) => get(userAtom) !== null);
export const isAdminAtom = atom((get) => get(userAtom)?.isAdmin || false);
export const tokenAtom = atom(localStorage.getItem('token') || null);

// Cart State
export const cartAtom = atom([]);
export const cartCountAtom = atom((get) => get(cartAtom).length);
export const cartTotalAtom = atom((get) => {
  const cart = get(cartAtom);
  return cart.reduce((total, item) => total + item.price, 0);
});

// Loading State
export const isLoadingAtom = atom(false);

// Modal State
export const modalOpenAtom = atom(false);
export const modalDataAtom = atom(null);
