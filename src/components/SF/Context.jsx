/**
 * @typedef {import('./typedefs.jsx').store} store
 * @typedef {import('./typedefs.jsx').key} key
 */
import React, { createContext, useReducer } from "react";

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
      nivel: 0
   },
   playing: 0,
   folder: 0,
   theme: false,
   search: ''
};

/** Store */
const saduwux = createContext(initialValue);
const Provider = saduwux.Provider;

/** @type {function} */
const reducer = (state, action) => {
   const { payload, type } = action;

   switch (type) {
      case 'update': {
         const newState = { ...state, ...payload }
         console.log(payload)
         return newState;
      }
      case 'reset':
      default:
         return initialValue;
   }


};

/** Store provider */
const StoreProvider = ({ children }) => {
   const [state, dispatch] = useReducer(reducer, initialValue);

   return <Provider value={{ state, dispatch }}>{children}</Provider>;

}

export { StoreProvider, saduwux }

