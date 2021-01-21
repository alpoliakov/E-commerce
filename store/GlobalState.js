import React, { createContext, useReducer, useEffect } from 'react';
import reducers from './Reducers';
import PropTypes from 'prop-types';
import { getData } from '../utils/fetchData';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const initialState = { notify: {}, auth: {}, cart: [], orders: [] };
  const [state, dispatch] = useReducer(reducers, initialState);
  const { cart, auth } = state;

  useEffect(() => {
    const firstLogin = localStorage.getItem('firstLogin');

    if (firstLogin) {
      getData('auth/accessToken').then((res) => {
        if (res.err) {
          return localStorage.removeItem('firstLogin');
        }

        dispatch({
          type: 'AUTH',
          payload: {
            token: res.access_token,
            user: res.user,
          },
        });
      });
    }
  }, []);

  useEffect(() => {
    const __next__cart01__app = JSON.parse(localStorage.getItem('__next__cart01__app'));

    if (__next__cart01__app) {
      dispatch({ type: 'ADD_CART', payload: __next__cart01__app });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('__next__cart01__app', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (auth.token) {
      getData('order', auth.token).then((res) => {
        if (res.err) {
          return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
        }

        dispatch({ type: 'ADD_ORDERS', payload: res.orders });
      });
    }
  }, [auth.token]);

  return <DataContext.Provider value={{ state, dispatch }}>{children}</DataContext.Provider>;
};

DataProvider.propTypes = {
  children: PropTypes.element,
};
