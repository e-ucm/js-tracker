/**
 * Accessible Tracker
 */
export class AccessibleTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {string} type the type of the accessible object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: string);
    /**
     * the id of the accessible object
     * @type {string}
     */
    AccessibleId: string;
    /**
     * the type of the accessible object
     * @type {string}
     */
    Type: string;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
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
import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import StatementBuilder from "../StatementBuilder/StatementBuilder.js";
