/**
 * Created by Heng WU on 16/1/21.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {desc} regexp
 * @param {value}  value
 * @returns {Boolean}
 */
export function check(desc, value) {
  var regexp = new RegExp(desc)
  if (!regexp.test(value)) {
      return false;
  } else {
      return true;
  }
}
