export class AlternativeTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker: xAPITrackerAsset);
    /**
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    AlternativeType: string[];
    /**
     * @param {string} alternativeId
     * @param {string} optionId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Selected(alternativeId: string, optionId: string, type: number): Statement;
    /**
     * @param {string} alternativeId
     * @param {string} optionId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Unlocked(alternativeId: string, optionId: string, type: number): Statement;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const ALTERNATIVETYPE: Readonly<{
    QUESTION: 0;
    MENU: 1;
    DIALOG: 2;
    PATH: 3;
    ARENA: 4;
    ALTERNATIVE: 5;
}>;
import xAPITrackerAsset = require("../xAPITrackerAsset.js");
import Statement = require("./Statement/Statement.js");
