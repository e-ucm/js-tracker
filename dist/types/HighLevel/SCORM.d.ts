/**
 * Scorm Tracker
 */
export class ScormTracker {
    /**
     * Constructor of Scorm Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the Scorm object
     * @param {number} type the type of the Scorm object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the Scorm object
     * @type {string}
     */
    ScormId: string;
    /**
     * the type of the Scorm object
     * @type {number}
     */
    Type: number;
    /**
     * the Tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * is initialized
     * @type {boolean}
     */
    IsInitialized: boolean;
    /**
     * the list of types possible for the Scorm object
     * @type {Array}
     */
    ScormType: any[];
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
/**
 * the list of types possible for the scorm object
 */
export const SCORMTYPE: Readonly<{
    SCO: 0;
    COURSE: 1;
    MODULE: 2;
    ASSESSMENT: 3;
    INTERACTION: 4;
    OBJECTIVE: 5;
    ATTEMPT: 6;
}>;
import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
