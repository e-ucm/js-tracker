import xAPITrackerAsset from "../xAPITrackerAsset.js";
import { StatementBuilder } from "./StatementBuilder.js";

/**
 * Game Object Tracker
 */
export class GameObjectTracker {
    /**
     * Constructor of Game Object tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Game Object object
     * @param {number} type the Type of the Game Object object
     */
    constructor(tracker,id, type=GAMEOBJECTTYPE.GAMEOBJECT) {
        this.GameobjectId=id;
        this.Type=type;
        this.Tracker= tracker;
    }
    /**
     * the id of the Game Object object
     * @Type {string}
     */
    GameobjectId;
    /**
     * the Type of the Game Object object
     * @Type {number}
     */
    Type;
    /**
     * the Trackerof the Game Object object
     * @Type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the Game Object object
     * @Type {Array}
     */
    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    /**
     * Send Interacted statement
     * @returns {StatementBuilder}
     */
    interacted() {
        return this.Tracker.trace('interacted',this.GameObjectType[this.Type],this.GameobjectId);
    }
    
    /**
     * Send Used statement
     * @returns {StatementBuilder}
     */
    used() {
        return this.Tracker.trace('used',this.GameObjectType[this.Type],this.GameobjectId);
    }
}

/**
 * the list of types possible for the gameobject object
 */
export const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});