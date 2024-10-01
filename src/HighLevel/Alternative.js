import Statement from "./Statement/Statement.js";

export class AlternativeTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    AlternativeType = ['question', 'menu', 'dialog', 'path', 'arena', 'alternative']

    Selected(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('selected',this.AlternativeType[type],alternativeId);
        statement.setResponse(optionId);
        return statement;
    };

    Unlocked(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('unlocked',this.AlternativeType[type],alternativeId);
        statement.setResponse(optionId);
        return statement;
    };

    /**
     * @param {Statement} statement
     * 
     */
    async sendStatement(statement) {
        await this.tracker.enqueue(statement.toXAPI());
    }
}

export const ALTERNATIVETYPE = Object.freeze({
    QUESTION: 0,
    MENU: 1,
    DIALOG: 2,
    PATH: 3,
    ARENA: 4,
    ALTERNATIVE: 5
});