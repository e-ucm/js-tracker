export class AccessibleTracker {
    constructor(tracker: any);
    tracker: any;
    AccessibleType: string[];
    Accessed(accessibleId: any, type: any): any;
    Skipped(accessibleId: any, type: any): any;
    enqueue(statement: any): Promise<void>;
}
export const ACCESSIBLETYPE: Readonly<{
    SCREEN: 0;
    AREA: 1;
    ZONE: 2;
    CUTSCENE: 3;
    ACCESSIBLE: 4;
}>;
