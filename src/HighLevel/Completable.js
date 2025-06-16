const xAPITrackerAsset = require("../xAPITrackerAsset.js");
const Statement = require("./Statement/Statement.js");

class CompletableTracker {
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
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    /**
     * @param {string} completableId
     * @param {number} type
     * @returns {Statement}
     * 
     */
    Initialized(completableId, type) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('initialized',this.CompletableType[type],completableId);
        return statement;
    }

    /**
     * @param {string} completableId
     * @param {number} type
     * @param {number} progress 
     * @returns {Statement}
     * 
     */
    Progressed(completableId, type, progress) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('progressed',this.CompletableType[type],completableId);
        statement.setProgress(progress);
        return statement;
    }

    /**
     * @param {string} completableId
     * @param {number} type
     * @param {boolean} success
     * @param {boolean} completion
     * @param {number} score
     * @returns {Statement}
     * 
     */
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
    }
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const COMPLETABLETYPE = Object.freeze({
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

module.exports = { CompletableTracker, COMPLETABLETYPE };