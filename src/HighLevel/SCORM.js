import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
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
    constructor(tracker, id, type=SCORMTYPE.SCO) {
        this.ScormId=id;
        this.Type=type;
        this.Tracker = tracker;
        this.IsInitialized=false;
    }
    /**
     * the id of the Scorm object
     * @type {string}
     */
    ScormId;
    /**
     * the type of the Scorm object
     * @type {number}
     */
    Type;
    /**
     * the Tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    Tracker;
    /**
     * the list of types possible for the Scorm object
     * @type {Array}
     */
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];

    /**
     * is initialized
     * @type {boolean}
     */
    IsInitialized;

    /**
     * Initialized Time
     * @type {Date}
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
                return;
            }
        }
        if (addInitializedTime) {
            this.InitializedTime = new Date();
            this.IsInitialized=true;
        }
        if(this.Type != SCORMTYPE.SCO) {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.Tracker.trace('initialized', this.ScormType[this.Type], this.ScormId);
    }

    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    suspended() {
        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.IsInitialized=false;
        if(this.Type != SCORMTYPE.SCO) {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.Tracker.trace('suspended', this.ScormType[this.Type], this.ScormId)
                .withDuration(this.InitializedTime, actualDate);
    }

    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    resumed() {
        var addInitializedTime = true;
        if(this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("The Resumed statement for the specified id has already been sent!");
            } else {
                console.warn("The Resumed statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.InitializedTime = new Date();
            this.IsInitialized=true;
        }
        if(this.Type != SCORMTYPE.SCO) {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.Tracker.trace('resumed', this.ScormType[this.Type], this.ScormId);
    }

    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    terminated() {
        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an Terminated statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Terminated statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.IsInitialized=false;
        if(this.Type != SCORMTYPE.SCO) {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.Tracker.trace('terminated', this.ScormType[this.Type], this.ScormId)
                    .withDuration(this.InitializedTime, actualDate);
    }

    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    passed() {
        return this.Tracker.trace('passed',this.ScormType[this.Type], this.ScormId);
    }

    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    failed() {
        return this.Tracker.trace('failed',this.ScormType[this.Type], this.ScormId);
    }

    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    scored(score) {
        if (typeof score === 'undefined') {score = 1;}

        return this.Tracker.trace('scored',this.ScormType[this.Type], this.ScormId)
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

        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        return this.Tracker.trace('completed',this.ScormType[this.Type], this.ScormId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(this.InitializedTime, actualDate);
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