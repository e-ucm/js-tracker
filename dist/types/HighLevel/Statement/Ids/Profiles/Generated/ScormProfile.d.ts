export const SCORMPROFILE: Readonly<{
    CATEGORYID: "https://w3id.org/xapi/scorm/v/2";
    VERBS: {
        COMPLETED: string;
        FAILED: string;
        INITIALIZED: string;
        PASSED: string;
        RESPONDED: string;
        RESUMED: string;
        SCORED: string;
        SUSPENDED: string;
        TERMINATED: string;
    };
    ACTIVITYTYPES: {
        ASSESSMENT: string;
        ATTEMPT: string;
        CMI_INTERACTION: string;
        COURSE: string;
        LESSON: string;
        MODULE: string;
        OBJECTIVE: string;
        PROFILE: string;
    };
    ACTIVITYEXTENSION: {};
    CONTEXTEXTENSION: {};
    RESULTEXTENSION: {};
}>;
