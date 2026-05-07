export const STATEMENT: Readonly<{
    ACTOR: {
        TYPES: {
            AGENT: string;
            GROUP: string;
        };
        AGENTTYPE: {
            MBOX: string;
            MBOX_SHA1SUM: string;
            OPENID: string;
            ACCOUNT: string;
        };
        GROUPTYPE: {
            NAME: string;
            MEMBER: string;
        };
    };
    CONTEXT: {
        ACTIVITIES: {
            PARENT: string;
            GROUPING: string;
            CATEGORY: string;
            OTHER: string;
        };
    };
    RESULT: {
        SCORE: {
            RAW: string;
            MIN: string;
            MAX: string;
            SCALED: string;
        };
        SUCCESS: string;
        COMPLETION: string;
        RESPONSE: string;
        DURATION: string;
        PROGRESS: string;
    };
    INTERACTIONOBJECT: {
        INTERACTIONTYPES: {
            TRUE_FALSE: string;
            CHOICE: string;
            FILL_IN: string;
            LONG_FILL_IN: string;
            MATCHING: string;
            PERFORMANCE: string;
            SEQUENCING: string;
            LIKERT: string;
            NUMERIC: string;
            OTHER: string;
        };
        INTERACTIONCOMPONENTS: {
            CHOICE: string[];
            SEQUENCING: string[];
            LIKERT: string[];
            MATCHING: string[];
            PERFORMANCE: string[];
        };
    };
}>;
