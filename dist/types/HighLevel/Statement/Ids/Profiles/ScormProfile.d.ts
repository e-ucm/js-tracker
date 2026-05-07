export const SCORMPROFILE: Readonly<{
    CATEGORYID: "https://w3id.org/xapi/scorm/v/2";
    VERBS: {
        RESPONDED: string;
        RESUMED: string;
        SUSPENDED: string;
        TERMINATED: string;
        PASSED: string;
        FAILED: string;
        SCORED: string;
    };
    ACTIVITYTYPES: {
        COURSE: string;
        MODULE: string;
        SCO: string;
        ASSESSMENT: string;
        INTERACTION: string;
        CMI_INTERACTION: string;
        OBJECTIVE: string;
        ATTEMPT: string;
        PROFILE: string;
    };
    ACTIVITYEXTENSION: {};
    CONTEXTEXTENSION: {};
    RESULTEXTENSION: {};
}>;
