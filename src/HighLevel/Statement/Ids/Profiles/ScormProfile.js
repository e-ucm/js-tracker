export const SCORMPROFILE = Object.freeze({
    CATEGORYID:  'https://w3id.org/xapi/scorm/v/2',
    VERBS: {
        //SCORM Verbs
        RESPONDED: 'http://adlnet.gov/expapi/verbs/responded',
        RESUMED: 'http://adlnet.gov/expapi/verbs/resumed',
        SUSPENDED: 'http://adlnet.gov/expapi/verbs/suspended',
        TERMINATED: 'http://adlnet.gov/expapi/verbs/terminated',
        PASSED: 'http://adlnet.gov/expapi/verbs/passed',
        FAILED: 'http://adlnet.gov/expapi/verbs/failed',
        SCORED: 'http://adlnet.gov/expapi/verbs/scored',
    },
    ACTIVITYTYPES: {
        //SCORM Object Types
        COURSE: 'http://adlnet.gov/expapi/activities/course',
        MODULE: 'http://adlnet.gov/expapi/activities/module',
        SCO: 'http://adlnet.gov/expapi/activities/lesson',
        ASSESSMENT: 'http://adlnet.gov/expapi/activities/assessment',
        INTERACTION: 'http://adlnet.gov/expapi/activities/interaction',
        CMI_INTERACTION: "http://adlnet.gov/expapi/activities/cmi.interaction",
        OBJECTIVE: 'http://adlnet.gov/expapi/activities/objective',
        ATTEMPT: 'http://adlnet.gov/expapi/activities/attempt',
        PROFILE: 'http://adlnet.gov/expapi/activities/profile'
    },
    ACTIVITYEXTENSION:{}, CONTEXTEXTENSION: {}, RESULTEXTENSION: {}
});