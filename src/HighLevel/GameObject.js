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
     * @param {number} type the type of the Game Object object
     */
    constructor(tracker,id, type) {
        if (typeof type === 'undefined') {type = 3;}
        this.gameobjectId=id;
        this.type=type;
        this.tracker = tracker;
    }
    /**
     * the id of the Game Object object
     * @type {string}
     */
    gameobjectId;
    /**
     * the type of the Game Object object
     * @type {number}
     */
    type;
    /**
     * the tracker of the Game Object object
     * @type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the Game Object object
     * @type {Array}
     */
    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    /**
     * Send Interacted statement
     * @returns {StatementBuilder}
     */
    Interacted() {
        return this.tracker.Trace('interacted',this.GameObjectType[this.type],this.gameobjectId);
    }
    
    /**
     * Send Used statement
     * @returns {StatementBuilder}
     */
    Used() {
        return this.tracker.Trace('used',this.GameObjectType[this.type],this.gameobjectId);
    }
}

/**
 * the list of types possible for the gameobject object
 * @type {object}
 */
export const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});