/**
* Statement class
*/
export default class LRSStatement extends Statement {
    /**
     * Create a Statement from an xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI default URI for the statement construction (optional)
     * @returns {LRSStatement} A new LRSStatement instance created from the xAPI object
     */
    static fromXAPI(xapiObj: any, baseURI: string): LRSStatement;
    /**
     * @param {ActorStatement} authority
     **/
    authority: ActorStatement;
    /**
     * @param {Date} stored
     */
    stored: Date;
}
import Statement from "./Statement.js";
import ActorStatement from "./ActorStatement.js";
