export const history = require("history").createBrowserHistory();

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
 * @param {Object[]} keys description
 * @param {string} keys.name
 * @param {boolean} keys.required
 * @param {number} [keys.length]
 * @param {string} keys.type
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

/** Auxiliares para la documentacion */

/**
 * @typedef  key
 * @type {Object}
 * @property {string} name
 * @property {boolean} required
 * @property {number} length
 * @property {string} type
 */

/**
 * @typedef usuario
 * @type {object} 
 * @property {string} id - UUID
 * @property {string} usuario - nombre de usuario
 * @property {string} nombre - self explanatory
 * @property {string} apellido - self explanatory
 * @property {number} pregunta1 - id de la primera pregunta secreta
 * @property {number} pregunta2 - id de la seguda pregunta secreta
 * @property {string} desde - la fecha de registro del usuario
 * @property {int} nivel - nivel del usuario
   }
 */

/**
 * @typedef store
 * @type {object}
 * @property {usuario} user - nombre de usuario
 * @property {number} playing - self explanatory
 * @property {number} folder - self explanatory
 * @property {string} theme - id de la primera pregunta secreta
 * @property {string} search - id de la seguda pregunta secreta
 */