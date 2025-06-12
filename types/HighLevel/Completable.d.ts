export class CompletableTracker {
    constructor(tracker: any);
    tracker: any;
    CompletableType: string[];
    Initialized(completableId: any, type: any): any;
    Progressed(completableId: any, type: any, progress: any): any;
    Completed(completableId: any, type: any, success: any, completion: any, score: any): any;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const COMPLETABLETYPE: Readonly<{
    GAME: 0;
    SESSION: 1;
    LEVEL: 2;
    QUEST: 3;
    STAGE: 4;
    COMBAT: 5;
    STORYNODE: 6;
    RACE: 7;
    COMPLETABLE: 8;
}>;
import Statement = require("./Statement/Statement.js");
