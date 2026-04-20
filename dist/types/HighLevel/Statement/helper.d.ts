/**
 * Set as URI if it is not an URI already
 * @param {string} id the id of the part of the statement
 * @param {string} base the base URI to use if id is not an URI
 * @returns {String}
 */
export function setAsUri(id: string, base: string): string;
/**
 * Check if the string is an URI
 * @param {string} id
 * @returns {boolean}
 */
export function isUri(id: string): boolean;
