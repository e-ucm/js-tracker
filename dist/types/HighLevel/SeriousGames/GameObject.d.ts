/**
 * Game Object Tracker
 */
export class GameObjectTracker {
    /**
     * Constructor of Game Object tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Game Object object
     * @param {string} type the Type of the Game Object object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: string);
    /**
     * the id of the Game Object object
     * @Type {string}
     */
    GameobjectId: string;
    /**
     * the Type of the Game Object object
     * @Type {string}
     */
    Type: string;
    Tracker: xAPITrackerAsset;
    /**
     * the Trackerof the Game Object object
     * @Type {xAPITrackerAsset}
     */
    tracker: any;
    /**
     * Send Interacted statement
     * @returns {StatementBuilder}
     */
    interacted(): StatementBuilder;
    /**
     * Send Used statement
     * @returns {StatementBuilder}
     */
    used(): StatementBuilder;
}
/**
 * the list of types possible for the gameobject object
 */
export const GAMEOBJECTTYPE: Readonly<{
    ENEMY: 0;
    NPC: 1;
    ITEM: 2;
    GAMEOBJECT: 3;
}>;
import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import StatementBuilder from "../StatementBuilder/StatementBuilder.js";
