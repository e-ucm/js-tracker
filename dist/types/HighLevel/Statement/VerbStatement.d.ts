/**
 * The Verb Class  of a Statement
 */
export default class VerbStatement {
    /**
     * Create a VerbStatement from xAPI verb object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {VerbStatement}
     */
    static fromXAPI(xapiObj: any, baseURI: string): VerbStatement;
    /**
     * Constructor of VerbStatement class
     *
     * @param {typeof ALL.VERBS[keyof typeof ALL.VERBS]|string} id The verb id of the statement
     * @param {string} baseURI The base URI for the statement
     */
    constructor(id: (typeof ALL.VERBS)[keyof typeof ALL.VERBS] | string, baseURI: string);
    /**
     * The Verb Id
     * @type {string}
     */
    id: string;
    /**
     * The Verb display
     * @type {Map<string, string>}
     */
    display: Map<string, string>;
    /**
     * Add or set a verb display
     * @param {string} lang
     * @param {string} display
     */
    addDisplay(lang: string, display: string): void;
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
import { ALL } from "./Ids/Profiles/Generated/index.js";
