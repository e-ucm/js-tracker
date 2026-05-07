/**
 * Accessible Tracker
 */
export class AlternativeTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {string} type the type of the accessible object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: string);
    /**
     * the id of the alternative object
     * @type {string}
     */
    AlternativeId: string;
    /**
     * the type of the alternative object
     * @type {string}
     */
    Type: string;
    /**
     * the tracker of the alternative object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * Send selected statement
     * @param {string} optionId the optionId of the selected statement
     * @returns {StatementBuilder}
     */
    selected(optionId: string): StatementBuilder;
    /**
     * Send unlocked statement
     * @param {string} optionId the optionId of the Unlocked statement
     * @returns {StatementBuilder}
     */
    unlocked(optionId: string): StatementBuilder;
}
/**
 * the list of types possible for the alternative object
 */
export const ALTERNATIVETYPE: Readonly<{
    QUESTION: 0;
    MENU: 1;
    DIALOG: 2;
    PATH: 3;
    ARENA: 4;
    ALTERNATIVE: 5;
}>;
import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import StatementBuilder from "../StatementBuilder/StatementBuilder.js";
