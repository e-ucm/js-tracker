import Statement from "./Statement/Statement.js";

export class GameObjectTracker {
    constructor(tracker,id, type) {
        if (typeof type === 'undefined') {type = 3;}
        this.gameobjectId=id;
        this.type=type;
        this.tracker = tracker;
    }
    
    tracker;

    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    Interacted() {
        return this.tracker.Trace('interacted',this.GameObjectType[this.type],this.gameobjectId);
    }

    Used() {
        return this.tracker.Trace('used',this.GameObjectType[this.type],this.gameobjectId);
    }
}

export const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});