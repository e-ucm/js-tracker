import Statement from "./Statement/Statement.js";

export class CompletableTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    Initialized(completableId, type) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('initialized',this.CompletableType[type],completableId);
        return statement;
    };

    Progressed(completableId, type, progress) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('progressed',this.CompletableType[type],completableId);
        statement.setProgress(progress);
        return statement;
    };

    Completed(completableId, type, success, completion, score) {
        if (typeof type === 'undefined') {type = 8;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('completed',this.CompletableType[type],completableId);
        statement.setSuccess(success);
        statement.setCompletion(completion);
        statement.setScore(score);
        return statement;
    };
    
    /**
     * @param {Statement} statement
     * 
     */
    async sendStatement(statement) {
        var xapiStatement=statement.toXAPI();
        await this.tracker.enqueue(xapiStatement);
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