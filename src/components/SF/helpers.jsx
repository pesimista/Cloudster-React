/**
 * @typedef {import('../SF/typedefs.jsx').inputFile} inputFile
 */
//SVG
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import folder from './svg/folder.svg';
import audio from './svg/Papirus-Team-Papirus-audio.svg';
import program from './svg/Papirus-Team-Papirus-Mimetypes-App-x-msdos-program.svg';
import compress from './svg/Papirus-Team-Papirus-compress.svg';
import html from './svg/Papirus-Team-Papirus-html.svg';
import pic from './svg/Papirus-Team-Papirus-ImageGeneric.svg';
import iso from './svg/Papirus-Team-Papirus-iso.svg';
import json from './svg/Papirus-Team-Papirus-json.svg';
import js from './svg/Papirus-Team-Papirus-Mimetypes-App-x-javascript.svg';
import doc from './svg/Papirus-Team-Papirus-Mimetypes-X-office-document.svg';
import pp from './svg/Papirus-Team-Papirus-Mimetypes-X-office-presentation.svg';
import excel from './svg/Papirus-Team-Papirus-Mimetypes-X-office-spreadsheet.svg';
import pdf from './svg/Papirus-Team-Papirus-pdf.svg';
import book from './svg/Paomedia-Small-N-Flat-Book.svg';
import text from './svg/Paomedia-Small-N-Flat-File-text.svg';
import jar from './svg/Papirus-Team-Papirus-Mimetypes-Text-x-java.svg';
import video from './svg/Papirus-Team-Papirus-video.svg';
import zerosize from './svg/Papirus-Team-Papirus-zerosize.svg';
//SVG

export const reactLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = 'reactLink';

export const handleFetch = (response) => {
  return response.json().then((json) => {
    if (response.ok) return json;
    else return Promise.reject(json);
  });
};

/**
 * Converts the bytes into its correspoding unit in terms of space
 * @param {number} size full size
 * @returns {string} the size
 */
export const parseSize = (size) => {
  if (size < 1024) return `${size.toFixed(2)} Bytes`;

  size = size / 1024;
  if (size < 1024) return `${size.toFixed(2)} KB`;

  size = size / 1024;
  if (size < 1024) return `${size.toFixed(2)} MB`;

  size = size / 1024;
  return `${size.toFixed(2)} GB`;
};

export const getIcon = (isFile, ext) => {
  if (!isFile) return folder;
  switch (ext) {
    case 'jpg':
    case 'png':
      return pic;
    case 'exe':
    case 'msi':
      return program;
    case 'mp3':
    case 'wav':
    case 'm4a':
      return audio;
    case 'mp4':
    case 'mkv':
      return video;
    case 'rar':
    case 'zip':
      return compress;
    case 'json':
      return json;
    case 'js':
    case 'jsx':
      return js;
    case 'jar':
      return jar;
    case 'iso':
      return iso;
    case 'pdf':
      return pdf;
    case 'txt':
      return text;
    case 'epub':
      return book;
    case 'doc':
    case 'docx':
      return doc;
    case 'pptx':
      return pp;
    case 'xlsx':
      return excel;
    case 'html':
      return html;
    default:
      return zerosize;
  }
}; //GetIcon

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
  return keys.every((key) => {
    const { name, required, type, length } = key;

    if (required && !item[name]) {
      return false;
    }

    if (type && typeof item[name] !== type) {
      return false;
    }

    if (length && item[name].length < length) {
      return false;
    }

    return true;
  });
};

/**
 * @param {inputFile} data The data to be posted
 * @param {Function} onSuccess funtion to be called when the fecth has concluded successfully
 * @param {Function} onError throw and error
 */
export const postFile = (data, onSuccess, onError) => {
  if (!data.fileField || isNaN(data.folder)) return;

  let formData = new FormData();
  formData.append('file', data.fileField);
  formData.append('name', data.fileFieldName);

  fetch(`/api/files/${data.folder}`, {
    method: 'POST',
    headers: {
      Authorization: localStorage.getItem('token'),
    },
    enctype: 'multipart/form-data',
    body: formData,
  })
    .then(handleFetch)
    .then(onSuccess('Archivo subido satisfactoriamente!'))
    .catch(onError);
};

export const newFolder = (folderName, folder, onSuccess, onError) => {
  if (!folderName) return;
  fetch(`/api/files/${folder}/folder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    },
    enctype: 'application/json',
    body: JSON.stringify({
      name: folderName,
    }),
  })
    .then(handleFetch)
    .then(onSuccess('Carpeta creada con exito!'))
    .catch(onError);
};

/**
 *
 * Usuario:
 * Añadir chart con los tipos de archivos subidos por el usuario
 * Añadir archivos subidos por el usuario
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
 */
