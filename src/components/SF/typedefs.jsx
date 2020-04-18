/** Auxiliares para la documentacion */

export const doc = {};

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
 * @property {!number} pregunta1 - id de la primera pregunta secreta
 * @property {!number} pregunta2 - id de la seguda pregunta secreta
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

/**
 * @typedef file
 * @type {object}
 * @property {number} [id] -
 * @property {number} in -
 * @property {string} nam -
 * @property {string} [url] -
 * @property {string} ex -
 * @property {boolean} isFil -
 * @property {boolean} availabl -
 * @property {string} [lastModified] -
 * @property {string} [lastChanged] -
 * @property {string} [lastAccessed] -
 * @property {string} birthtim -
 * @property {number} fullSiz -
 * @property {string} siz -
 * @property {number} [dependency] -
 * @property {number} nive -
 */