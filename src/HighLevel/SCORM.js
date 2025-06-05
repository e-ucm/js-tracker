import Statement from "./Statement/Statement.js";

export class ScormTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];

    Initialized(scoId) {
        var statement = this.tracker.Trace('initialized', 'SCO', scoId);
        return statement;
    };

    Suspended(scoId) {
        var statement = this.tracker.Trace('suspended', 'SCO', scoId);
        return statement;
    };

    Resumed(scoId) {
        var statement = this.tracker.Trace('resumed', 'SCO', scoId);
        return statement;
    };

    Terminated(scoId) {
        var statement = this.tracker.Trace('terminated', 'SCO', scoId);
        return statement;
    };

    Passed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        var statement = this.tracker.Trace('passed',this.ScormType[type],activityId);
        return statement;
    };

    Failed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        var statement = this.tracker.Trace('failed',this.ScormType[type],activityId);
        return statement;
    };

    Scored(activityId, type, score) {
        if (typeof type === 'undefined') {type = 0;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('scored',this.ScormType[type],activityId);
        statement.setScore(score);
        return statement;
    };

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
    };
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

export const SCORMTYPE = Object.freeze({
    SCO: 0,
    COURSE: 1,
    MODULE: 2,
    ASSESSMENT: 3,
    INTERACTION: 4,
    OBJECTIVE: 5,
    ATTEMPT: 6
});