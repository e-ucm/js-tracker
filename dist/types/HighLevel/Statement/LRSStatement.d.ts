/**
* Statement class
*/
export default class LRSStatement extends Statement {
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
