import Statement from "./Statement/Statement.js";

export class ScormTracker {
    constructor(tracker, id, type) {
        if (typeof type === 'undefined') {type = 0;}
        this.scormId=id;
        this.type=type;
        this.tracker = tracker;
    }
    
    tracker;
    scormId;
    type;
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];

    Initialized() {
        if(this.type != 0) {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.tracker.Trace('initialized', this.ScormType[this.type], this.scormId);
    }

    Suspended() {
        if(this.type != 0) {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.tracker.Trace('suspended', this.ScormType[this.type], this.scormId);
    }

    Resumed() {
        if(this.type != 0) {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.tracker.Trace('resumed', this.ScormType[this.type], this.scormId);
    }

    Terminated() {
        if(this.type != 0) {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.tracker.Trace('terminated', this.ScormType[this.type], this.scormId);
    }

    Passed() {
        return this.tracker.Trace('passed',this.ScormType[this.type], this.scormId);
    }

    Failed() {
        return this.tracker.Trace('failed',this.ScormType[this.type], this.scormId);
    }

    Scored(score) {
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('scored',this.ScormType[this.type], this.scormId)
            .withScore(score);
    }

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

export const SCORMTYPE = Object.freeze({
    SCO: 0,
    COURSE: 1,
    MODULE: 2,
    ASSESSMENT: 3,
    INTERACTION: 4,
    OBJECTIVE: 5,
    ATTEMPT: 6
});