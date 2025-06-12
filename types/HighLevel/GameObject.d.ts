export class GameObjectTracker {
    constructor(tracker: any);
    tracker: any;
    GameObjectType: string[];
    Interacted(gameobjectId: any, type: any): any;
    Used(gameobjectId: any, type: any): any;
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
import Statement = require("./Statement/Statement.js");
