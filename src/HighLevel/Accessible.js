export class AccessibleTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    Accessed(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        return this.tracker.Trace('accessed',this.AccessibleType[type],accessibleId);
    }

    Skipped(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        return this.tracker.Trace('skipped',this.AccessibleType[type],accessibleId);
    }
}

export const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});