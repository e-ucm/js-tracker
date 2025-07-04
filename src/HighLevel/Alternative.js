import Statement from "./Statement/Statement.js";

export class AlternativeTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    AlternativeType = ['question', 'menu', 'dialog', 'path', 'arena', 'alternative']

    Selected(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        return this.tracker.Trace('selected',this.AlternativeType[type],alternativeId)
            .withResponse(optionId);
    }

    Unlocked(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        return this.tracker.Trace('unlocked',this.AlternativeType[type],alternativeId)
                .withResponse(optionId);
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