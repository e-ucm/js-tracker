import Statement from "./Statement/Statement.js";

export default class GameObject {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    GameObjectType = {
        Enemy: 0,
        Npc: 1,
        Item: 2,
        GameObject: 3,
        properties: ['enemy', 'npc', 'item', 'gameobject']
    };

    Interacted(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('interacted',this.GameObjectType.properties[type],gameobjectId);
        return statement;
    };

    Used(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('used',this.GameObjectType.properties[type],gameobjectId);
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