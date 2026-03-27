/**
 * Statement Builder Class
 */
export default class StatementBuilder {
    /**
     * @param  {xAPITrackerAsset} xapiClient  any client that has a `.sendStatement(statement)` → Promise
     * @param  {Statement} initial     a partial Statement (actor, verb, object…)
     */
    constructor(xapiClient: xAPITrackerAsset, initial: Statement);
    /**
     * XAPI Client
     * @type {xAPITrackerAsset}
     */
    client: xAPITrackerAsset;
    /**
     * Statement
     * @type {Statement}
     */
    statement: Statement;
    /**
     * Promise of Statement sent
     * @type {Promise<void>}
     */
    _sendPromise: Promise<void>;
    /**
     * Set success to statemement
     * @param {boolean} success
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withSuccess(success: boolean): StatementBuilder;
    /**
     * Sets score-related properties to statemement
     * @param {Partial<{raw: number; min: number; max: number; scaled: number}>} score - Score configuration
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withScore(score: Partial<{
        raw: number;
        min: number;
        max: number;
        scaled: number;
    }>): StatementBuilder;
    /**
     * Set raw score to statemement
     * @param {number} raw the raw score value
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withScoreRaw(raw: number): StatementBuilder;
    /**
     * Set min score to statemement
     * @param {number} min the min score value
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withScoreMin(min: number): StatementBuilder;
    /**
     * Set max score to statemement
     * @param {number} max the max score value
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withScoreMax(max: number): StatementBuilder;
    /**
     * Set scaled score to statemement
     * @param {number} scaled the scaled score value
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withScoreScaled(scaled: number): StatementBuilder;
    /**
     * Set completion status to statement
     * @param {boolean} value completion status of statement
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withCompletion(value: boolean): StatementBuilder;
    /**
     * Set duration to statement
     * @param {Date} init init date of statement
     * @param {Date} end end date of statement
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withDuration(init: Date, end: Date): StatementBuilder;
    /**
     * Set response to statement
     * @param {string} value response of statement
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withResponse(value: string): StatementBuilder;
    /**
     * Set progress to statement
     * @param {number} value progress of statement
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withProgress(value: number): StatementBuilder;
    /**
     * Add result extension to statement
     * @param {string} key key of the result extension
     * @param {*} value value of the result extension
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withResultExtension(key: string, value: any): StatementBuilder;
    /**
       * Add result extensions as Object key/values list of the statement
       * @param {Object} extensions extensions list
       */
    withResultExtensions(extensions?: any): this;
    /**
     * let me run any function on the statement
     * fn can either mutate `stmt` in‐place, or return a brand new statement
     * Applies a function to the statement
     * @param {(statement: Statement) => Statement} fn - Function to apply to statement
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    apply(fn: (statement: Statement) => Statement): StatementBuilder;
    /**
     * Sends a statement to the queue and returns a promise that resolves when the statement is processed.
     *
     * @returns {Promise} The promise sent
     */
    send(): Promise<any>;
}
import xAPITrackerAsset from "../xAPITrackerAsset.js";
import Statement from "./Statement/Statement.js";
