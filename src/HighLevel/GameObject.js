import Statement from "./Statement/Statement.js";

export class GameObjectTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    Interacted(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('interacted',this.GameObjectType[type],gameobjectId);
        return statement;
    };

    Used(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('used',this.GameObjectType[type],gameobjectId);
        return statement;
    };
    
    /**
     * @param {Statement} statement
     * 
     */
    async sendStatement(statement) {
        await this.tracker.enqueue(statement.toXAPI());
    }
}

export const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});