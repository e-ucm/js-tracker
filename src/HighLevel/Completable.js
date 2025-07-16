import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
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
    constructor(tracker, id, type=COMPLETABLETYPE.COMPLETABLE) {
        this.CompletableId=id;
        this.Type=type;
        this.Tracker = tracker;
        this.IsInitialized=false;
    }

    /**
     * the id of the completable object
     * @Type {string}
     */
    CompletableId;

    /**
     * the Type of the completable object
     * @Type {number}
     */
    Type;

    /**
     * the Tracker of the completable object
     * @Type {xAPITrackerAsset}
     */
    Tracker;

    /**
     * the list of Types possible for the completable object
     * @Type {Array}
     */
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    /**
     * is initialized
     * @Type {boolean}
     */
    IsInitialized;

    /**
     * Initialized Time
     * @Type {Date}
     */
    InitializedTime;


    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized() {
        var addInitializedTime = true;
        if(this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("The initialized statement for the specified id has already been sent!");
            } else {
                console.warn("The initialized statement for the specified id has already been sent!");
                addInitializedTime = false;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.IsInitialized=true;
        }
        return this.Tracker.trace('initialized',this.CompletableType[this.Type],this.CompletableId);
    }

    /**
     * Send Progressed statement
     * @param {number} progress the progress of the completable object
     * @returns {StatementBuilder}
     */
    progressed(progress) {
        return this.Tracker.trace('progressed',this.CompletableType[this.Type],this.CompletableId)
            .withProgress(progress);
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the completable object
     * @param {boolean} completion the completion status of the completable object
     * @param {number} score the score of the completable object
     * @returns {StatementBuilder}
     */
    completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an Completed statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Completed statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.IsInitialized=false;

        return this.Tracker.trace('completed',this.CompletableType[this.Type],this.CompletableId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(this.initializedTime, actualDate);
    }
}

/**
 * the list of Types possible for the completable object
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