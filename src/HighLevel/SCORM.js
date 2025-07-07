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
    constructor(tracker, id, type=SCORMTYPE.SCO) {
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
     * is initialized
     * @type {boolean}
     */
    initialized=false;

    /**
     * Initialized Time
     * @type {Date}
     */
    initializedTime;

    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    Initialized() {
        var addInitializedTime = true;
        if(this.initialized) {
            if (this.tracker.debug) {
                throw new Error("The initialized statement for the specified id has already been sent!");
            } else {
                console.warn("The initialized statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.initialized=true;
        }
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.tracker.Trace('initialized', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    Suspended() {
        if(!this.initialized) {
            if (this.tracker.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.initialized=false;
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.tracker.Trace('suspended', this.ScormType[this.type], this.scormId)
                .withDuration(this.initializedTime, actualDate);
    }

    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    Resumed() {
        var addInitializedTime = true;
        if(this.initialized) {
            if (this.tracker.debug) {
                throw new Error("The Resumed statement for the specified id has already been sent!");
            } else {
                console.warn("The Resumed statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.initialized=true;
        }
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.tracker.Trace('resumed', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    Terminated() {
        if(!this.initialized) {
            if (this.tracker.debug) {
                throw new Error("You need to send a initialized statement before sending an Terminated statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Terminated statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.initialized=false;
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.tracker.Trace('terminated', this.ScormType[this.type], this.scormId)
                    .withDuration(this.initializedTime, actualDate);
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
            .withScore({raw:score});
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

        if(!this.initialized) {
            if (this.tracker.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        return this.tracker.Trace('completed',this.ScormType[this.type], this.scormId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(this.initializedTime, actualDate);
    }
}

/**
 * the list of types possible for the scorm object
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