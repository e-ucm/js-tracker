import Statement from "./Statement/Statement.js";

export default class Accessible {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    AccessibleType = {
        Screen: 0,
        Area: 1,
        Zone: 2,
        Cutscene: 3,
        Accessible: 4,
        properties: ['screen', 'area', 'zone', 'cutscene', 'accessible']
    };

    Accessed(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('accessed',this.AccessibleType.properties[type],accessibleId);
        return statement;
    };

    Skipped(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('skipped',this.AccessibleType.properties[type],accessibleId);
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