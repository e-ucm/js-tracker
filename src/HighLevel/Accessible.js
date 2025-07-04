export class AccessibleTracker {
    constructor(tracker, id, type) {
        if (typeof type === 'undefined') {type = 4;}
        this.accessibleId=id;
        this.type=type;
        this.tracker = tracker;
    }
    
    accessibleId;
    type;
    tracker;
    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    Accessed() {
        return this.tracker.Trace('accessed',this.AccessibleType[this.type],this.accessibleId);
    }

    Skipped() {
        return this.tracker.Trace('skipped',this.AccessibleType[this.type],this.accessibleId);
    }
}

export const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});