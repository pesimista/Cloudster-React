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
 * @typedef context
 * @type {object}
 * @property {store} state - self explanatory
 * @property {Function} dispatch - self explanatory
 */

/**
 * @typedef file
 * @type {object}
 * @property {number} [id] -
 * @property {number} ino -
 * @property {string} name -
 * @property {string} [url] -
 * @property {string} ext -
 * @property {boolean} isFile -
 * @property {boolean} available -
 * @property {string} [lastModified] -
 * @property {string} [lastChanged] -
 * @property {string} [lastAccessed] -
 * @property {string} birthtime -
 * @property {number} fullSize -
 * @property {string} size -
 * @property {number} [dependency] -
 * @property {number} nivel -
 */

/**
 * @typedef searchState
 * @type {object}
 * @property {boolean} open i have no idea what it opens
 * @property {string} message some message
 * @property {file} fileForModal The file data to be displayed by the modal
 * @property {boolean} uploadModal Whether or not the upload modal should be open
 * @property {file[]} files  The files in the selected directory
 * @property {boolean} shouldUpdate Helper to update after uploading a file
 */

/**
 * @typedef inputFile
 * @type {object}
 * @property {string} fileField
 * @property {string} fileFieldName
 * @property {string} originalName
 * @property {string} ext
 * @property {number} folder
 */