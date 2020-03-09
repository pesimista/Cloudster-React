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
