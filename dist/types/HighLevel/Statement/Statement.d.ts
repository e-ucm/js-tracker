/**
* Statement class
*/
export default class Statement {
    /**
     * Create a Statement from a plain object (copy-constructor)
     * @param {Object} statementObj
     * @returns {Statement}
     */
    static fromObject(statementObj: any): Statement;
    /**
     * Create a Statement from an xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI default URI for the statement construction (optional)
     * @returns {Statement}
     */
    static fromXAPI(xapiObj: any, baseURI: string): Statement;
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {typeof ALL.VERBS[keyof typeof ALL.VERBS]|string} verbId verb id of the statement
     * @param {string} objectId object id of the statement
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor: ActorStatement, verbId: (typeof ALL.VERBS)[keyof typeof ALL.VERBS] | string, objectId: string, objectType: (typeof ALL.ACTIVITYTYPES)[keyof typeof ALL.ACTIVITYTYPES] | string, context: ContextStatement, defaultURI: string);
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
     * Attachments associated with the statement
     * @type {AttachmentStatement[]}
     */
    attachments: AttachmentStatement[];
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
import AttachmentStatement from "./AttachementStatement.js";
import { ALL } from "./Ids/Profiles/Generated/index.js";
