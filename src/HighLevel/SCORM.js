import xAPITrackerAsset from "../xAPITrackerAsset.js";
import ContextStatement from "./Statement/ContextStatement.js";
import StatementBuilder from "./StatementBuilder.js";
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
    constructor(tracker, id, type="SCO", context = tracker.context) {
        this.ScormId=id;
        this.Type=type;
        this.Tracker = tracker;
        this.Context = context;
        this.IsInitialized=false;
    }
    /**
     * the id of the Scorm object
     * @type {string}
     */
    ScormId;
    /**
     * the type of the Scorm object
     * @type {string}
     */
    Type;
    /**
     * the Tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    Tracker;
    /**
     * the list of types possible for the Scorm object
     * @type {Map<string, string>}
     */
    ScormType = new Map([
        ["SCO", 'http://adlnet.gov/expapi/activities/lesson'],
        ["course", 'http://adlnet.gov/expapi/activities/course'],
        ["module", 'http://adlnet.gov/expapi/activities/module'],
        ["assessment", 'http://adlnet.gov/expapi/activities/assessment'],
        ["interaction", 'http://adlnet.gov/expapi/activities/interaction'],
        ["cmi_interaction", "http://adlnet.gov/expapi/activities/cmi.interaction"],
        ["objective", 'http://adlnet.gov/expapi/activities/objective'],
        ["attempt", 'http://adlnet.gov/expapi/activities/attempt'],
        ["profile", 'http://adlnet.gov/expapi/activities/profile']
    ]);

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
        if(this.Type != "SCO") {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.Tracker.trace('initialized', this.ScormType.get(this.Type), this.ScormId, this.Context);
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
        if(this.Type != "SCO") {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.Tracker.trace('suspended', this.ScormType.get(this.Type), this.ScormId, this.Context)
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
        if(this.Type != "SCO") {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.Tracker.trace('resumed', this.ScormType.get(this.Type), this.ScormId, this.Context);
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
        if(this.Type != "SCO") {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.Tracker.trace('terminated', this.ScormType.get(this.Type), this.ScormId, this.Context)
                    .withDuration(this.InitializedTime, actualDate);
    }

    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    passed() {
        return this.Tracker.trace('passed',this.ScormType.get(this.Type), this.ScormId, this.Context);
    }

    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    failed() {
        return this.Tracker.trace('failed',this.ScormType.get(this.Type), this.ScormId, this.Context);
    }

    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    scored(score) {
        if (typeof score === 'undefined') {score = 1;}

        return this.Tracker.trace('scored',this.ScormType.get(this.Type), this.ScormId, this.Context)
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
        return this.Tracker.trace('completed',this.ScormType.get(this.Type), this.ScormId, this.Context)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(this.InitializedTime, actualDate);
    }
}