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
     * Add context extension to statement
     * @param {string} key key of the context extension
     * @param {*} value value of the context extension
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withContextExtension(key: string, value: any): StatementBuilder;
    /**
       * Add context activity to statement
       * @param {"parent"|"grouping"|"category"|"other"} type
       * @param {string} activityId
       * @param {string} activityType
       * @return {StatementBuilder} Returns the current instance for chaining
       */
    withContextActivity(type: "parent" | "grouping" | "category" | "other", activityId: string, activityType: string): StatementBuilder;
    /**
     * Add or set a verb display
     * @param {string} lang
     * @param {string} display
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withVerbDisplay(lang: string, display: string): StatementBuilder;
    /**
     * Add or set a name of the Object definition
     * @param {string} lang
     * @param {Set<string>} list list of the Object definition names
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withObjectDefinitionsName(lang: string, list: Set<string>): StatementBuilder;
    /**
     * Add or set a description of the Object definition
     * @param {string} lang
     * @param {Set<string>} list list of the Object definition descriptions
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withObjectDefinitionsDescription(lang: string, list: Set<string>): StatementBuilder;
    /**
     * Add or set a name of the Object definition
     * @param {string} lang
     * @param {string} name name of the Object definition
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withObjectDefinitionName(lang: string, name: string): StatementBuilder;
    /**
     * Add or set a description of the Object definition
     * @param {string} lang
     * @param {string} description description of the Object definition
     * @return {StatementBuilder} Returns the current instance for chaining
     * */
    withObjectDefinitionDescription(lang: string, description: string): StatementBuilder;
    /**
     * Add or set an interaction component with language support (for interaction activities)
     * @param {string} type - One of 'choices', 'scale', 'source', 'target', 'steps'
     * @param {string} id - The identifier for the component
     * @param {string} lang - The language code (e.g., 'en')
     * @param {string} description - The description in the given language
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withInteractionWithLang(type: string, id: string, lang: string, description: string): StatementBuilder;
    /**
     * Add or set an interaction type for interaction activities
     * @param {string} type interaction type to set
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withInteractionType(type: string): StatementBuilder;
    /**
     * Add or set a correct responses pattern for interaction activities
     * @param {string|string[]} pattern correct responses pattern(s) to add
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withCorrectResponsesPattern(pattern: string | string[]): StatementBuilder;
    /**
     * Sends a statement to the queue and returns a promise that resolves when the statement is processed.
     *
     * @returns {Promise} The promise sent
     */
    send(): Promise<any>;
}
import xAPITrackerAsset from "../xAPITrackerAsset.js";
import Statement from "./Statement/Statement.js";
