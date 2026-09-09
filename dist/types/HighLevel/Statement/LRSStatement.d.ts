/**
* Statement class
*/
export default class LRSStatement extends Statement {
    /**
     * Create a Statement from an xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI default URI for the statement construction (optional)
     * @param {string} platform platform for the statement construction (optional)
     * @returns {LRSStatement} A new LRSStatement instance created from the xAPI object
     */
    static fromXAPI(xapiObj: any, baseURI: string, platform?: string): LRSStatement;
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {typeof ALL.VERBS[keyof typeof ALL.VERBS]} verbId verb id of the statement
     * @param {string} objectId object id of the statement
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor: ActorStatement, verbId: (typeof ALL.VERBS)[keyof typeof ALL.VERBS], objectId: string, objectType: (typeof ALL.ACTIVITYTYPES)[keyof typeof ALL.ACTIVITYTYPES] | string, context: ContextStatement, defaultURI: string);
    /**
     * @param {ActorStatement} authority
     **/
    authority: ActorStatement;
    /**
     * @param {string} stored
     */
    stored: string;
}
import Statement from "./Statement.js";
import ActorStatement from "./ActorStatement.js";
import { ALL } from "./Ids/Profiles/Generated/index.js";
import ContextStatement from "./ContextStatement.js";
