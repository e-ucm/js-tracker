/**
 * Completable Tracker
 */
export class CompletableTracker {
    /**
     * Constructor of completable Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the completable object
     * @param {string} type the Type of the completable object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type: string);
    /**
     * the id of the completable object
     * @Type {string}
     */
    CompletableId: string;
    /**
     * the Type of the completable object
     * @Type {string}
     */
    Type: string;
    /**
     * the Tracker of the completable object
     * @Type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * is initialized
     * @Type {boolean}
     */
    IsInitialized: boolean;
    /**
     * Initialized Time
     * @Type {Date}
     */
    InitializedTime: any;
    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized(): StatementBuilder;
    /**
     * Send Progressed statement
     * @param {number} progress the progress of the completable object
     * @returns {StatementBuilder}
     */
    progressed(progress: number): StatementBuilder;
    /**
     * Send Completed statement
     * @param {boolean} success the success status of the completable object
     * @param {boolean} completion the completion status of the completable object
     * @param {number} score the score of the completable object
     * @returns {StatementBuilder}
     */
    completed(success: boolean, completion: boolean, score: number): StatementBuilder;
}
import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import StatementBuilder from "../StatementBuilder/StatementBuilder.js";
