import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
/**
 * Scorm Tracker
 */
export class ScormTracker {
    /**
     * Constructor of Scorm tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Scorm object
     * @param {number} type the type of the Scorm object
     */
    constructor(tracker, id, type) {
        if (typeof type === 'undefined') {type = 0;}
        this.scormId=id;
        this.type=type;
        this.tracker = tracker;
    }
    /**
     * the id of the Scorm object
     * @type {string}
     */
    accessibleId;
    /**
     * the type of the Scorm object
     * @type {number}
     */
    type;
    /**
     * the tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the Scorm object
     * @type {Array}
     */
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];

    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    Initialized() {
        if(this.type != 0) {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.tracker.Trace('initialized', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    Suspended() {
        if(this.type != 0) {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.tracker.Trace('suspended', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    Resumed() {
        if(this.type != 0) {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.tracker.Trace('resumed', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    Terminated() {
        if(this.type != 0) {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.tracker.Trace('terminated', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    Passed() {
        return this.tracker.Trace('passed',this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    Failed() {
        return this.tracker.Trace('failed',this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    Scored(score) {
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('scored',this.ScormType[this.type], this.scormId)
            .withScore(score);
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the Scorm object
     * @param {boolean} completion the completion status of the Scorm object
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    Completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('completed',this.ScormType[this.type], this.scormId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore(score);
    }
}

/**
 * the list of types possible for the scorm object
 * @type {object}
 */
export const SCORMTYPE = Object.freeze({
    SCO: 0,
    COURSE: 1,
    MODULE: 2,
    ASSESSMENT: 3,
    INTERACTION: 4,
    OBJECTIVE: 5,
    ATTEMPT: 6
});