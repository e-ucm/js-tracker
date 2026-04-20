/**
 * Scorm Tracker
 */
export class ScormTracker {
    /**
     * Constructor of Scorm Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the Scorm object
     * @param {string} type the type of the Scorm object
     * @param {ContextStatement} context the context statement of the Scorm object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: string, context?: ContextStatement);
    /**
     * the id of the Scorm object
     * @type {string}
     */
    ScormId: string;
    /**
     * the type of the Scorm object
     * @type {string}
     */
    Type: string;
    /**
     * the Tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    Context: ContextStatement;
    /**
     * is initialized
     * @type {boolean}
     */
    IsInitialized: boolean;
    /**
     * the list of types possible for the Scorm object
     * @type {Map<string, string>}
     */
    ScormType: Map<string, string>;
    /**
     * Initialized Time
     * @type {Date}
     */
    InitializedTime: Date;
    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized(): StatementBuilder;
    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    suspended(): StatementBuilder;
    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    resumed(): StatementBuilder;
    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    terminated(): StatementBuilder;
    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    passed(): StatementBuilder;
    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    failed(): StatementBuilder;
    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    scored(score: number): StatementBuilder;
    /**
     * Send Completed statement
     * @param {boolean} success the success status of the Scorm object
     * @param {boolean} completion the completion status of the Scorm object
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    completed(success: boolean, completion: boolean, score: number): StatementBuilder;
}
import xAPITrackerAsset from "../xAPITrackerAsset.js";
import ContextStatement from "./Statement/ContextStatement.js";
import StatementBuilder from "./StatementBuilder.js";
