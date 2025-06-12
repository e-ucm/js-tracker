export class AlternativeTracker {
    constructor(tracker: any);
    tracker: any;
    AlternativeType: string[];
    Selected(alternativeId: any, optionId: any, type: any): any;
    Unlocked(alternativeId: any, optionId: any, type: any): any;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const ALTERNATIVETYPE: Readonly<{
    QUESTION: 0;
    MENU: 1;
    DIALOG: 2;
    PATH: 3;
    ARENA: 4;
    ALTERNATIVE: 5;
}>;
import Statement = require("./Statement/Statement.js");
