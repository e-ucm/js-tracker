/**
 * The Context Class of a Statement
 */
export default class ContextStatement {
    /**
     * Constructor of the ContextStatement class
     *
     * @param {*} categoryId category Id of context
     * @param {*} registrationId registration id of context
     */
    constructor(categoryId?: any, registrationId?: any);
    /**
     * Registration Id of the Context
     *
     * @type {string}
     */
    registration: string;
    categoryId: any;
    category: any;
    /**
     * Extensions of the Context
     *
     * @type {Object}
     */
    extensions: any;
    /**
     * The category IDs list
     */
    categoryIDs: {
        seriousgame: string;
        scorm: string;
    };
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    setExtensions(ext: any): void;
    setExtension(key: any, value: any): void;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
