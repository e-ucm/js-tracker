export class ScormTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker: xAPITrackerAsset);
    /**
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    ScormType: string[];
    /**
     * @param {string} scoId
     * @returns {Statement}
     *
     */
    Initialized(scoId: string): Statement;
    /**
     * @param {string} scoId
     * @returns {Statement}
     *
     */
    Suspended(scoId: string): Statement;
    /**
     * @param {string} scoId
     * @returns {Statement}
     *
     */
    Resumed(scoId: string): Statement;
    /**
     * @param {string} scoId
     * @returns {Statement}
     *
     */
    Terminated(scoId: string): Statement;
    /**
     * @param {string} activityId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Passed(activityId: string, type: number): Statement;
    /**
     * @param {string} activityId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Failed(activityId: string, type: number): Statement;
    /**
     * @param {string} activityId
     * @param {number} type
     * @param {number} score
     * @returns {Statement}
     *
     */
    Scored(activityId: string, type: number, score: number): Statement;
    /**
     * @param {string} activityId
     * @param {number} type
     * @param {boolean} success
     * @param {boolean} completion
     * @param {number} score
     * @returns {Statement}
     *
     */
    Completed(activityId: string, type: number, success: boolean, completion: boolean, score: number): Statement;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const SCORMTYPE: Readonly<{
    SCO: 0;
    COURSE: 1;
    MODULE: 2;
    ASSESSMENT: 3;
    INTERACTION: 4;
    OBJECTIVE: 5;
    ATTEMPT: 6;
}>;
import xAPITrackerAsset = require("../xAPITrackerAsset.js");
import Statement = require("./Statement/Statement.js");
