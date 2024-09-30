import Statement from "./Statement/Statement.js";

export default class Completable {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    CompletableType = {
        Game: 0,
        Session: 1,
        Level: 2,
        Quest: 3,
        Stage: 4,
        Combat: 5,
        StoryNode: 6,
        Race: 7,
        Completable: 8,
        properties: ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable']
    };

    Initialized(completableId, type) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('initialized',this.CompletableType.properties[type],completableId);
        return statement;
    };

    Progressed(completableId, type, progress) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('progressed',this.CompletableType.properties[type],completableId);
        statement.setProgress(progress);
        return statement;
    };

    Completed(completableId, type, success, score) {
        if (typeof type === 'undefined') {type = 8;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('completed',this.CompletableType.properties[type],completableId);
        statement.setSuccess(success);
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