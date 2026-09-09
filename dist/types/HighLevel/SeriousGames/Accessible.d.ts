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
/**
 * the list of types possible for the alternative object
 */
export const ACCESSIBLETYPE: Readonly<{
    SCREEN: "https://w3id.org/xapi/seriousgames/activity-types/screen";
    AREA: "https://w3id.org/xapi/seriousgames/activity-types/area";
    ZONE: "https://w3id.org/xapi/seriousgames/activity-types/zone";
    CUTSCENE: "https://w3id.org/xapi/seriousgames/activity-types/cutscene";
    INVENTORY: "https://w3id.org/xapi/seriousgames/custom-types/inventory";
    ACCESSIBLE: "https://w3id.org/xapi/seriousgames/activity-types/accessible";
}>;
import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import StatementBuilder from "../StatementBuilder/StatementBuilder.js";
