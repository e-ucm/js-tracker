import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
/**
 * Completable Tracker
 */
export class CompletableTracker {
    /**
     * Constructor of completable tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the completable object
     * @param {number} type the type of the completable object
     */
    constructor(tracker, id, type) {
        if (typeof type === 'undefined') {type = 8;}
        this.completableId=id;
        this.type=type;
        this.tracker = tracker;
    }

    /**
     * the id of the completable object
     * @type {string}
     */
    completableId;

    /**
     * the type of the completable object
     * @type {number}
     */
    type;

    /**
     * the tracker of the completable object
     * @type {xAPITrackerAsset}
     */
    tracker;

    /**
     * the list of types possible for the completable object
     * @type {Array}
     */
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    Initialized() {
        return this.tracker.Trace('initialized',this.CompletableType[this.type],this.completableId);
    }

    /**
     * Send Progressed statement
     * @param {number} progress the progress of the completable object
     * @returns {StatementBuilder}
     */
    Progressed(progress) {
        return this.tracker.Trace('progressed',this.CompletableType[this.type],this.completableId)
            .withProgress(progress);
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the completable object
     * @param {boolean} completion the completion status of the completable object
     * @param {number} score the score of the completable object
     * @returns {StatementBuilder}
     */
    Completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('completed',this.CompletableType[this.type],this.completableId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore(score);
    }
}

/**
 * the list of types possible for the completable object
 * @type {object}
 */
export const COMPLETABLETYPE = Object.freeze({
    GAME: 0,
    SESSION: 1,
    LEVEL: 2,
    QUEST: 3,
    STAGE: 4,
    COMBAT: 5,
    STORYNODE: 6,
    RACE: 7,
    COMPLETABLE: 8
});