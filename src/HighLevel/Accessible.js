export class AccessibleTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    Accessed(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('accessed',this.AccessibleType[type],accessibleId);
        return statement;
    };

    Skipped(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('skipped',this.AccessibleType[type],accessibleId);
        return statement;
    };

    async sendStatement(statement) {
        await this.tracker.enqueue(statement.toXAPI());
    }
}

export const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});