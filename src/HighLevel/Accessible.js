import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
/**
 * Accessible Tracker
 */
export class AccessibleTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {number} type the type of the accessible object
     */
    constructor(tracker, id, type=ACCESSIBLETYPE.ACCESSIBLE) {
        this.AccessibleId=id;
        this.Type=type;
        this.Tracker = tracker;
    }
    /**
     * the id of the accessible object
     * @type {string}
     */
    AccessibleId;
    /**
     * the type of the accessible object
     * @type {number}
     */
    Type;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    Tracker;
    /**
     * the list of types possible for the accessible object
     * @type {Array}
     */
    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    accessed() {
        return this.Tracker.trace('accessed',this.AccessibleType[this.Type],this.AccessibleId);
    }

    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    skipped() {
        return this.Tracker.trace('skipped',this.AccessibleType[this.Type],this.AccessibleId);
    }
}

/**
 * the list of types possible for the accessible object
 */
export const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});