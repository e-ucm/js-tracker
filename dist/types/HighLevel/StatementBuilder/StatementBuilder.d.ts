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
     * @param {typeof ALL.RESULTEXTENSION[keyof typeof ALL.RESULTEXTENSION]|string} key key of the result extension
     * @param {*} value value of the result extension
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withResultExtension(key: (typeof ALL.RESULTEXTENSION)[keyof typeof ALL.RESULTEXTENSION] | string, value: any): StatementBuilder;
    /**
       * Add result extensions as Object key/values list of the statement
       * @param {Object} extensions extensions list
       */
    withResultExtensions(extensions?: any): this;
    /**
     * Set context language to statement
     * @param {string} language language of statement
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withContextLanguage(language: string): StatementBuilder;
    /**
     * Set context platform to statement
     * @param {string} platform platform of statement
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withContextPlatform(platform: string): StatementBuilder;
    /**
     * Add context extension to statement
     * @param {typeof ALL.CONTEXTEXTENSION[keyof typeof ALL.CONTEXTEXTENSION]|string} key key of the context extension
     * @param {*} value value of the context extension
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withContextExtension(key: (typeof ALL.CONTEXTEXTENSION)[keyof typeof ALL.CONTEXTEXTENSION] | string, value: any): StatementBuilder;
    /**
       * Add context activity to statement
       * @param {typeof STATEMENT.CONTEXT.ACTIVITIES[keyof typeof STATEMENT.CONTEXT.ACTIVITIES]} type
       * @param {string} activityId
       * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} activityType
       * @return {StatementBuilder} Returns the current instance for chaining
       */
    withContextActivity(type: (typeof STATEMENT.CONTEXT.ACTIVITIES)[keyof typeof STATEMENT.CONTEXT.ACTIVITIES], activityId: string, activityType: (typeof ALL.ACTIVITYTYPES)[keyof typeof ALL.ACTIVITYTYPES] | string): StatementBuilder;
    /**
       * Add context category to statement
       * @param {typeof ALL.CATEGORYID[keyof typeof ALL.CATEGORYID]} categoryId
       * @return {StatementBuilder} Returns the current instance for chaining
       */
    withContextCategory(categoryId: (typeof ALL.CATEGORYID)[keyof typeof ALL.CATEGORYID]): StatementBuilder;
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
     * Add object/activity extension to statement object definition
     * @param {typeof ALL.ACTIVITYEXTENSION[keyof typeof ALL.ACTIVITYEXTENSION]|string} key key of the object extension
     * @param {*} value value of the object extension
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withObjectExtension(key: (typeof ALL.ACTIVITYEXTENSION)[keyof typeof ALL.ACTIVITYEXTENSION] | string, value: any): StatementBuilder;
    /**
     * Add object/activity extensions as Object key/values list
     * @param {Object} extensions extensions list
     * @return {StatementBuilder} Returns the current instance for chaining
     */
    withObjectExtensions(extensions?: any): StatementBuilder;
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
     * Add one xAPI attachment to the statement
     * @param {AttachmentStatement|Object} attachment - Attachment instance or plain attachment object
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withAttachment(attachment: AttachmentStatement | any): StatementBuilder;
    /**
     * Add multiple xAPI attachments to the statement
     * @param {Array<AttachmentStatement|Object>} attachments - List of attachments
     * @returns {StatementBuilder} Returns the current instance for chaining
     */
    withAttachments(attachments?: Array<AttachmentStatement | any>): StatementBuilder;
    /**
     * Convert the built statement to xAPI format
     * @returns {Object} The xAPI statement object
     */
    toXAPI(): any;
    /**
     * Sends a statement to the queue and returns a promise that resolves when the statement is processed.
     *
     * @returns {Promise} The promise sent
     */
    send(): Promise<any>;
}
import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import Statement from "../Statement/Statement.js";
import { ALL } from "../Statement/Ids/Profiles/Generated/All.js";
import { STATEMENT } from "../Statement/Ids/Statements.js";
import AttachmentStatement from "../Statement/AttachementStatement.js";
