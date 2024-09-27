class Completable {
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

        return this.tracker.Trace('initialized',this.CompletableType.properties[type],completableId);
    };

    Progressed(completableId, type, progress) {
        if (typeof type === 'undefined') {type = 8;}

        //this.tracker.setProgress(progress);
        return this.tracker.Trace('progressed',this.CompletableType.properties[type],completableId);
    };

    Completed(completableId, type, success, score) {
        if (typeof type === 'undefined') {type = 8;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof score === 'undefined') {score = 1;}

        //this.tracker.setSuccess(success);
        //this.tracker.setScore(score);
        return this.tracker.Trace('completed',this.CompletableType.properties[type],completableId);
    };
}

module.exports = Completable;