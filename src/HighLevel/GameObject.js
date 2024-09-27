class GameObject {
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
        this.tracker.enqueue(statement.toXAPI());
        return statement;
    };

    Used(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('used',this.GameObjectType.properties[type],gameobjectId);
        this.tracker.enqueue(statement.toXAPI());
        return statement;
    };
}
module.exports = GameObject;