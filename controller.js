'use strict';

const request = require('request');

const URL = 'http://localhost:8080/api/newdeveloper/';

/**
 * @function  [getPercentBrightness]
 * @param     {Number}  brightness     Brightness value, ranging from 0 to 254
 * @returns   {Number}  brightPercent  Number (from 0 to 100) representing the
 *                                     % brightness of the light.
 */
const getPercentBrightness = (brightness) => {
  return Math.round(brightness / 254 * 100);
};

/**
 * @function  [getNumericalBrightness]
 * @param     {Number}  briPerc        Brightness % value, ranging from 0 to 100
 * @returns   {Number}  briNum         Brightness value, ranging from 0 to 254
 */
const getNumericalBrightness = (briPerc) => {
  return Math.round(briPerc / 100 * 254);
};

/**
 * @function  [validateId]
 * @param     {String}     id    The ID to validate
 * @returns   a promise who rejects if the ID is invalid, and resolves otherwise
 */
const validateId = (id) => {
  const lightURL = URL.concat('lights');
  return new Promise((resolve, reject) => {
    request.get(lightURL, (error, response, body) => {
      if (error) reject(error);
      else {
        const lights = JSON.parse(body);
        const lightIdArr = Object.keys(lights);
        if (lightIdArr.indexOf(id) > -1) resolve();
        else reject('Invalid light ID.');
      }
    });
  });
};

/**
 * @function  [formatOutput]
 * @param     {Object}  fullLightObj  API-returned obj with unneeded info
 * @returns   {Array}   lightArr      All the lights and their state
 */
const formatOutputToArray = (fullLightObj) => {
  const lightArr = [];

  Object.keys(fullLightObj).forEach((key) => {

    const lightObj = fullLightObj[key];
    const name = lightObj.name;
    const state = lightObj.state;

    const temp = {
      name: name,
      id: key,
      on: state.on,
      brightness: getPercentBrightness(state.bri)
    };

    lightArr.push(temp);
  });

  return lightArr;
};

/**
 * @function  [getInfoAll]
 * @param     {boolean}    init  set to true if called during initialization
 *
 * Returns a promise whose resolution prints out all avialble lights
 * and formats the output to only show relevant information.
 */
const getInfoAll = (init) => {
  return new Promise((resolve, reject) => {
    request.get(URL, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const fullState = JSON.parse(body);
        const info = formatOutputToArray(fullState.lights);

        if (init) {
          console.log(`There are ${info.length} available light(s):`);
        }

        if (info.length) {
          resolve(JSON.stringify(info, null, 4));
        }
      }
    });
  });
};

/**
 * @function  [toggleLight]
 *
 * Returns a promise whose resolution is an object of the form
 * { id, on}
 */
const toggleLight = (id, on) => {
  const putURL = URL.concat(`lights/${id}/state`);

  return new Promise((resolve, reject) => {
    validateId(id)
      .then(() => {
        request.put({ url: putURL, json: { on } }, (error) => {
          if (error) reject(error);
          else {
            const formatJSON = JSON.stringify({ id, on }, null, 4);
            resolve(formatJSON);
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * @function  [toggleBrightness]
 *
 * Returns a promise whose resolution is an object of the form
 * { id, brightness}
 */
const toggleBrightness = (id, briVal) => {
  const putURL = URL.concat(`lights/${id}/state`);
  const bri = getNumericalBrightness(briVal);

  return new Promise((resolve, reject) => {
    validateId(id)
      .then(() => {
        request.put({ url: putURL, json: { bri } }, (error) => {
          if (error) reject(error);
          else {
            const output = { id: id, brightness: Number(briVal) };
            const formatJSON = JSON.stringify(output, null, 4);
            resolve(formatJSON);
          }
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Export controller methods
module.exports = { getInfoAll, toggleLight, toggleBrightness };
