import Statement from "./Statement/Statement.js";

export class GameObjectTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    Interacted(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        return this.tracker.Trace('interacted',this.GameObjectType[type],gameobjectId);
    }

    Used(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        return this.tracker.Trace('used',this.GameObjectType[type],gameobjectId);
    }
}

export const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});