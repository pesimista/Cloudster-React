/**
 * @typedef {import('./typedefs.jsx').store} store
 * @typedef {import('./typedefs.jsx').key} key
 */
import React, { createContext, useReducer } from 'react';

// archivo a reproducir, carpeta actual, tema, busqueda

/** @type {store} */
const initialValue = {
  user: {
    id: '',
    usuario: '',
    nombre: '',
    apellido: '',
    pregunta1: 0,
    pregunta2: 0,
    desde: '',
    nivel: 0,
  },
  playing: 525906,
  folder: 0,
  history: [],
  theme: false,
  search: '',
  logStatus: 1,
};

/** @params {logStatus}
 * 0 logof
 * 1 loging in
 * 2 loged in
 * */

/** Store */
const saduwux = createContext(initialValue);
const Provider = saduwux.Provider;

/** @type {function} */
const reducer = (state, action) => {
  const { payload, type } = action;
  if (typeof payload.theme !== 'undefined') {
    localStorage.setItem('theme', payload.theme)
  }
  switch (type) {
    case 'update': {
      const newState = { ...state, ...payload };
      console.log(type, payload);
      return newState;
    }
    case 'login': {
      const newState = { ...state, ...payload, logStatus: 2 };
      console.log(type, { ...payload, logStatus: 2 });
      return newState;
    }
    case 'moveForward': {
      const newState = {
        ...state,
        history: [...state.history, state.folder],
        folder: payload,
      };
      return newState;
    }
    case 'moveBack': {
      const newState = { ...state };
      newState.folder = state.history.pop();
      return newState;
    }
    case 'moveHome': {
      const newState = { ...state, history: [], folder: 0 };
      return newState;
    }
    case 'clean': {
      const newState = { ...state, search: '' };
      return newState;
    }
    case 'reset':
    default:
      return { ...initialValue, logStatus: 0 };
  }
};

/** Store provider */
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialValue);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { StoreProvider, saduwux };
