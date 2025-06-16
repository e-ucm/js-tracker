export class GameObjectTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker: xAPITrackerAsset);
    /**
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    GameObjectType: string[];
    /**
     * @param {string} gameobjectId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Interacted(gameobjectId: string, type: number): Statement;
    /**
     * @param {string} gameobjectId
     * @param {number} type
     * @returns {Statement}
     *
     */
    Used(gameobjectId: string, type: number): Statement;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const GAMEOBJECTTYPE: Readonly<{
    ENEMY: 0;
    NPC: 1;
    ITEM: 2;
    GAMEOBJECT: 3;
}>;
import xAPITrackerAsset = require("../xAPITrackerAsset.js");
import Statement = require("./Statement/Statement.js");
