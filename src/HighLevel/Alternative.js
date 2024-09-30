import Statement from "./Statement/Statement.js";

export default class Alternative {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    AlternativeType = {
        Question: 0,
        Menu: 1,
        Dialog: 2,
        Path: 3,
        Arena: 4,
        Alternative: 5,
        properties: ['question', 'menu', 'dialog', 'path', 'arena', 'alternative']
    };

    Selected(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('selected',this.AlternativeType.properties[type],alternativeId);
        statement.setResponse(optionId);
        return statement;
    };

    Unlocked(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('unlocked',this.AlternativeType.properties[type],alternativeId);
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