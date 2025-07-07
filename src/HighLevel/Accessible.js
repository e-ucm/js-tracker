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
    constructor(tracker, id, type=4) {
        this.accessibleId=id;
        this.type=type;
        this.tracker = tracker;
    }
    /**
     * the id of the accessible object
     * @type {string}
     */
    accessibleId;
    /**
     * the type of the accessible object
     * @type {number}
     */
    type;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the accessible object
     * @type {Array}
     */
    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    Accessed() {
        return this.tracker.Trace('accessed',this.AccessibleType[this.type],this.accessibleId);
    }

    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    Skipped() {
        return this.tracker.Trace('skipped',this.AccessibleType[this.type],this.accessibleId);
    }
}

/**
 * the list of types possible for the accessible object
 * @type {object}
 */
export const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});