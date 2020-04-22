//SVG
import folder from './svg/folder.svg';
import audio from './svg/Papirus-Team-Papirus-audio.svg';
import compress from './svg/Papirus-Team-Papirus-compress.svg';
import html from './svg/Papirus-Team-Papirus-html.svg';
import pic from './svg/Papirus-Team-Papirus-ImageGeneric.svg';
import iso from './svg/Papirus-Team-Papirus-iso.svg';
import json from './svg/Papirus-Team-Papirus-json.svg';
import Mimetypes from './svg/Papirus-Team-Papirus-Mimetypes-X-office-document.svg';
import pdf from './svg/Papirus-Team-Papirus-pdf.svg';
import video from './svg/Papirus-Team-Papirus-video.svg';
import zerosize from './svg/Papirus-Team-Papirus-zerosize.svg';
//SVG

export const handleFetch = (response) => {
   return response.json()
      .then(json => {
         if (response.ok)
            return json;
         else
            return Promise.reject(json);
      });
};

export const getIcon = (isFile, ext) => {
   if (!isFile)
      return folder;
   switch (ext) {
      case 'jpg':
      case 'png':
         return pic;
      case 'mp3':
      case 'wav':
         return audio;
      case 'mp4':
      case 'mkv':
         return video;
      case 'rar':
      case 'zip':
         return compress;
      case 'json':
      case 'js':
         return json;
      case 'iso':
         return iso;
      case 'pdf':
         return pdf;
      case 'txt':
         return Mimetypes;
      case 'html':
         return html;
      default:
         return zerosize;
   }
}//GetIcon

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
 */