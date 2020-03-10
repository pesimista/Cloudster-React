import { createContext } from 'react';

export const handleFetch = (response) => {
   return response.json()
      .then(json => {
         if (response.ok)
            return json;
         else
            return Promise.reject(json);
      });
};

/**
 * 
 * @param {any} item 
 * @param {{name;required;type;length}[]} keys
 */
export const structuteChecker = (item, keys) => {
   return keys.every(
      key => {
         console.log(key);
         const { name, required, type, length } = key;

         if (required && !item[name]) {
            console.log(item);
            console.log('Missing required ' + name + ' ' + item[name])
            return false;
         }

         if (type && typeof item[name] !== type) {
            console.log('Type doesnt match ' + name)
            return false;
         }

         if (length && item[name].length < length) {
            console.log('length ' + name)
            return false;
         }

         return true;
      }
   )
};

export const Context = createContext({
   usuario: {
      id: '',
      usuario: '',
      nombre: '',
      apellido: '',
      pregunta1: '',
      pregunta2: '',
      desde: '',
      nivel: 0 
   }
});

// archivo a reproducir, carpeta actual, tema, busqueda
export const Provider = Context.Provider;
export const Consumer = Context.Consumer;

/**
 * Usuario:
 * Añadir chart con los tipos de archivos subidos por el usuario
 * Añadir archicos subidos por el usuario
 * Uso total del servidor
 * 
 * Backend
 * Comprobacion de los datos
 * Generar reporters
 * Estadisticas generales y especificas
 */

 /**
  * Admin:
  * Añadir chart con los tipos de archivos subidos al sistema
  * Añadir memiria total del servidor
  * Usuarios por nivel
  * Total de usuarios
  */

 /**
  * Milcelaneos
  * Hacer que el reproductor funcione en segundo plano
  * Subir archivos en un modal
  */