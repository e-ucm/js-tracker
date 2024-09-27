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

    Selected(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}

        this.tracker.setResponse(optionId);
        return this.tracker.Trace('selected',this.AlternativeType.properties[type],alternativeId);
    };

    Unlocked(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}

        this.tracker.setResponse(optionId);
        return this.tracker.Trace('unlocked',this.AlternativeType.properties[type],alternativeId);
    };
}
module.exports = Alternative;