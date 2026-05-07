export default class LRSStatementBuilder extends StatementBuilder {
    /**
     * Constructor of LRSStatementBuilder
     * @param {xAPITrackerAsset} xapiClient the Tracker
     * @param {object} initial the initial statement
     */
    constructor(xapiClient: xAPITrackerAsset, initial: object);
    /**
     * Statement
     * @type {LRSStatement}
     */
    statement: LRSStatement;
    /**
     * Adds a context activity to the statement
     * @param {typeof STATEMENT.CONTEXT.ACTIVITIES[keyof typeof STATEMENT.CONTEXT.ACTIVITIES]} type - The context activity type from STATEMENT_BUILDER_IDS.CONTEXT.ACTIVITIES
     * @param {string} id - The IRI identifier of the context activity
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} activityType - The activity type IRI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withContextActivity(type: (typeof STATEMENT.CONTEXT.ACTIVITIES)[keyof typeof STATEMENT.CONTEXT.ACTIVITIES], id: string, activityType: (typeof ALL.ACTIVITYTYPES)[keyof typeof ALL.ACTIVITYTYPES] | string): LRSStatementBuilder;
    /**
     * Sets the actor using an account identifier
     * @param {string} accountName - The account name
     * @param {string} accountHomePage - The home page IRI of the account service provider
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorAccount(accountName: string, accountHomePage: string): LRSStatementBuilder;
    /**
     * Sets the actor using an mbox (mailto URI)
     * @param {string} mbox - The mailto URI of the actor (e.g. 'mailto:user@example.com')
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorMbox(mbox: string): LRSStatementBuilder;
    /**
     * Sets the actor using an mbox SHA1 hash
     * @param {string} mboxSha1 - The SHA1 hash of the actor's mbox URI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorMboxSha1(mboxSha1: string): LRSStatementBuilder;
    /**
     * Sets the actor using an OpenID URI
     * @param {string} openid - The OpenID URI of the actor
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorOpenID(openid: string): LRSStatementBuilder;
    /**
     * Sets the authority using an account identifier
     * @param {string} accountName - The account name
     * @param {string} accountHomePage - The home page IRI of the account service provider
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityAccount(accountName: string, accountHomePage: string): LRSStatementBuilder;
    /**
     * Sets the authority using an mbox (mailto URI)
     * @param {string} mbox - The mailto URI of the authority (e.g. 'mailto:lrs@example.com')
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityMbox(mbox: string): LRSStatementBuilder;
    /**
     * Sets the authority using an mbox SHA1 hash
     * @param {string} mboxSha1 - The SHA1 hash of the authority's mbox URI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityMboxSha1(mboxSha1: string): LRSStatementBuilder;
    /**
     * Sets the authority using an OpenID URI
     * @param {string} openid - The OpenID URI of the authority
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityOpenID(openid: string): LRSStatementBuilder;
    /**
     * Add or set the stored timestamp of the statement
     * @param {Date|string} stored - The stored timestamp to set (can be a Date object or an ISO 8601 string)
     * @return {LRSStatementBuilder} This builder instance for chaining
     * */
    withStored(stored: Date | string): LRSStatementBuilder;
    /**
   * Add or set an actor to the statement
   * @param {string} type - The type of the actor
   * @param {object} actor - The actor object
   * @return {StatementBuilder} Returns the current instance for chaining
   */
    withActor(type: string, actor: object): StatementBuilder;
    /**
        * Sets the ID of the statement
        * @param {string} id - The UUID to set as the statement ID
        * @returns {StatementBuilder} This builder instance for chaining
        */
    withId(id: string): StatementBuilder;
    /**
    * Sets the version of the statement
    * @param {string} version - The version to set
    * @returns {StatementBuilder} This builder instance for chaining
    */
    withVersion(version: string): StatementBuilder;
    /**
     * Sets the timestamp of the statement
     * @param {Date|string} timestamp - The timestamp to set (can be a Date object or an ISO 8601 string)
     * @returns {StatementBuilder} This builder instance for chaining
     */
    withTimestamp(timestamp: Date | string): StatementBuilder;
    /**
     * Sends the built statement to the LRS
     * @returns {Promise<void>} Promise that resolves when the statement has been sent
     */
    send(): Promise<void>;
}
import StatementBuilder from "./StatementBuilder.js";
import LRSStatement from "../Statement/LRSStatement.js";
import { STATEMENT } from "../Statement/Ids/Statements.js";
import { ALL } from "../Statement/Ids/Profiles/Generated/All.js";
import xAPITrackerAsset from "../../xAPITrackerAsset.js";
