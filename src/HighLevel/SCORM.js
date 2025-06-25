import Statement from "./Statement/Statement.js";

export class ScormTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];

    Initialized(scoId) {
        return this.tracker.Trace('initialized', 'SCO', scoId);
    }

    Suspended(scoId) {
        return this.tracker.Trace('suspended', 'SCO', scoId);
    }

    Resumed(scoId) {
        return this.tracker.Trace('resumed', 'SCO', scoId);
    }

    Terminated(scoId) {
        return this.tracker.Trace('terminated', 'SCO', scoId);
    }

    Passed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        return this.tracker.Trace('passed',this.ScormType[type],activityId);
    }

    Failed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        return this.tracker.Trace('failed',this.ScormType[type],activityId);
    }

    Scored(activityId, type, score) {
        if (typeof type === 'undefined') {type = 0;}
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('scored',this.ScormType[type],activityId)
            .withScore(score);
    }

    Completed(activityId, type, success, completion, score) {
        if (typeof type === 'undefined') {type = 0;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('completed',this.ScormType[type],activityId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore(score);
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