/**
 * Set as URI if it is not an URI already
 * @param {string} id the id of the part of the statement
 * @param {string} base the base URI to use if id is not an URI
 * @returns {String}
 */
export function setAsUri(id, base) {
    if (isUri(id)) {
        return id;
    }
    // Remove trailing slash if present
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }
    // Remove leading slash from id if present
    let cleanId = id.startsWith('/') ? id.slice(1) : id;
    if (base.includes('://')) {
        return `${base}/${cleanId}`;
    } else {
        return `${base}://${cleanId}`;
    }
}

/**
 * Check if the string is an URI
 * @param {string} id 
 * @returns {boolean}
 */
export function isUri(id) {
    const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(id);
}