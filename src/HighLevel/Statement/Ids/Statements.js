export const STATEMENT = Object.freeze({
    ACTOR: {
        TYPES :{
            AGENT: 'Agent',
            GROUP: 'Group'
        },
        AGENTTYPE :{
            MBOX: "mbox",
            MBOX_SHA1SUM: "mbox_sha1sum",
            OPENID: "openid",
            ACCOUNT: "account"
        },    
        GROUPTYPE :{
            NAME: "name",
            MEMBER: "member"
        }
    },

    CONTEXT: {
        ACTIVITIES: {
            PARENT: "parent",
            GROUPING: "grouping",
            CATEGORY: "category",
            OTHER: "other"
        }
    },

    RESULT: {
        SCORE: {
            RAW: "raw",
            MIN: "min",
            MAX: "max",
            SCALED: "scaled"
        },
        SUCCESS: "success",
        COMPLETION: "completion",
        RESPONSE: "response",
        DURATION: "duration",
        PROGRESS: "progress"
    },
    INTERACTIONOBJECT: {
        INTERACTIONTYPES: {
            TRUE_FALSE: "true-false",
            CHOICE: "choice",
            FILL_IN: "fill-in",
            LONG_FILL_IN: "long-fill-in",
            MATCHING: "matching",
            PERFORMANCE: "performance",
            SEQUENCING: "sequencing",
            LIKERT: "likert",
            NUMERIC: "numeric",
            OTHER: "other"
        },
        INTERACTIONCOMPONENTS: {
            CHOICE: ["choices"],
            SEQUENCING: ["choices"],
            LIKERT: ["scale"],
            MATCHING: ["source", "target"],
            PERFORMANCE: ["steps"]
        }
    }
});