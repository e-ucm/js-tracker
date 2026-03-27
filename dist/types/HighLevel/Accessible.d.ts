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
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the accessible object
     * @type {string}
     */
    AccessibleId: string;
    /**
     * the type of the accessible object
     * @type {number}
     */
    Type: number;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * the list of types possible for the accessible object
     * @type {Array}
     */
    AccessibleType: any[];
    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    accessed(): StatementBuilder;
    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    skipped(): StatementBuilder;
}
/**
 * the list of types possible for the accessible object
 */
export const ACCESSIBLETYPE: Readonly<{
    SCREEN: 0;
    AREA: 1;
    ZONE: 2;
    CUTSCENE: 3;
    ACCESSIBLE: 4;
}>;
import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
