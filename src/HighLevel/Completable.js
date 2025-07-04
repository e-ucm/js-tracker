import Statement from "./Statement/Statement.js";

export class CompletableTracker {
    constructor(tracker, id, type) {
        if (typeof type === 'undefined') {type = 8;}
        this.completableId=id;
        this.type=type;
        this.tracker = tracker;
    }
    
    tracker;
    completableId;
    type;
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    Initialized() {
        return this.tracker.Trace('initialized',this.CompletableType[this.type],this.completableId);
    }

    Progressed(progress) {
        return this.tracker.Trace('progressed',this.CompletableType[this.type],this.completableId)
            .withProgress(progress);
    }

    Completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('completed',this.CompletableType[this.type],this.completableId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore(score);
    }
}

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