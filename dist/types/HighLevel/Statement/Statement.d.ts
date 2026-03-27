/**
* Statement class
*/
export default class Statement {
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {string} verbId verb id of the statement
     * @param {string} objectId object id of the statement
     * @param {string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor: ActorStatement, verbId: string, objectId: string, objectType: string, context: ContextStatement, defaultURI: string);
    /**
     * Id of the statement
     * @type {string}
     */
    id: string;
    /**
     * Actor of the statement
     * @type {ActorStatement}
     */
    actor: ActorStatement;
    /**
     * Verb of the statement
     * @type {VerbStatement}
     */
    verb: VerbStatement;
    /**
     * default URI of the statement
     * @type {string}
     */
    defaultURI: string;
    /**
     * Object of the statement
     * @type {ObjectStatement}
     */
    object: ObjectStatement;
    /**
     * Timestamp of the statement
     * @type {Date}
     */
    timestamp: Date;
    /**
     * Context of the statement
     * @type {ContextStatement}
     */
    context: ContextStatement;
    /**
     * Version of the statement
     * @type {string}
     */
    version: string;
    /**
     * Result of the statement
     * @type {ResultStatement}
     */
    result: ResultStatement;
    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns {String}
     */
    setAsUri(id: string): string;
    /**
     * Check if the string is an URI
     * @param {string} id
     * @returns {boolean}
     */
    isUri(id: string): boolean;
    /**
     * Set the score of the statement
     * @param {number} raw the raw score
     * @param {number} min the min score
     * @param {number} max the max score
     * @param {number} scaled the scaled score
     */
    setScore(raw: number, min: number, max: number, scaled: number): void;
    /**
     * Set the raw score of the statement
     * @param {number} raw the raw score
     */
    setScoreRaw(raw: number): void;
    /**
     * Set the min score of the statement
     * @param {number} min the min score
     */
    setScoreMin(min: number): void;
    /**
     * Set the max score of the statement
     * @param {number} max the max score
     */
    setScoreMax(max: number): void;
    /**
     * Set the scaled score of the statement
     * @param {number} scaled the scaled score
     */
    setScoreScaled(scaled: number): void;
    /**
     * Set completion status of the statement
     * @param {boolean} value the completion status
     */
    setCompletion(value: boolean): void;
    /**
     * Set success status of the statement
     * @param {boolean} value the success status
     */
    setSuccess(value: boolean): void;
    /**
     * Set duration of the statement
     * @param {Date} init init date of statement
     * @param {Date} end end date of statement
     */
    setDuration(init: Date, end: Date): void;
    /**
     * Set response of the statement
     * @param {string} value the response
     */
    setResponse(value: string): void;
    /**
     * Set progress status of the statement
     * @param {number} value the progress status
     */
    setProgress(value: number): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {string} value the value of the extension
     */
    setVar(key: string, value: string): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    addResultExtension(key: string, value: any): void;
    /**
     * Set result extension as Object key/values of the statement
     * @param {Object} extensions extensions list
     */
    addResultExtensions(extensions: any): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    addContextExtension(key: string, value: any): void;
    /**
     * Set result extension as Object key/values of the statement
     * @param {Object} extensions extensions list
     */
    addContextExtensions(extensions: any): void;
    /**
     * Convert to xAPI format
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * Convert to CSV format
     *
     * @returns {String}
     */
    toCSV(): string;
}
import ActorStatement from "./ActorStatement.js";
import VerbStatement from "./VerbStatement.js";
import ObjectStatement from "./ObjectStatement.js";
import ContextStatement from "./ContextStatement.js";
import ResultStatement from "./ResultStatement.js";
