class Alternative {
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

    async Selected(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('selected',this.AlternativeType.properties[type],alternativeId);
        statement.setResponse(optionId);
        await this.tracker.enqueue(statement.toXAPI());
        return statement;
    };

    async Unlocked(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('unlocked',this.AlternativeType.properties[type],alternativeId);
        statement.setResponse(optionId);
        await this.tracker.enqueue(statement.toXAPI());
        return statement;
    };
}
module.exports = Alternative;