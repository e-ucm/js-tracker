import Statement from "./Statement/Statement.js";

export class AlternativeTracker {
    constructor(tracker, id, type) {
        if (typeof type === 'undefined') {type = 5;}
        this.alternativeId=id;
        this.type=type;
        this.tracker = tracker;
    }
    
    tracker;
    alternativeId;
    type;

    AlternativeType = ['question', 'menu', 'dialog', 'path', 'arena', 'alternative'];

    Selected(optionId) {
        if (typeof type === 'undefined') {type = 5;}
        
        return this.tracker.Trace('selected',this.AlternativeType[this.type],this.alternativeId)
            .withResponse(optionId);
    }

    Unlocked(optionId) {
        if (typeof type === 'undefined') {type = 5;}
        
        return this.tracker.Trace('unlocked',this.AlternativeType[this.type],this.alternativeId)
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