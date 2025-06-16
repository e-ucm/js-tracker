const xAPITrackerAsset = require("../xAPITrackerAsset.js");
const Statement = require("./Statement/Statement.js");

class ScormTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    /**
     * @type {xAPITrackerAsset}
     */
    tracker;
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];
    
    /**
     * @param {string} scoId
     * @returns {Statement}
     * 
     */
    Initialized(scoId) {
        var statement = this.tracker.Trace('initialized', 'SCO', scoId);
        return statement;
    }

    
    /**
     * @param {string} scoId
     * @returns {Statement}
     * 
     */
    Suspended(scoId) {
        var statement = this.tracker.Trace('suspended', 'SCO', scoId);
        return statement;
    }

    
    /**
     * @param {string} scoId
     * @returns {Statement}
     * 
     */
    Resumed(scoId) {
        var statement = this.tracker.Trace('resumed', 'SCO', scoId);
        return statement;
    }

    
    /**
     * @param {string} scoId
     * @returns {Statement}
     * 
     */
    Terminated(scoId) {
        var statement = this.tracker.Trace('terminated', 'SCO', scoId);
        return statement;
    }

    
    /**
     * @param {string} activityId
     * @param {number} type
     * @returns {Statement}
     * 
     */
    Passed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        var statement = this.tracker.Trace('passed',this.ScormType[type],activityId);
        return statement;
    }

    /**
     * @param {string} activityId
     * @param {number} type
     * @returns {Statement}
     * 
     */
    Failed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        var statement = this.tracker.Trace('failed',this.ScormType[type],activityId);
        return statement;
    }

    /**
     * @param {string} activityId
     * @param {number} type
     * @param {number} score
     * @returns {Statement}
     * 
     */
    Scored(activityId, type, score) {
        if (typeof type === 'undefined') {type = 0;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('scored',this.ScormType[type],activityId);
        statement.setScore(score);
        return statement;
    }

    /**
     * @param {string} activityId
     * @param {number} type
     * @param {boolean} success
     * @param {boolean} completion
     * @param {number} score
     * @returns {Statement}
     * 
     */
    Completed(activityId, type, success, completion, score) {
        if (typeof type === 'undefined') {type = 0;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('completed',this.ScormType[type],activityId);
        statement.setSuccess(success);
        statement.setCompletion(completion);
        statement.setScore(score);
        return statement;
    }
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const SCORMTYPE = Object.freeze({
    SCO: 0,
    COURSE: 1,
    MODULE: 2,
    ASSESSMENT: 3,
    INTERACTION: 4,
    OBJECTIVE: 5,
    ATTEMPT: 6
});

module.exports = { ScormTracker, SCORMTYPE };