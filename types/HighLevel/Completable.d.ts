export class CompletableTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker: xAPITrackerAsset);
    /**
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    CompletableType: string[];
    /**
     * @param {string} completableId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Initialized(completableId: string, type: number): Statement;
    /**
     * @param {string} completableId
     * @param {number} type
     * @param {number} progress
     * @returns {Statement}
     *
     */
    Progressed(completableId: string, type: number, progress: number): Statement;
    /**
     * @param {string} completableId
     * @param {number} type
     * @param {boolean} success
     * @param {boolean} completion
     * @param {number} score
     * @returns {Statement}
     *
     */
    Completed(completableId: string, type: number, success: boolean, completion: boolean, score: number): Statement;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const COMPLETABLETYPE: Readonly<{
    GAME: 0;
    SESSION: 1;
    LEVEL: 2;
    QUEST: 3;
    STAGE: 4;
    COMBAT: 5;
    STORYNODE: 6;
    RACE: 7;
    COMPLETABLE: 8;
}>;
import xAPITrackerAsset = require("../xAPITrackerAsset.js");
import Statement = require("./Statement/Statement.js");
