export class AccessibleTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker: xAPITrackerAsset);
    /**
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    AccessibleType: string[];
    /**
     * @param {string} accessibleId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Accessed(accessibleId: string, type: number): Statement;
    /**
     * @param {string} accessibleId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Skipped(accessibleId: string, type: number): Statement;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const ACCESSIBLETYPE: Readonly<{
    SCREEN: 0;
    AREA: 1;
    ZONE: 2;
    CUTSCENE: 3;
    ACCESSIBLE: 4;
}>;
import xAPITrackerAsset = require("../xAPITrackerAsset.js");
import Statement = require("./Statement/Statement.js");
