import Statement from "./Statement/Statement.js";

export class CompletableTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    Initialized(completableId, type) {
        if (typeof type === 'undefined') {type = 8;}

        return this.tracker.Trace('initialized',this.CompletableType[type],completableId);
    }

    Progressed(completableId, type, progress) {
        if (typeof type === 'undefined') {type = 8;}

        return this.tracker.Trace('progressed',this.CompletableType[type],completableId)
            .withProgress(progress);
    }

    Completed(completableId, type, success, completion, score) {
        if (typeof type === 'undefined') {type = 8;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('completed',this.CompletableType[type],completableId)
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