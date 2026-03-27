/**
 * Completable Tracker
 */
export class CompletableTracker {
    /**
     * Constructor of completable Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the completable object
     * @param {number} type the Type of the completable object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the completable object
     * @Type {string}
     */
    CompletableId: string;
    /**
     * the Type of the completable object
     * @Type {number}
     */
    Type: number;
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
     * the list of Types possible for the completable object
     * @Type {Array}
     */
    CompletableType: string[];
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
    initializedTime: Date;
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
/**
 * the list of Types possible for the completable object
 */
export const COMPLETABLETYPE: Readonly<{
    GAME: 0;
    SESSION: 1;
    LEVEL: 2;
    QUEST: 3;
    STAGE: 4;
    COMBAT: 5;
    STORYNODE: 6;
    RACE: 7;
    COMPLETABLE: 8;
}>;
import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
