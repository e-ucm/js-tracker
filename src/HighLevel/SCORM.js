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
    isInitialized=false;

    /**
     * Initialized Time
     * @type {Date}
     */
    initializedTime;

    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized() {
        var addInitializedTime = true;
        if(this.isInitialized) {
            if (this.tracker.settings.debug) {
                throw new Error("The initialized statement for the specified id has already been sent!");
            } else {
                console.warn("The initialized statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.isInitialized=true;
        }
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.tracker.trace('initialized', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    suspended() {
        if(!this.isInitialized) {
            if (this.tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.isInitialized=false;
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.tracker.trace('suspended', this.ScormType[this.type], this.scormId)
                .withDuration(this.initializedTime, actualDate);
    }

    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    resumed() {
        var addInitializedTime = true;
        if(this.isInitialized) {
            if (this.tracker.settings.debug) {
                throw new Error("The Resumed statement for the specified id has already been sent!");
            } else {
                console.warn("The Resumed statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.isInitialized=true;
        }
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.tracker.trace('resumed', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    terminated() {
        if(!this.isInitialized) {
            if (this.tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an Terminated statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Terminated statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.isInitialized=false;
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.tracker.trace('terminated', this.ScormType[this.type], this.scormId)
                    .withDuration(this.initializedTime, actualDate);
    }

    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    passed() {
        return this.tracker.trace('passed',this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    failed() {
        return this.tracker.trace('failed',this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    scored(score) {
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.trace('scored',this.ScormType[this.type], this.scormId)
            .withScore({raw:score});
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the Scorm object
     * @param {boolean} completion the completion status of the Scorm object
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        if(!this.isInitialized) {
            if (this.tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        return this.tracker.trace('completed',this.ScormType[this.type], this.scormId)
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