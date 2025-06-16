const xAPITrackerAsset = require("../xAPITrackerAsset.js");
const Statement = require("./Statement/Statement.js");

class GameObjectTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    /**
     * @type {xAPITrackerAsset}
     */
    tracker;

    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    /**
     * @param {string} gameobjectId
     * @param {number} type
     * @returns {Statement}
     * 
     */
    Interacted(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('interacted',this.GameObjectType[type],gameobjectId);
        return statement;
    }
    
    /**
     * @param {string} gameobjectId
     * @param {number} type
     * @returns {Statement}
     * 
     */
    Used(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('used',this.GameObjectType[type],gameobjectId);
        return statement;
    }
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});

module.exports = { GameObjectTracker, GAMEOBJECTTYPE };