export class ScormTracker {
    constructor(tracker: any);
    tracker: any;
    ScormType: string[];
    Initialized(scoId: any): any;
    Suspended(scoId: any): any;
    Resumed(scoId: any): any;
    Terminated(scoId: any): any;
    Passed(activityId: any, type: any): any;
    Failed(activityId: any, type: any): any;
    Scored(activityId: any, type: any, score: any): any;
    Completed(activityId: any, type: any, success: any, completion: any, score: any): any;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
export const SCORMTYPE: Readonly<{
    SCO: 0;
    COURSE: 1;
    MODULE: 2;
    ASSESSMENT: 3;
    INTERACTION: 4;
    OBJECTIVE: 5;
    ATTEMPT: 6;
}>;
import Statement = require("./Statement/Statement.js");
