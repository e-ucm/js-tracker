import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";
/**
 * Accessible Tracker
 */
export class AlternativeTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {number} type the type of the accessible object
     */
    constructor(tracker, id, type=ALTERNATIVETYPE.ALTERNATIVE) {
        this.AlternativeId=id;
        this.Type=type;
        this.Tracker = tracker;
    }
    /**
     * the id of the alternative object
     * @type {string}
     */
    AlternativeId;
    /**
     * the type of the alternative object
     * @type {number}
     */
    Type;
    /**
     * the tracker of the alternative object
     * @type {xAPITrackerAsset}
     */
    Tracker;
    /**
     * the list of types possible for the alternative object
     * @type {Array}
     */
    AlternativeType = ['question', 'menu', 'dialog', 'path', 'arena', 'alternative'];

    /**
     * Send selected statement
     * @param {string} optionId the optionId of the selected statement
     * @returns {StatementBuilder}
     */
    selected(optionId) {        
        return this.Tracker.trace('selected',this.AlternativeType[this.Type],this.AlternativeId)
            .withResponse(optionId);
    }

    /**
     * Send unlocked statement
     * @param {string} optionId the optionId of the Unlocked statement
     * @returns {StatementBuilder}
     */
    unlocked(optionId) {
        return this.Tracker.trace('unlocked',this.AlternativeType[this.Type],this.AlternativeId)
                .withResponse(optionId);
    }
}

/**
 * the list of types possible for the alternative object
 */
export const ALTERNATIVETYPE = Object.freeze({
    QUESTION: 0,
    MENU: 1,
    DIALOG: 2,
    PATH: 3,
    ARENA: 4,
    ALTERNATIVE: 5
});