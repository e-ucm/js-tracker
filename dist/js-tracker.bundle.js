import XAPI from '@xapi/xapi';
import { v4 } from 'uuid';
import axios from 'axios';
import * as ms from 'ms';

const STATEMENT = Object.freeze({
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

/**
 * Actor Class of a Statement (xAPI Agent or Group)
 */
class ActorStatement {
    /**
     * Create an Agent or Group
     * @param {Object} options
     *  - objectType: "Agent" | "Group" (default: "Agent")
     *  - name: string (optional)
     *  - mbox: string (optional, mailto:...)
     *  - mbox_sha1sum: string (optional)
     *  - openid: string (optional)
     *  - account: { homePage: string, name: string } (optional)
     *  - member: ActorStatement[] (for Group)
     */
    constructor(options = {}) {
        for (const key of [STATEMENT.ACTOR.AGENTTYPE.MBOX, STATEMENT.ACTOR.AGENTTYPE.MBOX_SHA1SUM, STATEMENT.ACTOR.AGENTTYPE.OPENID, STATEMENT.ACTOR.AGENTTYPE.ACCOUNT]) {
            if (options[key]) {
                this.objectType = STATEMENT.ACTOR.TYPES.AGENT;
                this.setActor(key, options[key]);
                break; // Only one of these should be set for an Agent
            }
        }
        for (const key of [STATEMENT.ACTOR.GROUPTYPE.NAME, STATEMENT.ACTOR.GROUPTYPE.MEMBER]) {
            if (options[key]) {
                this.objectType = STATEMENT.ACTOR.TYPES.GROUP;
                this.setActor(key, options[key]);
            }
        }
    }

    /**
     * Set actor properties with validation
     * @param {typeof STATEMENT.ACTOR.AGENTTYPE[keyof typeof STATEMENT.ACTOR.AGENTTYPE]|typeof STATEMENT.ACTOR.GROUPTYPE[keyof typeof STATEMENT.ACTOR.GROUPTYPE]} type - one of name, mbox, mbox_sha1sum, openid, account, member
     * @param {Object|Array|String} actorData - data for the specified type
     */
    setActor(type, actorData) {
        switch (type) {
            case STATEMENT.ACTOR.GROUPTYPE.NAME:
                if (this.objectType === STATEMENT.ACTOR.TYPES.AGENT) {
                    throw new Error("Agent cannot have a name, only mbox, mbox_sha1sum, openid, or account");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Group name must be a string");
                }
                this.name = actorData;
                break;
            case STATEMENT.ACTOR.AGENTTYPE.MBOX:
                if (this.objectType === STATEMENT.ACTOR.TYPES.GROUP) {
                    throw new Error("Group cannot have mbox, mbox_sha1sum, openid, or account, only a name");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Agent mbox must be a string");
                }

                this.mbox = actorData;
                break;
            case STATEMENT.ACTOR.AGENTTYPE.MBOX_SHA1SUM:
                if (this.objectType === STATEMENT.ACTOR.TYPES.GROUP) {
                    throw new Error("Group cannot have mbox_sha1sum");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Agent mbox_sha1sum must be a string");
                }
                this.mbox_sha1sum = actorData;
                break;
            case STATEMENT.ACTOR.AGENTTYPE.OPENID:
                if (this.objectType === STATEMENT.ACTOR.TYPES.GROUP) {
                    throw new Error("Group cannot have openid");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Agent openid must be a string");
                }
                this.openid = actorData;
                break;
            case STATEMENT.ACTOR.AGENTTYPE.ACCOUNT:
                if  (this.objectType === STATEMENT.ACTOR.TYPES.GROUP) {
                    throw new Error("Group cannot have account");
                }
                if (typeof actorData !== "object" || typeof actorData.homePage !== "string" || typeof actorData.name !== "string") {
                    throw new Error("Agent account must be an object with homePage and name strings");
                }
                this.account = actorData;
                break;
            case STATEMENT.ACTOR.GROUPTYPE.MEMBER:
                if (this.objectType !== STATEMENT.ACTOR.TYPES.GROUP) {
                    throw new Error("Only Group can have members");
                }
                if (!Array.isArray(actorData)) {
                    throw new Error("Group members must be an array");
                }
                this.member = actorData.map(m => m instanceof ActorStatement ? m : new ActorStatement(m));
                break;
            default:
                throw new Error(`Unsupported actor type: ${type}`);
        }
    }

    /**
     * Create an ActorStatement from xAPI Agent or Group object
     * @param {Object} xapiObj
     * @returns {ActorStatement}
     */
    static fromXAPI(xapiObj) {
        if (!xapiObj) return null;
        const options = {
            name: xapiObj.name,
            mbox: xapiObj.mbox,
            mbox_sha1sum: xapiObj.mbox_sha1sum,
            openid: xapiObj.openid,
            account: xapiObj.account,
            member: Array.isArray(xapiObj.member) ? xapiObj.member.map(m => ActorStatement.fromXAPI(m)) : undefined
        };
        return new ActorStatement(options);
    }

    /**
     * Convert to xAPI Agent or Group object
     * @returns {Object}
     */
    toXAPI() {
        const obj = { objectType: this.objectType };
        if (this.name) obj.name = this.name;
        // Agent or Identified Group: one of mbox, mbox_sha1sum, openid, account
        if (this.mbox) obj.mbox = this.mbox;
        else if (this.mbox_sha1sum) obj.mbox_sha1sum = this.mbox_sha1sum;
        else if (this.openid) obj.openid = this.openid;
        else if (this.account) obj.account = this.account;
        // Group: add member if present
        if (this.objectType === STATEMENT.ACTOR.TYPES.GROUP && Array.isArray(this.member)) {
            obj.member = this.member.map(m => (typeof m.toXAPI === 'function' ? m.toXAPI() : m));
        }
        return obj;
    }

    /**
     * Convert to CSV (uses name or account name)
     * @returns {String}
     */
    toCSV() {
        if (this.name) return this.name.replaceAll(',', '\\,');
        if (this.account && this.account.name) return this.account.name.replaceAll(',', '\\,');
        if (this.mbox) return this.mbox.replaceAll(',', '\\,');
        return '';
    }
}

/**
 * Set as URI if it is not an URI already
 * @param {string} id the id of the part of the statement
 * @param {string} base the base URI to use if id is not an URI
 * @returns {String}
 */
function setAsUri(id, base) {
    if (isUri(id)) {
        return id;
    }
    // Remove trailing slash if present
    if (base.endsWith('/')) {
        base = base.slice(0, -1);
    }
    // Remove leading slash from id if present
    let cleanId = id.startsWith('/') ? id.slice(1) : id;
    if (base.includes('://')) {
        return `${base}/${cleanId}`;
    } else {
        return `${base}://${cleanId}`;
    }
}

/**
 * Check if the string is an URI
 * @param {string} id 
 * @returns {boolean}
 */
function isUri(id) {
    const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(id);
}

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const ACADEMICASSESSMENTPROFILE = Object.freeze({
    CATEGORYID: 'https://pttportal.af.mil/xapi/profile/academic-assessment/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const ACROSSXPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/acrossx/v/2',
    VERBS: {
        ANNOTATED: 'https://w3id.org/xapi/acrossx/verbs/annotated',
        DESIGNED: 'https://w3id.org/xapi/acrossx/verbs/designed',
        DISLIKED: 'https://w3id.org/xapi/acrossx/verbs/disliked',
        EDITED: 'https://w3id.org/xapi/acrossx/verbs/edited',
        EVALUATED: 'https://w3id.org/xapi/acrossx/verbs/evaluated',
        LIKED: 'https://w3id.org/xapi/acrossx/verbs/liked',
        POSTED: 'https://w3id.org/xapi/acrossx/verbs/posted',
        REPORTED: 'https://w3id.org/xapi/acrossx/verbs/reported',
        REVEALED: 'https://w3id.org/xapi/acrossx/verbs/revealed',
        SEARCHED: 'https://w3id.org/xapi/acrossx/verbs/searched',
        WAS_ASSIGNED: 'https://w3id.org/xapi/acrossx/verbs/was-assigned',
        WATCHED: 'https://w3id.org/xapi/acrossx/verbs/watched',
    },
    ACTIVITYTYPES: {
        COLLABORATION: 'https://w3id.org/xapi/acrossx/activities/collaboration',
        E_BOOK: 'https://w3id.org/xapi/acrossx/activities/e-book',
        FACE_TO_FACE_DISCUSSION: 'https://w3id.org/xapi/acrossx/activities/face-to-face-discussion',
        INSTANT_RESPONSE_SYSTEM: 'https://w3id.org/xapi/acrossx/activities/instant-response-system',
        LEARNING_PLAN: 'https://w3id.org/xapi/acrossx/activities/learning-plan',
        MESSAGE: 'https://w3id.org/xapi/acrossx/activities/message',
        NOTE: 'https://w3id.org/xapi/acrossx/activities/note',
        ONLINE_DISCUSSION: 'https://w3id.org/xapi/acrossx/activities/online-discussion',
        PAGE: 'https://w3id.org/xapi/acrossx/activities/page',
        PRINTED_ASSESSMENT: 'https://w3id.org/xapi/acrossx/activities/printed-assessment',
        PRINTED_BOOK: 'https://w3id.org/xapi/acrossx/activities/printed-book',
        PRINTED_WORKSHEET: 'https://w3id.org/xapi/acrossx/activities/printed-worksheet',
        SEARCH_ENGINE: 'https://w3id.org/xapi/acrossx/activities/search-engine',
        VIDEO: 'https://w3id.org/xapi/acrossx/activities/video',
        WEBPAGE: 'https://w3id.org/xapi/acrossx/activities/webpage',
    },
    ACTIVITYEXTENSION: {
        ALIGNMENT: 'https://w3id.org/xapi/acrossx/extensions/alignment',
        ANCHOR_TEXT: 'https://w3id.org/xapi/acrossx/extensions/anchor-text',
        BLOOMS_LEVEL: 'https://w3id.org/xapi/acrossx/extensions/blooms-level',
        BY_WHOM: 'https://w3id.org/xapi/acrossx/extensions/by-whom',
        CHAPTER: 'https://w3id.org/xapi/acrossx/extensions/chapter',
        COLUMN: 'https://w3id.org/xapi/acrossx/extensions/column',
        FEEDBACK: 'https://w3id.org/xapi/acrossx/extensions/feedback',
        HIGHLIGHTEDSTRING: 'https://w3id.org/xapi/acrossx/extensions/highlightedString',
        PASS_SCORE: 'https://w3id.org/xapi/acrossx/extensions/pass-score',
        ROW: 'https://w3id.org/xapi/acrossx/extensions/row',
        SECTION: 'https://w3id.org/xapi/acrossx/extensions/section',
        SUPPLEMENTAL_INFO: 'https://w3id.org/xapi/acrossx/extensions/supplemental-info',
        TIME_LIMIT: 'https://w3id.org/xapi/acrossx/extensions/time-limit',
        TOTAL_ITEMS: 'https://w3id.org/xapi/acrossx/extensions/total-items',
        TOTAL_PAGES: 'https://w3id.org/xapi/acrossx/extensions/total-pages',
        TOTAL_SCORE: 'https://w3id.org/xapi/acrossx/extensions/total-score',
        TYPE: 'https://w3id.org/xapi/acrossx/extensions/type',
    },
    CONTEXTEXTENSION: {
        MENTIONEDAGENT: 'https://w3id.org/xapi/acrossx/extensions/mentionedagent',
        SCHOOL: 'https://w3id.org/xapi/acrossx/extensions/school',
    },
    RESULTEXTENSION: {
        RUBRICS: 'https://w3id.org/xapi/acrossx/extensions/rubrics',
        STARTING_POINT: 'https://w3id.org/xapi/acrossx/extensions/starting-point',
        TIME: 'https://w3id.org/xapi/acrossx/extensions/time',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const ACTIONABLEDATABOOKADBPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/adb/v/2',
    VERBS: {
        ANNOTATED: 'https://w3id.org/xapi/adb/verbs/annotated',
        ARRIVED: 'https://w3id.org/xapi/adb/verbs/arrived',
        ATTENDED: 'https://w3id.org/xapi/adb/verbs/attended',
        BOOKMARKED: 'https://w3id.org/xapi/adb/verbs/bookmarked',
        COACHED: 'https://w3id.org/xapi/adb/verbs/coached',
        DEMANDED: 'https://w3id.org/xapi/adb/verbs/demanded',
        DESCRIBED: 'https://w3id.org/xapi/adb/verbs/described',
        HIGHLIGHTED: 'https://w3id.org/xapi/adb/verbs/highlighted',
        INITIATED: 'https://w3id.org/xapi/adb/verbs/initiated',
        NOTED: 'https://w3id.org/xapi/adb/verbs/noted',
        READ: 'https://w3id.org/xapi/adb/verbs/read',
        REFERENCED: 'https://w3id.org/xapi/adb/verbs/referenced',
        REQUESTED: 'https://w3id.org/xapi/adb/verbs/requested',
        SELECTED: 'https://w3id.org/xapi/adb/verbs/selected',
        WATCHED: 'https://w3id.org/xapi/adb/verbs/watched',
    },
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const ACTIVITYSTREAMSVOCABULARYPROFILE = Object.freeze({
    CATEGORYID: 'http://activitystrea.ms/schema',
    VERBS: {
        ACCEPTED: 'http://activitystrea.ms/accept',
        ACCESSED: 'http://activitystrea.ms/access',
        ACKNOWLEDGED: 'http://activitystrea.ms/acknowledge',
        ADDED: 'http://activitystrea.ms/add',
        AGREED: 'http://activitystrea.ms/agree',
        APPENDED: 'http://activitystrea.ms/append',
        APPROVED: 'http://activitystrea.ms/approve',
        ARCHIVED: 'http://activitystrea.ms/archive',
        ASSIGNED: 'http://activitystrea.ms/assign',
        ATTACHED: 'http://activitystrea.ms/attach',
        ATTENDED: 'http://activitystrea.ms/attend',
        AUTHORED: 'http://activitystrea.ms/author',
        AUTHORIZED: 'http://activitystrea.ms/authorize',
        BORROWED: 'http://activitystrea.ms/borrow',
        BUILT: 'http://activitystrea.ms/build',
        CANCELED: 'http://activitystrea.ms/cancel',
        CHECKEDIN: 'http://activitystrea.ms/checkin',
        CLOSED: 'http://activitystrea.ms/close',
        COMPLETED: 'http://activitystrea.ms/complete',
        CONFIRMED: 'http://activitystrea.ms/confirm',
        CONSUMED: 'http://activitystrea.ms/consume',
        CREATED: 'http://activitystrea.ms/create',
        DELETED: 'http://activitystrea.ms/delete',
        DELIVERED: 'http://activitystrea.ms/deliver',
        DENIED: 'http://activitystrea.ms/deny',
        DISAGREED: 'http://activitystrea.ms/disagree',
        DISLIKED: 'http://activitystrea.ms/dislike',
        EXPERIENCED: 'http://activitystrea.ms/experience',
        FAVORITED: 'http://activitystrea.ms/favorite',
        FLAGGED_AS_INAPPROPRIATE: 'http://activitystrea.ms/flag-as-inappropriate',
        FOLLOWED: 'http://activitystrea.ms/follow',
        FOUND: 'http://activitystrea.ms/find',
        GAVE: 'http://activitystrea.ms/give',
        HOSTED: 'http://activitystrea.ms/host',
        IGNORED: 'http://activitystrea.ms/ignore',
        INSERTED: 'http://activitystrea.ms/insert',
        INSTALLED: 'http://activitystrea.ms/install',
        INTERACTED: 'http://activitystrea.ms/interact',
        INVITED: 'http://activitystrea.ms/invite',
        JOINED: 'http://activitystrea.ms/join',
        LEFT: 'http://activitystrea.ms/leave',
        LIKED: 'http://activitystrea.ms/like',
        LISTENED: 'http://activitystrea.ms/listen',
        LOST: 'http://activitystrea.ms/lose',
        MADEFRIEND: 'http://activitystrea.ms/make-friend',
        OPENED: 'http://activitystrea.ms/open',
        PLAYED: 'http://activitystrea.ms/play',
        PRESENTED: 'http://activitystrea.ms/present',
        PURCHASED: 'http://activitystrea.ms/purchase',
        QUALIFIED: 'http://activitystrea.ms/qualify',
        READ: 'http://activitystrea.ms/read',
        RECEIVED: 'http://activitystrea.ms/receive',
        REJECTED: 'http://activitystrea.ms/reject',
        REMOVED: 'http://activitystrea.ms/remove',
        REMOVED_FRIEND: 'http://activitystrea.ms/remove-friend',
        REPLACED: 'http://activitystrea.ms/replace',
        REQUESTED: 'http://activitystrea.ms/request',
        REQUESTED_FRIEND: 'http://activitystrea.ms/request-friend',
        RESOLVED: 'http://activitystrea.ms/resolve',
        RETRACTED: 'http://activitystrea.ms/retract',
        RETURNED: 'http://activitystrea.ms/return',
        RSVP_MAYBE: 'http://activitystrea.ms/rsvp-maybe',
        RSVP_NO: 'http://activitystrea.ms/rsvp-no',
        RSVP_YES: 'http://activitystrea.ms/rsvp-yes',
        SATISFIED: 'http://activitystrea.ms/satisfy',
        SAVED: 'http://activitystrea.ms/save',
        SCHEDULED: 'http://activitystrea.ms/schedule',
        SEARCHED: 'http://activitystrea.ms/search',
        SENT: 'http://activitystrea.ms/send',
        SHARED: 'http://activitystrea.ms/share',
        SOLD: 'http://activitystrea.ms/sell',
        SPONSORED: 'http://activitystrea.ms/sponsor',
        STARTED: 'http://activitystrea.ms/start',
        STOPPED_FOLLOWING: 'http://activitystrea.ms/stop-following',
        SUBMITTED: 'http://activitystrea.ms/submit',
        TAGGED: 'http://activitystrea.ms/tag',
        TERMINATED: 'http://activitystrea.ms/terminate',
        TIED: 'http://activitystrea.ms/tie',
        UNFAVORITED: 'http://activitystrea.ms/unfavorite',
        UNLIKED: 'http://activitystrea.ms/unlike',
        UNSATISFIED: 'http://activitystrea.ms/unsatisfy',
        UNSAVED: 'http://activitystrea.ms/unsave',
        UNSHARED: 'http://activitystrea.ms/unshare',
        UPDATED: 'http://activitystrea.ms/update',
        USED: 'http://activitystrea.ms/use',
        WAS_AT: 'http://activitystrea.ms/at',
        WATCHED: 'http://activitystrea.ms/watch',
        WON: 'http://activitystrea.ms/win',
    },
    ACTIVITYTYPES: {
        ALERT: 'http://activitystrea.ms/alert',
        APPLICATION: 'http://activitystrea.ms/application',
        ARTICLE: 'http://activitystrea.ms/article',
        AUDIO: 'http://activitystrea.ms/audio',
        BADGE: 'http://activitystrea.ms/badge',
        BINARY: 'http://activitystrea.ms/binary',
        BOOKMARK: 'http://activitystrea.ms/bookmark',
        COLLECTION: 'http://activitystrea.ms/collection',
        COMMENT: 'http://activitystrea.ms/comment',
        DEVICE: 'http://activitystrea.ms/device',
        EVENT: 'http://activitystrea.ms/event',
        FILE: 'http://activitystrea.ms/file',
        GAME: 'http://activitystrea.ms/game',
        GROUP: 'http://activitystrea.ms/group',
        IMAGE: 'http://activitystrea.ms/image',
        ISSUE: 'http://activitystrea.ms/issue',
        JOB: 'http://activitystrea.ms/job',
        NOTE: 'http://activitystrea.ms/note',
        OFFER: 'http://activitystrea.ms/offer',
        ORGANIZATION: 'http://activitystrea.ms/organization',
        PAGE: 'http://activitystrea.ms/page',
        PERSON: 'http://activitystrea.ms/person',
        PLACE: 'http://activitystrea.ms/place',
        PROCESS: 'http://activitystrea.ms/process',
        PRODUCT: 'http://activitystrea.ms/product',
        QUESTION: 'http://activitystrea.ms/question',
        REVIEW: 'http://activitystrea.ms/review',
        SERVICE: 'http://activitystrea.ms/service',
        TASK: 'http://activitystrea.ms/task',
        VIDEO: 'http://activitystrea.ms/video',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const ADLVOCABULARYPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/adl/v/2',
    VERBS: {
        ANSWERED: 'http://adlnet.gov/expapi/verbs/answered',
        ASKED: 'http://adlnet.gov/expapi/verbs/asked',
        ATTEMPTED: 'http://adlnet.gov/expapi/verbs/attempted',
        ATTENDED: 'http://adlnet.gov/expapi/verbs/attended',
        COMMENTED: 'http://adlnet.gov/expapi/verbs/commented',
        EXITED: 'http://adlnet.gov/expapi/verbs/exited',
        EXPERIENCED: 'http://adlnet.gov/expapi/verbs/experienced',
        IMPORTED: 'http://adlnet.gov/expapi/verbs/imported',
        INTERACTED: 'http://adlnet.gov/expapi/verbs/interacted',
        LAUNCHED: 'http://adlnet.gov/expapi/verbs/launched',
        LOGGED_IN: 'https://w3id.org/xapi/adl/verbs/logged-in',
        LOGGED_OUT: 'https://w3id.org/xapi/adl/verbs/logged-out',
        MASTERED: 'http://adlnet.gov/expapi/verbs/mastered',
        PREFERRED: 'http://adlnet.gov/expapi/verbs/preferred',
        PROGRESSED: 'http://adlnet.gov/expapi/verbs/progressed',
        REGISTERED: 'http://adlnet.gov/expapi/verbs/registered',
        SHARED: 'http://adlnet.gov/expapi/verbs/shared',
        VOIDED: 'http://adlnet.gov/expapi/verbs/voided',
    },
    ACTIVITYTYPES: {
        FILE: 'http://adlnet.gov/expapi/activities/file',
        LINK: 'http://adlnet.gov/expapi/activities/link',
        MEDIA: 'http://adlnet.gov/expapi/activities/media',
        MEETING: 'http://adlnet.gov/expapi/activities/meeting',
        PERFORMANCE: 'http://adlnet.gov/expapi/activities/performance',
        QUESTION: 'http://adlnet.gov/expapi/activities/question',
        SIMULATION: 'http://adlnet.gov/expapi/activities/simulation',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const AUDIOPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/audio/v1.0',
    VERBS: {},
    ACTIVITYTYPES: {
        AUDIO: 'https://w3id.org/xapi/audio/activity-type/audio',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const BOLLPROFILE = Object.freeze({
    CATEGORYID: 'https://ed3chain.com/xapi/boll/v/1',
    VERBS: {
        APPLIED: 'https://ed3chain.com/xapi/boll/verbs#applied',
        DECLINED: 'https://ed3chain.com/xapi/boll/verbs#declined',
        FAILED: 'https://ed3chain.com/xapi/boll/verbs#failed',
        PASSED: 'https://ed3chain.com/xapi/boll/verbs#passed',
        SCHOOLED: 'https://ed3chain.com/xapi/boll/verb#schooled',
        SCORED: 'https://ed3chain.com/xapi/boll#scored',
    },
    ACTIVITYTYPES: {
        CREDENTIAL: 'https://ed3chain.com/xapi/boll/activity#credential',
        LMS_COURSE: 'http://id.tincanapi.com/activitytype/lms/course',
        PRINTED_ASSESSMENT: 'https://ed3chain.com/xapi/boll/activity#printed-assessment',
        PROGRAM: 'https://ed3chain.com/xapi/boll/activities#program',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        LEARNER: 'https://ed3chain.com/xapi/boll/extensions#learner',
        LOCATION: 'https://ed3chain.com/xapi/boll/extensions#location',
        SCHOOL: 'https://ed3chain.com/xapi/boll/extensions#school',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const CMI5PROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/cmi5/context/categories/cmi5/v/7',
    VERBS: {
        ABANDONED: 'https://w3id.org/xapi/adl/verbs/abandoned',
        SATISFIED: 'https://w3id.org/xapi/adl/verbs/satisfied',
        WAIVED: 'https://w3id.org/xapi/adl/verbs/waived',
    },
    ACTIVITYTYPES: {
        BLOCK: 'https://w3id.org/xapi/cmi5/activitytype/block',
        COURSE: 'https://w3id.org/xapi/cmi5/activitytype/course',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        LAUNCH_MODE: 'https://w3id.org/xapi/cmi5/context/extensions/launchmode',
        LAUNCH_PARAMETERS: 'https://w3id.org/xapi/cmi5/context/extensions/launchparameters',
        LAUNCH_URL: 'https://w3id.org/xapi/cmi5/context/extensions/launchurl',
        MASTERY_SCORE: 'https://w3id.org/xapi/cmi5/context/extensions/masteryscore',
        MOVE_ON: 'https://w3id.org/xapi/cmi5/context/extensions/moveon',
        SESSION_ID: 'https://w3id.org/xapi/cmi5/context/extensions/sessionid',
    },
    RESULTEXTENSION: {
        PROGRESS: 'https://w3id.org/xapi/cmi5/result/extensions/progress',
        REASON: 'https://w3id.org/xapi/cmi5/result/extensions/reason',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const CONTENTREPOSITORYPROFILE = Object.freeze({
    CATEGORYID: 'https://xapi.org.au/contentprofile/v/2',
    VERBS: {
        ADDED: 'https://xapi.org.au/contentprofile/verb/added',
        COMMENCED: 'https://xapi.org.au/contentprofile/verb/commenced',
        WITHDREW: 'https://xapi.org.au/contentprofile/verb/withdrew',
    },
    ACTIVITYTYPES: {
        JOURNAL_ARTICLE: 'http://xapi.org.au/contentprofile/activitytype/journal_article',
        SURVEY: 'https://xapi.org.au/contentprofile/activitytype/survey',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        ACADEMIC_TERM: 'http://xapi.org.au/contentprofile/extension/academic_term',
        ACADEMIC_YEAR: 'http://xapi.org.au/contentprofile/extension/academic_year',
        CITATION_INFO: 'http://xapi.org.au/contentprofile/extension/citation_info',
        COUNT: 'https://xapi.org.au/contentprofile/extension/count',
        COURSE_CODE: 'http://xapi.org.au/contentprofile/extension/course_code',
        DOI: 'http://xapi.org.au/contentprofile/extension/doi',
        ISSN: 'http://xapi.org.au/contentprofile/extension/issn',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const COREPROFILE = Object.freeze({
    CATEGORYID: 'https://pttportal.af.mil/xapi/profile/core/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const DATASECURITYMODULEPROFILE = Object.freeze({
    CATEGORYID: 'https://profiles.adlnet.gov/xapi/71d1605b-b078-4494-b7b8-7f3a2b442f36/v/2',
    VERBS: {
        CHAPTER_INTRODUCTION_FINISHED: 'https://profiles.adlnet.gov/xapi/71d1605b-b078-4494-b7b8-7f3a2b442f36/verb/chapter_introduction',
    },
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const DODISDPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/dod-isd/v1.0',
    VERBS: {
        ABLED: 'https://w3id.org/xapi/dod-isd/verbs/abled',
        ACCESSED: 'https://w3id.org/xapi/dod-isd/verbs/accessed',
        ACCLIMATIZED: 'https://w3id.org/xapi/dod-isd/verbs/acclimatized',
        ACCOMMODATED: 'https://w3id.org/xapi/dod-isd/verbs/accommodated',
        ACCOMPLISHED: 'https://w3id.org/xapi/dod-isd/verbs/accomplished',
        ACHIEVED: 'https://w3id.org/xapi/dod-isd/verbs/achieved',
        ACKNOWLEDGED: 'https://w3id.org/xapi/dod-isd/verbs/acknowledged',
        ACTIVATED: 'https://w3id.org/xapi/dod-isd/verbs/activated',
        ACTUATED: 'https://w3id.org/xapi/dod-isd/verbs/actuated',
        ADAPTED: 'https://w3id.org/xapi/dod-isd/verbs/adapted',
        ADJUSTED: 'https://w3id.org/xapi/dod-isd/verbs/adjusted',
        ADMINISTERED: 'https://w3id.org/xapi/dod-isd/verbs/administered',
        ADVANCED: 'https://w3id.org/xapi/dod-isd/verbs/advanced',
        ADVISED: 'https://w3id.org/xapi/dod-isd/verbs/advised',
        ALERTED: 'https://w3id.org/xapi/dod-isd/verbs/alerted',
        ALIGNED: 'https://w3id.org/xapi/dod-isd/verbs/aligned',
        ALLOCATED: 'https://w3id.org/xapi/dod-isd/verbs/allocated',
        ALLOWED: 'https://w3id.org/xapi/dod-isd/verbs/allowed',
        ALTERED: 'https://w3id.org/xapi/dod-isd/verbs/altered',
        AMBUSHED: 'https://w3id.org/xapi/dod-isd/verbs/ambushed',
        ANALYZED: 'https://w3id.org/xapi/dod-isd/verbs/analyzed',
        ANNOTATED: 'https://w3id.org/xapi/dod-isd/verbs/annotated',
        ANNOUNCED: 'https://w3id.org/xapi/dod-isd/verbs/announced',
        ANSWERED: 'https://w3id.org/xapi/dod-isd/verbs/answered',
        APPLIED: 'https://w3id.org/xapi/dod-isd/verbs/applied',
        APPRAISED: 'https://w3id.org/xapi/dod-isd/verbs/appraised',
        APPRECIATED: 'https://w3id.org/xapi/dod-isd/verbs/appreciated',
        APPROVED: 'https://w3id.org/xapi/dod-isd/verbs/approved',
        ARCHIVED: 'https://w3id.org/xapi/dod-isd/verbs/archived',
        ARMED: 'https://w3id.org/xapi/dod-isd/verbs/armed',
        ARRANGED: 'https://w3id.org/xapi/dod-isd/verbs/arranged',
        ASKED: 'https://w3id.org/xapi/dod-isd/verbs/asked',
        ASSAULTED: 'https://w3id.org/xapi/dod-isd/verbs/assaulted',
        ASSEMBLED: 'https://w3id.org/xapi/dod-isd/verbs/assembled',
        ASSESSED: 'https://w3id.org/xapi/dod-isd/verbs/assessed',
        ASSIGNED: 'https://w3id.org/xapi/dod-isd/verbs/assigned',
        ASSISTED: 'https://w3id.org/xapi/dod-isd/verbs/assisted',
        ASSUMED: 'https://w3id.org/xapi/dod-isd/verbs/assumed',
        ATTACHED: 'https://w3id.org/xapi/dod-isd/verbs/attached',
        ATTACKED: 'https://w3id.org/xapi/dod-isd/verbs/attacked',
        ATTENDED_CLOSELY: 'https://w3id.org/xapi/dod-isd/verbs/attended-closely',
        AUTHENTICATED: 'https://w3id.org/xapi/dod-isd/verbs/authenticated',
        BALANCED: 'https://w3id.org/xapi/dod-isd/verbs/balanced',
        BELIEVED: 'https://w3id.org/xapi/dod-isd/verbs/believed',
        BREACHED: 'https://w3id.org/xapi/dod-isd/verbs/breached',
        BRIEFED: 'https://w3id.org/xapi/dod-isd/verbs/briefed',
        BYPASSED: 'https://w3id.org/xapi/dod-isd/verbs/bypassed',
        CALCULATED: 'https://w3id.org/xapi/dod-isd/verbs/calculated',
        CALIBRATED: 'https://w3id.org/xapi/dod-isd/verbs/calibrated',
        CAMOUFLAGED: 'https://w3id.org/xapi/dod-isd/verbs/camouflaged',
        CANCELED: 'https://w3id.org/xapi/dod-isd/verbs/canceled',
        CARRIED: 'https://w3id.org/xapi/dod-isd/verbs/carried',
        CATEGORIZED: 'https://w3id.org/xapi/dod-isd/verbs/categorized',
        CAUSED: 'https://w3id.org/xapi/dod-isd/verbs/caused',
        CENTERED: 'https://w3id.org/xapi/dod-isd/verbs/centered',
        CHALLENGED: 'https://w3id.org/xapi/dod-isd/verbs/challenged',
        CHANGED: 'https://w3id.org/xapi/dod-isd/verbs/changed',
        CHARGED: 'https://w3id.org/xapi/dod-isd/verbs/charged',
        CHECKED: 'https://w3id.org/xapi/dod-isd/verbs/checked',
        CHOSE: 'https://w3id.org/xapi/dod-isd/verbs/chose',
        CLASSIFIED: 'https://w3id.org/xapi/dod-isd/verbs/classified',
        CLEANED: 'https://w3id.org/xapi/dod-isd/verbs/cleaned',
        CLEARED: 'https://w3id.org/xapi/dod-isd/verbs/cleared',
        CLOSED: 'https://w3id.org/xapi/dod-isd/verbs/closed',
        COLLATED: 'https://w3id.org/xapi/dod-isd/verbs/collated',
        COLLECTED: 'https://w3id.org/xapi/dod-isd/verbs/collected',
        COMBINED: 'https://w3id.org/xapi/dod-isd/verbs/combined',
        COMMANDED: 'https://w3id.org/xapi/dod-isd/verbs/commanded',
        COMMUNICATED: 'https://w3id.org/xapi/dod-isd/verbs/communicated',
        COMPARED: 'https://w3id.org/xapi/dod-isd/verbs/compared',
        COMPILED: 'https://w3id.org/xapi/dod-isd/verbs/compiled',
        COMPLETED: 'https://w3id.org/xapi/dod-isd/verbs/completed',
        COMPLETED_ASSIGNMENT: 'https://w3id.org/xapi/dod-isd/verbs/completed-assignment',
        COMPLIED: 'https://w3id.org/xapi/dod-isd/verbs/complied',
        COMPOSED: 'https://w3id.org/xapi/dod-isd/verbs/composed',
        COMPUTED: 'https://w3id.org/xapi/dod-isd/verbs/computed',
        CONCEIVED: 'https://w3id.org/xapi/dod-isd/verbs/conceived',
        CONCLUDED: 'https://w3id.org/xapi/dod-isd/verbs/concluded',
        CONDENSED: 'https://w3id.org/xapi/dod-isd/verbs/condensed',
        CONDUCTED: 'https://w3id.org/xapi/dod-isd/verbs/conducted',
        CONFIRMED: 'https://w3id.org/xapi/dod-isd/verbs/confirmed',
        CONJECTURED: 'https://w3id.org/xapi/dod-isd/verbs/conjectured',
        CONNECTED: 'https://w3id.org/xapi/dod-isd/verbs/connected',
        CONSOLIDATED: 'https://w3id.org/xapi/dod-isd/verbs/consolidated',
        CONSTRUCTED: 'https://w3id.org/xapi/dod-isd/verbs/constructed',
        CONTRASTED: 'https://w3id.org/xapi/dod-isd/verbs/contrasted',
        CONTRIVED: 'https://w3id.org/xapi/dod-isd/verbs/contrived',
        CONTROLLED: 'https://w3id.org/xapi/dod-isd/verbs/controlled',
        CONVERTED: 'https://w3id.org/xapi/dod-isd/verbs/converted',
        COORDINATED: 'https://w3id.org/xapi/dod-isd/verbs/coordinated',
        CORRECTED: 'https://w3id.org/xapi/dod-isd/verbs/corrected',
        CORRELATED: 'https://w3id.org/xapi/dod-isd/verbs/correlated',
        COVERED: 'https://w3id.org/xapi/dod-isd/verbs/covered',
        CREATED: 'https://w3id.org/xapi/dod-isd/verbs/created',
        CREPT: 'https://w3id.org/xapi/dod-isd/verbs/crept',
        CRITICIZED: 'https://w3id.org/xapi/dod-isd/verbs/criticized',
        CROSS_CHECKED: 'https://w3id.org/xapi/dod-isd/verbs/cross-checked',
        CROSSED: 'https://w3id.org/xapi/dod-isd/verbs/crossed',
        DEBRIEFED: 'https://w3id.org/xapi/dod-isd/verbs/debriefed',
        DEBUGGED: 'https://w3id.org/xapi/dod-isd/verbs/debugged',
        DECIDED: 'https://w3id.org/xapi/dod-isd/verbs/decided',
        DECONTAMINATED: 'https://w3id.org/xapi/dod-isd/verbs/decontaminated',
        DEFENDED: 'https://w3id.org/xapi/dod-isd/verbs/defended',
        DEFINED: 'https://w3id.org/xapi/dod-isd/verbs/defined',
        DELAYED: 'https://w3id.org/xapi/dod-isd/verbs/delayed',
        DELETED: 'https://w3id.org/xapi/dod-isd/verbs/deleted',
        DELIVERED: 'https://w3id.org/xapi/dod-isd/verbs/delivered',
        DEMONSTRATED: 'https://w3id.org/xapi/dod-isd/verbs/demonstrated',
        DEPARTED: 'https://w3id.org/xapi/dod-isd/verbs/departed',
        DEPLOYED: 'https://w3id.org/xapi/dod-isd/verbs/deployed',
        DERIVED: 'https://w3id.org/xapi/dod-isd/verbs/derived',
        DESCRIBED: 'https://w3id.org/xapi/dod-isd/verbs/described',
        DESIGNATED: 'https://w3id.org/xapi/dod-isd/verbs/designated',
        DESIGNED: 'https://w3id.org/xapi/dod-isd/verbs/designed',
        DESTROYED: 'https://w3id.org/xapi/dod-isd/verbs/destroyed',
        DETECTED: 'https://w3id.org/xapi/dod-isd/verbs/detected',
        DETERMINED: 'https://w3id.org/xapi/dod-isd/verbs/determined',
        DEVELOPED: 'https://w3id.org/xapi/dod-isd/verbs/developed',
        DEVISED: 'https://w3id.org/xapi/dod-isd/verbs/devised',
        DIAGNOSED: 'https://w3id.org/xapi/dod-isd/verbs/diagnosed',
        DIAGRAMMED: 'https://w3id.org/xapi/dod-isd/verbs/diagrammed',
        DIFFERENTIATED: 'https://w3id.org/xapi/dod-isd/verbs/differentiated',
        DIRECTED: 'https://w3id.org/xapi/dod-isd/verbs/directed',
        DISASSEMBLED: 'https://w3id.org/xapi/dod-isd/verbs/disassembled',
        DISCONNECTED: 'https://w3id.org/xapi/dod-isd/verbs/disconnected',
        DISCOVERED: 'https://w3id.org/xapi/dod-isd/verbs/discovered',
        DISCRIMINATED: 'https://w3id.org/xapi/dod-isd/verbs/discriminated',
        DISENGAGED: 'https://w3id.org/xapi/dod-isd/verbs/disengaged',
        DISMANTLED: 'https://w3id.org/xapi/dod-isd/verbs/dismantled',
        DISPATCHED: 'https://w3id.org/xapi/dod-isd/verbs/dispatched',
        DISPLACED: 'https://w3id.org/xapi/dod-isd/verbs/displaced',
        DISPLAYED: 'https://w3id.org/xapi/dod-isd/verbs/displayed',
        DISPOSED: 'https://w3id.org/xapi/dod-isd/verbs/disposed',
        DISSEMINATED: 'https://w3id.org/xapi/dod-isd/verbs/disseminated',
        DISTINGUISHED: 'https://w3id.org/xapi/dod-isd/verbs/distinguished',
        DISTRIBUTED: 'https://w3id.org/xapi/dod-isd/verbs/distributed',
        DIVIDED: 'https://w3id.org/xapi/dod-isd/verbs/divided',
        DRAFTED: 'https://w3id.org/xapi/dod-isd/verbs/drafted',
        DREW: 'https://w3id.org/xapi/dod-isd/verbs/drew',
        DROVE: 'https://w3id.org/xapi/dod-isd/verbs/drove',
        DUG: 'https://w3id.org/xapi/dod-isd/verbs/dug',
        EDITED: 'https://w3id.org/xapi/dod-isd/verbs/edited',
        EFFECTED: 'https://w3id.org/xapi/dod-isd/verbs/effected',
        EGRESSED: 'https://w3id.org/xapi/dod-isd/verbs/egressed',
        ELABORATED: 'https://w3id.org/xapi/dod-isd/verbs/elaborated',
        ELEVATED: 'https://w3id.org/xapi/dod-isd/verbs/elevated',
        ELIMINATED: 'https://w3id.org/xapi/dod-isd/verbs/eliminated',
        EMPLACED: 'https://w3id.org/xapi/dod-isd/verbs/emplaced',
        EMPLOYED: 'https://w3id.org/xapi/dod-isd/verbs/employed',
        ENCODED: 'https://w3id.org/xapi/dod-isd/verbs/encoded',
        ENCRYPTED: 'https://w3id.org/xapi/dod-isd/verbs/encrypted',
        ENERGIZED: 'https://w3id.org/xapi/dod-isd/verbs/energized',
        ENFORCED: 'https://w3id.org/xapi/dod-isd/verbs/enforced',
        ENGAGED: 'https://w3id.org/xapi/dod-isd/verbs/engaged',
        ENSURED: 'https://w3id.org/xapi/dod-isd/verbs/ensured',
        ENTERED: 'https://w3id.org/xapi/dod-isd/verbs/entered',
        ESTABLISHED: 'https://w3id.org/xapi/dod-isd/verbs/established',
        ESTIMATED: 'https://w3id.org/xapi/dod-isd/verbs/estimated',
        EVACUATED: 'https://w3id.org/xapi/dod-isd/verbs/evacuated',
        EVADED: 'https://w3id.org/xapi/dod-isd/verbs/evaded',
        EVALUATED: 'https://w3id.org/xapi/dod-isd/verbs/evaluated',
        EXCHANGED: 'https://w3id.org/xapi/dod-isd/verbs/exchanged',
        EXECUTED: 'https://w3id.org/xapi/dod-isd/verbs/executed',
        EXPLAINED: 'https://w3id.org/xapi/dod-isd/verbs/explained',
        EXPRESSED: 'https://w3id.org/xapi/dod-isd/verbs/expressed',
        EXTENDED: 'https://w3id.org/xapi/dod-isd/verbs/extended',
        EXTRACTED: 'https://w3id.org/xapi/dod-isd/verbs/extracted',
        FELL: 'https://w3id.org/xapi/dod-isd/verbs/fell',
        FELT: 'https://w3id.org/xapi/dod-isd/verbs/felt',
        FILLED_OUT: 'https://w3id.org/xapi/dod-isd/verbs/filled-out',
        FINALIZED: 'https://w3id.org/xapi/dod-isd/verbs/finalized',
        FIRED: 'https://w3id.org/xapi/dod-isd/verbs/fired',
        FIT: 'https://w3id.org/xapi/dod-isd/verbs/fit',
        FOLLOWED: 'https://w3id.org/xapi/dod-isd/verbs/followed',
        FORMATTED: 'https://w3id.org/xapi/dod-isd/verbs/formatted',
        FORMULATED: 'https://w3id.org/xapi/dod-isd/verbs/formulated',
        FORWARDED: 'https://w3id.org/xapi/dod-isd/verbs/forwarded',
        FOUND: 'https://w3id.org/xapi/dod-isd/verbs/found',
        FUELED: 'https://w3id.org/xapi/dod-isd/verbs/fueled',
        GAVE: 'https://w3id.org/xapi/dod-isd/verbs/gave',
        GENERALIZED: 'https://w3id.org/xapi/dod-isd/verbs/generalized',
        GENERATED: 'https://w3id.org/xapi/dod-isd/verbs/generated',
        GROUNDED: 'https://w3id.org/xapi/dod-isd/verbs/grounded',
        GROUPED: 'https://w3id.org/xapi/dod-isd/verbs/grouped',
        GUARDED: 'https://w3id.org/xapi/dod-isd/verbs/guarded',
        GUIDED: 'https://w3id.org/xapi/dod-isd/verbs/guided',
        HARDENED: 'https://w3id.org/xapi/dod-isd/verbs/hardened',
        HEARD: 'https://w3id.org/xapi/dod-isd/verbs/heard',
        HELD: 'https://w3id.org/xapi/dod-isd/verbs/held',
        HOISTED: 'https://w3id.org/xapi/dod-isd/verbs/hoisted',
        HOVERED: 'https://w3id.org/xapi/dod-isd/verbs/hovered',
        HYPOTHESIZED: 'https://w3id.org/xapi/dod-isd/verbs/hypothesized',
        IDENTIFIED: 'https://w3id.org/xapi/dod-isd/verbs/identified',
        ILLUSTRATED: 'https://w3id.org/xapi/dod-isd/verbs/illustrated',
        IMAGINED: 'https://w3id.org/xapi/dod-isd/verbs/imagined',
        IMPLEMENTED: 'https://w3id.org/xapi/dod-isd/verbs/implemented',
        INDICATED: 'https://w3id.org/xapi/dod-isd/verbs/indicated',
        INFERRED: 'https://w3id.org/xapi/dod-isd/verbs/inferred',
        INFILTRATED: 'https://w3id.org/xapi/dod-isd/verbs/infiltrated',
        INFLUENCED: 'https://w3id.org/xapi/dod-isd/verbs/influenced',
        INFORMED: 'https://w3id.org/xapi/dod-isd/verbs/informed',
        INITIALIZED: 'https://w3id.org/xapi/dod-isd/verbs/initialized',
        INITIATED: 'https://w3id.org/xapi/dod-isd/verbs/initiated',
        INNOVATED: 'https://w3id.org/xapi/dod-isd/verbs/innovated',
        INPUT: 'https://w3id.org/xapi/dod-isd/verbs/input',
        INSERTED: 'https://w3id.org/xapi/dod-isd/verbs/inserted',
        INSPECTED: 'https://w3id.org/xapi/dod-isd/verbs/inspected',
        INSTALLED: 'https://w3id.org/xapi/dod-isd/verbs/installed',
        INSTRUCTED: 'https://w3id.org/xapi/dod-isd/verbs/instructed',
        INTEGRATED: 'https://w3id.org/xapi/dod-isd/verbs/integrated',
        INTERCEPTED: 'https://w3id.org/xapi/dod-isd/verbs/intercepted',
        INTERPRETED: 'https://w3id.org/xapi/dod-isd/verbs/interpreted',
        INVENTED: 'https://w3id.org/xapi/dod-isd/verbs/invented',
        INVESTIGATED: 'https://w3id.org/xapi/dod-isd/verbs/investigated',
        ISOLATED: 'https://w3id.org/xapi/dod-isd/verbs/isolated',
        ISSUED: 'https://w3id.org/xapi/dod-isd/verbs/issued',
        JACKED: 'https://w3id.org/xapi/dod-isd/verbs/jacked',
        JUDGED: 'https://w3id.org/xapi/dod-isd/verbs/judged',
        JUSTIFIED: 'https://w3id.org/xapi/dod-isd/verbs/justified',
        LABELED: 'https://w3id.org/xapi/dod-isd/verbs/labeled',
        LAID: 'https://w3id.org/xapi/dod-isd/verbs/laid',
        LANDED: 'https://w3id.org/xapi/dod-isd/verbs/landed',
        LAUNCHED: 'https://w3id.org/xapi/dod-isd/verbs/launched',
        LED: 'https://w3id.org/xapi/dod-isd/verbs/led',
        LEVELED: 'https://w3id.org/xapi/dod-isd/verbs/leveled',
        LIFTED: 'https://w3id.org/xapi/dod-isd/verbs/jumped',
        LISTED: 'https://w3id.org/xapi/dod-isd/verbs/listed',
        LISTENED: 'https://w3id.org/xapi/dod-isd/verbs/listened',
        LISTENED_ATTENTIVELY: 'https://w3id.org/xapi/dod-isd/verbs/listened-attentively',
        LOADED: 'https://w3id.org/xapi/dod-isd/verbs/loaded',
        LOCATED: 'https://w3id.org/xapi/dod-isd/verbs/located',
        LOGGED: 'https://w3id.org/xapi/dod-isd/verbs/logged',
        LUBRICATED: 'https://w3id.org/xapi/dod-isd/verbs/lubricated',
        MADE: 'https://w3id.org/xapi/dod-isd/verbs/made',
        MAINTAINED: 'https://w3id.org/xapi/dod-isd/verbs/maintained',
        MANAGED: 'https://w3id.org/xapi/dod-isd/verbs/managed',
        MANEUVERED: 'https://w3id.org/xapi/dod-isd/verbs/maneuvered',
        MANIPULATED: 'https://w3id.org/xapi/dod-isd/verbs/manipulated',
        MAPPED: 'https://w3id.org/xapi/dod-isd/verbs/mapped',
        MATCHED: 'https://w3id.org/xapi/dod-isd/verbs/matched',
        MEASURED: 'https://w3id.org/xapi/dod-isd/verbs/measured',
        MODIFIED: 'https://w3id.org/xapi/dod-isd/verbs/modified',
        MONITORED: 'https://w3id.org/xapi/dod-isd/verbs/monitored',
        MOUNTED: 'https://w3id.org/xapi/dod-isd/verbs/mounted',
        MOVED: 'https://w3id.org/xapi/dod-isd/verbs/moved',
        NAMED: 'https://w3id.org/xapi/dod-isd/verbs/named',
        NAVIGATED: 'https://w3id.org/xapi/dod-isd/verbs/navigated',
        NEUTRALIZED: 'https://w3id.org/xapi/dod-isd/verbs/neutralized',
        NOTIFIED: 'https://w3id.org/xapi/dod-isd/verbs/notified',
        OBEYED_RULES: 'https://w3id.org/xapi/dod-isd/verbs/obeyed-rules',
        OBSERVED: 'https://w3id.org/xapi/dod-isd/verbs/observed',
        OBTAINED: 'https://w3id.org/xapi/dod-isd/verbs/obtained',
        OCCUPIED: 'https://w3id.org/xapi/dod-isd/verbs/occupied',
        OPENED: 'https://w3id.org/xapi/dod-isd/verbs/opened',
        OPERATED: 'https://w3id.org/xapi/dod-isd/verbs/operated',
        ORDERED: 'https://w3id.org/xapi/dod-isd/verbs/ordered',
        ORGANIZED: 'https://w3id.org/xapi/dod-isd/verbs/organized',
        ORIENTED: 'https://w3id.org/xapi/dod-isd/verbs/oriented',
        ORIGINATED: 'https://w3id.org/xapi/dod-isd/verbs/originated',
        OUTLINED: 'https://w3id.org/xapi/dod-isd/verbs/outlined',
        PACKED: 'https://w3id.org/xapi/dod-isd/verbs/packed',
        PARKED: 'https://w3id.org/xapi/dod-isd/verbs/parked',
        PATROLLED: 'https://w3id.org/xapi/dod-isd/verbs/patrolled',
        PAUSED: 'https://w3id.org/xapi/dod-isd/verbs/paused',
        PERCEIVED: 'https://w3id.org/xapi/dod-isd/verbs/perceived',
        PERFORMED: 'https://w3id.org/xapi/dod-isd/verbs/performed',
        PLACED: 'https://w3id.org/xapi/dod-isd/verbs/placed',
        PLANNED: 'https://w3id.org/xapi/dod-isd/verbs/planned',
        PLOTTED: 'https://w3id.org/xapi/dod-isd/verbs/plotted',
        POLICED: 'https://w3id.org/xapi/dod-isd/verbs/policed',
        POSITIONED: 'https://w3id.org/xapi/dod-isd/verbs/positioned',
        POSTED: 'https://w3id.org/xapi/dod-isd/verbs/posted',
        PREDICTED: 'https://w3id.org/xapi/dod-isd/verbs/predicted',
        PREPARED: 'https://w3id.org/xapi/dod-isd/verbs/prepared',
        PRESCRIBED: 'https://w3id.org/xapi/dod-isd/verbs/prescribed',
        PRESSED: 'https://w3id.org/xapi/dod-isd/verbs/pressed',
        PRESSURIZED: 'https://w3id.org/xapi/dod-isd/verbs/pressurized',
        PREVENTED: 'https://w3id.org/xapi/dod-isd/verbs/prevented',
        PRIMED: 'https://w3id.org/xapi/dod-isd/verbs/primed',
        PRIORITIZED: 'https://w3id.org/xapi/dod-isd/verbs/prioritized',
        PROCESSED: 'https://w3id.org/xapi/dod-isd/verbs/processed',
        PROCURED: 'https://w3id.org/xapi/dod-isd/verbs/procured',
        PRODUCED: 'https://w3id.org/xapi/dod-isd/verbs/produced',
        PROGRAMMED: 'https://w3id.org/xapi/dod-isd/verbs/programmed',
        PROJECTED: 'https://w3id.org/xapi/dod-isd/verbs/projected',
        PROPOSED: 'https://w3id.org/xapi/dod-isd/verbs/proposed',
        PROTECTED: 'https://w3id.org/xapi/dod-isd/verbs/protected',
        PROVIDED: 'https://w3id.org/xapi/dod-isd/verbs/provided',
        PUBLISHED: 'https://w3id.org/xapi/dod-isd/verbs/published',
        PULLED: 'https://w3id.org/xapi/dod-isd/verbs/pulled',
        QUALIFIED: 'https://w3id.org/xapi/dod-isd/verbs/qualified',
        QUEUED: 'https://w3id.org/xapi/dod-isd/verbs/queued',
        RAISED: 'https://w3id.org/xapi/dod-isd/verbs/raised',
        RAN: 'https://w3id.org/xapi/dod-isd/verbs/ran',
        RANGED: 'https://w3id.org/xapi/dod-isd/verbs/ranged',
        RANKED: 'https://w3id.org/xapi/dod-isd/verbs/ranked',
        REACHED: 'https://w3id.org/xapi/dod-isd/verbs/reached',
        REACTED: 'https://w3id.org/xapi/dod-isd/verbs/reacted',
        READ: 'https://w3id.org/xapi/dod-isd/verbs/read',
        READIED: 'https://w3id.org/xapi/dod-isd/verbs/readied',
        REALIGNED: 'https://w3id.org/xapi/dod-isd/verbs/realigned',
        REASSESSED: 'https://w3id.org/xapi/dod-isd/verbs/reassessed',
        RECALLED: 'https://w3id.org/xapi/dod-isd/verbs/recalled',
        RECEIVED: 'https://w3id.org/xapi/dod-isd/verbs/received',
        RECOGNIZED: 'https://w3id.org/xapi/dod-isd/verbs/recognized',
        RECOMMENDED: 'https://w3id.org/xapi/dod-isd/verbs/recommended',
        RECONCILED: 'https://w3id.org/xapi/dod-isd/verbs/reconciled',
        RECONNOITERED: 'https://w3id.org/xapi/dod-isd/verbs/reconnoitered',
        RECORDED: 'https://w3id.org/xapi/dod-isd/verbs/recorded',
        RECOUNTED: 'https://w3id.org/xapi/dod-isd/verbs/recounted',
        RECOVERED: 'https://w3id.org/xapi/dod-isd/verbs/recovered',
        REDISTRIBUTED: 'https://w3id.org/xapi/dod-isd/verbs/redistributed',
        REDUCED: 'https://w3id.org/xapi/dod-isd/verbs/reduced',
        REESTABLISHED: 'https://w3id.org/xapi/dod-isd/verbs/reestablished',
        REEXAMINED: 'https://w3id.org/xapi/dod-isd/verbs/reexamined',
        REFUELED: 'https://w3id.org/xapi/dod-isd/verbs/refueled',
        REGULATED: 'https://w3id.org/xapi/dod-isd/verbs/regulated',
        RELEASED: 'https://w3id.org/xapi/dod-isd/verbs/released',
        RELIEVED: 'https://w3id.org/xapi/dod-isd/verbs/relieved',
        RELOCATED: 'https://w3id.org/xapi/dod-isd/verbs/relocated',
        REMOVED: 'https://w3id.org/xapi/dod-isd/verbs/removed',
        REORGANIZED: 'https://w3id.org/xapi/dod-isd/verbs/reorganized',
        REPAIRED: 'https://w3id.org/xapi/dod-isd/verbs/repaired',
        REPLACED: 'https://w3id.org/xapi/dod-isd/verbs/replaced',
        REPLENISHED: 'https://w3id.org/xapi/dod-isd/verbs/replenished',
        REPORTED: 'https://w3id.org/xapi/dod-isd/verbs/reported',
        REQUESTED: 'https://w3id.org/xapi/dod-isd/verbs/requested',
        RESET: 'https://w3id.org/xapi/dod-isd/verbs/reset',
        RESOLVED: 'https://w3id.org/xapi/dod-isd/verbs/resolved',
        RESPONDED: 'https://w3id.org/xapi/dod-isd/verbs/responded',
        RESTATED: 'https://w3id.org/xapi/dod-isd/verbs/restated',
        RESUMED: 'https://w3id.org/xapi/dod-isd/verbs/resumed',
        RETRIEVED: 'https://w3id.org/xapi/dod-isd/verbs/retrieved',
        RETURNED: 'https://w3id.org/xapi/dod-isd/verbs/returned',
        REVIEWED: 'https://w3id.org/xapi/dod-isd/verbs/reviewed',
        REVISED: 'https://w3id.org/xapi/dod-isd/verbs/revised',
        ROTATED: 'https://w3id.org/xapi/dod-isd/verbs/rotated',
        ROUTED: 'https://w3id.org/xapi/dod-isd/verbs/routed',
        SAVED: 'https://w3id.org/xapi/dod-isd/verbs/saved',
        SAW: 'https://w3id.org/xapi/dod-isd/verbs/saw',
        SCANNED: 'https://w3id.org/xapi/dod-isd/verbs/scanned',
        SCHEDULED: 'https://w3id.org/xapi/dod-isd/verbs/scheduled',
        SEARCHED: 'https://w3id.org/xapi/dod-isd/verbs/searched',
        SECURED: 'https://w3id.org/xapi/dod-isd/verbs/secured',
        SELECTED: 'https://w3id.org/xapi/dod-isd/verbs/selected',
        SENT: 'https://w3id.org/xapi/dod-isd/verbs/sent',
        SEPARATED: 'https://w3id.org/xapi/dod-isd/verbs/separated',
        SERVED: 'https://w3id.org/xapi/dod-isd/verbs/served',
        SERVICED: 'https://w3id.org/xapi/dod-isd/verbs/serviced',
        SET: 'https://w3id.org/xapi/dod-isd/verbs/set',
        SET_UP: 'https://w3id.org/xapi/dod-isd/verbs/set-up',
        SHARED: 'https://w3id.org/xapi/dod-isd/verbs/shared',
        SHOWED: 'https://w3id.org/xapi/dod-isd/verbs/showed',
        SHOWED_AWARENESS: 'https://w3id.org/xapi/dod-isd/verbs/showed-awareness',
        SHOWED_SENSITIVITY: 'https://w3id.org/xapi/dod-isd/verbs/showed-sensitivity',
        SHUT_DOWN: 'https://w3id.org/xapi/dod-isd/verbs/shut-down',
        SIGHTED: 'https://w3id.org/xapi/dod-isd/verbs/sighted',
        SIGNALED: 'https://w3id.org/xapi/dod-isd/verbs/signaled',
        SMELLED: 'https://w3id.org/xapi/dod-isd/verbs/smelled',
        SOLVED: 'https://w3id.org/xapi/dod-isd/verbs/solved',
        SORTED: 'https://w3id.org/xapi/dod-isd/verbs/sorted',
        SPECIFIED: 'https://w3id.org/xapi/dod-isd/verbs/specified',
        SPLINTED: 'https://w3id.org/xapi/dod-isd/verbs/splinted',
        SQUEEZED: 'https://w3id.org/xapi/dod-isd/verbs/squeezed',
        STARTED: 'https://w3id.org/xapi/dod-isd/verbs/started',
        STATED: 'https://w3id.org/xapi/dod-isd/verbs/stated',
        STAYED: 'https://w3id.org/xapi/dod-isd/verbs/stayed',
        STEERED: 'https://w3id.org/xapi/dod-isd/verbs/steered',
        STOCKPILED: 'https://w3id.org/xapi/dod-isd/verbs/stockpiled',
        STOOD_TO: 'https://w3id.org/xapi/dod-isd/verbs/stood-to',
        STOPPED: 'https://w3id.org/xapi/dod-isd/verbs/stopped',
        STORED: 'https://w3id.org/xapi/dod-isd/verbs/stored',
        STOWED: 'https://w3id.org/xapi/dod-isd/verbs/stowed',
        STRUCK: 'https://w3id.org/xapi/dod-isd/verbs/struck',
        STUDIED: 'https://w3id.org/xapi/dod-isd/verbs/studied',
        SUBMITTED: 'https://w3id.org/xapi/dod-isd/verbs/submitted',
        SUMMARIZED: 'https://w3id.org/xapi/dod-isd/verbs/summarized',
        SUPERVISED: 'https://w3id.org/xapi/dod-isd/verbs/supervised',
        SUPPORTED: 'https://w3id.org/xapi/dod-isd/verbs/supported',
        SUPPRESSED: 'https://w3id.org/xapi/dod-isd/verbs/suppressed',
        SWAM: 'https://w3id.org/xapi/dod-isd/verbs/swam',
        SWEPT: 'https://w3id.org/xapi/dod-isd/verbs/swept',
        SYNTHESIZED: 'https://w3id.org/xapi/dod-isd/verbs/synthesized',
        TAILORED: 'https://w3id.org/xapi/dod-isd/verbs/tailored',
        TAPPED: 'https://w3id.org/xapi/dod-isd/verbs/tapped',
        TASKED: 'https://w3id.org/xapi/dod-isd/verbs/tasked',
        TASTED: 'https://w3id.org/xapi/dod-isd/verbs/tasted',
        TEMPERED: 'https://w3id.org/xapi/dod-isd/verbs/tempered',
        TEMPLATED: 'https://w3id.org/xapi/dod-isd/verbs/templated',
        TESTED: 'https://w3id.org/xapi/dod-isd/verbs/tested',
        THREW: 'https://w3id.org/xapi/dod-isd/verbs/threw',
        TIGHTENED: 'https://w3id.org/xapi/dod-isd/verbs/tightened',
        TOLD: 'https://w3id.org/xapi/dod-isd/verbs/told',
        TOOK: 'https://w3id.org/xapi/dod-isd/verbs/took',
        TOOK_CHARGE: 'https://w3id.org/xapi/dod-isd/verbs/took-charge',
        TOOK_OFF: 'https://w3id.org/xapi/dod-isd/verbs/took-off',
        TRACED: 'https://w3id.org/xapi/dod-isd/verbs/traced',
        TRACKED: 'https://w3id.org/xapi/dod-isd/verbs/tracked',
        TRAINED: 'https://w3id.org/xapi/dod-isd/verbs/trained',
        TRANSFERRED: 'https://w3id.org/xapi/dod-isd/verbs/transferred',
        TRANSLATED: 'https://w3id.org/xapi/dod-isd/verbs/translated',
        TRANSMITTED: 'https://w3id.org/xapi/dod-isd/verbs/transmitted',
        TRANSPORTED: 'https://w3id.org/xapi/dod-isd/verbs/transported',
        TRAVERSED: 'https://w3id.org/xapi/dod-isd/verbs/traversed',
        TREATED: 'https://w3id.org/xapi/dod-isd/verbs/treated',
        TRIAGED: 'https://w3id.org/xapi/dod-isd/verbs/triaged',
        TROUBLESHOT: 'https://w3id.org/xapi/dod-isd/verbs/troubleshot',
        TUNED: 'https://w3id.org/xapi/dod-isd/verbs/tuned',
        TURNED: 'https://w3id.org/xapi/dod-isd/verbs/turned',
        TWISTED: 'https://w3id.org/xapi/dod-isd/verbs/twisted',
        TYPED: 'https://w3id.org/xapi/dod-isd/verbs/typed',
        UNLOADED: 'https://w3id.org/xapi/dod-isd/verbs/unloaded',
        UPDATED: 'https://w3id.org/xapi/dod-isd/verbs/updated',
        USED: 'https://w3id.org/xapi/dod-isd/verbs/used',
        UTILIZED: 'https://w3id.org/xapi/dod-isd/verbs/utilized',
        VALIDATED: 'https://w3id.org/xapi/dod-isd/verbs/validated',
        VERIFIED: 'https://w3id.org/xapi/dod-isd/verbs/verified',
        VISUALIZED: 'https://w3id.org/xapi/dod-isd/verbs/visualized',
        WAITED: 'https://w3id.org/xapi/dod-isd/verbs/waited',
        WAR_GAMED: 'https://w3id.org/xapi/dod-isd/verbs/war-gamed',
        WORE: 'https://w3id.org/xapi/dod-isd/verbs/wore',
        WROTE: 'https://w3id.org/xapi/dod-isd/verbs/wrote',
        ZEROED: 'https://w3id.org/xapi/dod-isd/verbs/zeroed',
    },
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        CATEGORY: 'https://w3id.org/xapi/dod-isd/extensions/category',
        INTERACTIVITY_LEVEL: 'https://w3id.org/xapi/dod-isd/extensions/interactivity-level',
        KSA: 'https://w3id.org/xapi/dod-isd/extensions/ksa',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const EDACOURSEPROFILE = Object.freeze({
    CATEGORYID: 'https://profiles.adlnet.gov/xapi/90feff49-3709-460a-855a-0025d0b12ab7/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const EMOTIONAPIPROFILE = Object.freeze({
    CATEGORYID: 'https://profiles.adlnet.gov/xapi/4a1d0786-1de4-4941-9edc-2513b5c83a17/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {
        AROUSAL: 'https://profiles.adlnet.gov/xapi/4a1d0786-1de4-4941-9edc-2513b5c83a17/extension/arousal',
        VALENCE: 'https://profiles.adlnet.gov/xapi/4a1d0786-1de4-4941-9edc-2513b5c83a17/extension/valence',
    },
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const FEEDBACKINTERACTIONPROFILE = Object.freeze({
    CATEGORYID: 'https://xapi.com.au/profiles/feedback-interaction/v1.0/v/2',
    VERBS: {
        COMMENTED: 'https://w3id.org/xapi/adb/verbs/commented',
        RATED: 'https://w3id.org/xapi/acrossx/verbs/rated',
    },
    ACTIVITYTYPES: {
        FEEDBACK_INTERACTION: 'https://xapi.com.au/activities/feedback',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {
        COMMENT_TEXT: 'https://xapi.com.au/extensions/comment-text',
        STAR_RATING: 'https://xapi.com.au/extensions/star-rating',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const FLASHCARDSPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/flashcards/v0.1',
    VERBS: {},
    ACTIVITYTYPES: {
        FLASHCARD: 'https://w3id.org/xapi/flashcards/activity-types/flashcard',
        FLASHCARD_DECK: 'https://w3id.org/xapi/flashcards/activity-types/flashcard-deck',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const FLYINGPROFILE = Object.freeze({
    CATEGORYID: 'https://pttportal.af.mil/xapi/profile/flying/v/1',
    VERBS: {},
    ACTIVITYTYPES: {
        FLIGHT_OPERATION: 'https://pttportal.af.mil/xapi/activity-type/flight-operation',
        MANEUVER: 'https://pttportal.af.mil/xapi/activity-type/maneuver',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const GBLXAPIK12EDUCATIONAPPSPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/gblxapi/v1.0',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {
        DIFFICULTY: 'https://w3id.org/xapi.gblxapi/extensions/difficulty',
    },
    CONTEXTEXTENSION: {
        ACTION: 'https://w3id.org/xapi/gblxapi/extensions/action',
        DOMAIN: 'https://w3id.org/xapi/gblxapi/extensions/domain',
        FOCUS: 'https://w3id.org/xapi/gblxapi/extensions/focus',
        GRADE: 'https://w3id.org/xapi/gblxapi/extensions/grade',
        SKILL: 'https://w3id.org/xapi/gblxapi/extensions/skill',
        SUBDOMAIN: 'https://w3id.org/xapi/gblxapi/extensions/subdomain',
        TOPIC: 'https://w3id.org/xapi/gblxapi/extensions/topic',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const GENERALVOCABULARYPROFILE = Object.freeze({
    CATEGORYID: 'https://pttportal.af.mil/xapi/profile/vocab/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const GEOLOCATIONPROFILE = Object.freeze({
    CATEGORYID: 'https://xapi.org.au/geolocationprofile/v/1',
    VERBS: {
        CHECKED_IN: 'https://xapi.org.au/geolocationprofileprofile/verb/checkedin/',
        CHECKED_OUT: 'https://xapi.org.au/geolocationprofileprofile/verb/checkedout/',
        FINISHED: 'https://xapi.org.au/geolocationprofileprofile/verb/finished',
    },
    ACTIVITYTYPES: {
        PLACE: 'https://xapi.org.au/geolocationprofileprofile/activity/place',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const GROUNDTRAININGPROFILE = Object.freeze({
    CATEGORYID: 'https://pttportal.af.mil/xapi/profile/ground-training/v/1',
    VERBS: {},
    ACTIVITYTYPES: {
        GROUND_TRAINING_ASSESSMENT: 'https://pttportal.af.mil/xapi/activity-type/ground-training-assessment',
        GROUND_TRAINING_LESSON: 'https://pttportal.af.mil/xapi/activity-type/ground-training-lesson',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const HROPENASSESSMENTSPROFILE = Object.freeze({
    CATEGORYID: 'http://profiles.usalearning.net/xapi/043b24b4-4389-435f-b052-805fd5563166/v/2',
    VERBS: {
        CHOOSE: 'https://w3id.org/xapi/hros-asessment/verbs/chooses',
        DESIGNED: 'https://w3id.org/xapi/hros-asessment/verbs/designed',
        EMULATED: 'https://w3id.org/xapi/hros-asessment/verbs/emulated',
        PERFORMED: 'https://w3id.org/xapi/hros-asessment/verbs/performed',
        RECORDED: 'https://w3id.org/xapi/hros-asessment/verbs/recorded',
        SELECTED: 'https://w3id.org/xapi/hros-asessment/verbs/selected',
        SIMULATED: 'https://w3id.org/xapi/hros-asessment/verbs/simulated',
        SOLVED: 'https://w3id.org/xapi/HROSAsessment/v1.0/verbs/solved',
        SOLVED_2: 'https://w3id.org/xapi/hros-asessment/verbs/solved',
        WROTE: 'https://w3id.org/xapi/hros-asessment/verbs/writes',
    },
    ACTIVITYTYPES: {
        AUDIO: 'https://w3id.org/xapi/hros-asessment/activitytypes/audio',
        CODE_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/codeassessment',
        FIELD_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/fieldassessment',
        LEADERSHIP_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/leadershipassessment',
        PERSONALITY_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/personalityassessment',
        POLICE_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/policeassessment',
        PSYCHOMETRIC_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/psychometricassessment',
        VIRTUAL_REALITY_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/vrassessment',
        WORK_SAMPLE_ASSESSMENT: 'https://w3id.org/xapi/hros-asessment/activitytypes/worksampleassessment',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const HYFLEXCLASSROOMPROFILE = Object.freeze({
    CATEGORYID: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/v/2',
    VERBS: {
        DRWAING: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/verb/drawing',
        KICK: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/verb/kick',
        PROOFREAD: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/verb/proofread',
        RECORD_VIDEO: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/verb/record',
        REVISE: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/verb/revise',
    },
    ACTIVITYTYPES: {
        CLASS_SECTION: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/class-section',
        CONCENTRATION: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/concentration',
        FEEDBACK_ON_CLASS: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/feedback',
        HIGHLIGHT_VIDEO: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/highlight-video',
        PHOTO: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/photo',
        SECOND_DEVICE: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/second-device',
        SPEAK: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/speak',
        WHISPER: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/activitytype/whisper',
    },
    ACTIVITYEXTENSION: {
        TYPE_OF_QUIZ: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/extension/type-of-quiz',
    },
    CONTEXTEXTENSION: {
        CLASSROOM_SUBJECT: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/extension/classroom-subject',
        LEARNING_TOOL: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/extension/learning-tool',
        PARTICIPATION_MODE: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/extension/participation-mode',
    },
    RESULTEXTENSION: {
        ACCURACY_RATE: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/extension/accuracy-rate',
        PROGRESS_RATE: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/extension/progress-rate',
        SATISFACTION_SCORE: 'https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/extension/satisfaction-score',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE = Object.freeze({
    CATEGORYID: 'http://profiles.usalearning.net/xapi/5eda3789-9801-4dcc-ae22-9971b2a31871/v/9',
    VERBS: {
        RETURNED_LTI: 'http://profiles.usalearning.net/xapi/5eda3789-9801-4dcc-ae22-9971b2a31871/verb/returned-lti',
        USED_LTI: 'http://profiles.usalearning.net/xapi/5eda3789-9801-4dcc-ae22-9971b2a31871/verb/lti-used',
    },
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        FEDERATED_SESSION_ID: 'http://profiles.usalearning.net/xapi/5eda3789-9801-4dcc-ae22-9971b2a31871/extension/federated-session-id',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const INITIALIZEDHHINITPROFILE = Object.freeze({
    CATEGORYID: 'https://profiles.adlnet.gov/xapi/b0085953-4e4e-4429-ba4e-afd6746095c4/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const LANGUAGEEXPERIMENTPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/langexperiment/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const LEARNINGMANAGEMENTSYSTEMPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/lms/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        ENDING_DATE: 'https://w3id.org/xapi/lms/extensions/ending-date',
        ROLE: 'https://w3id.org/xapi/lms/extensions/role',
        STARTING_DATE: 'https://w3id.org/xapi/lms/extensions/starting-date',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const TLAPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/tla/v/4',
    VERBS: {
        APPRAISED: 'https://w3id.org/xapi/tla/verbs/appraised',
        APPROVED: 'https://w3id.org/xapi/tla/verbs/approved',
        ASSERTED: 'https://w3id.org/xapi/tla/verbs/asserted',
        ASSESSED: 'https://w3id.org/xapi/tla/verbs/assessed',
        ATTENDED: 'https://w3id.org/xapi/tla/verbs/attended',
        CAPTURED: 'https://w3id.org/xapi/tla/verbs/captured',
        CERTIFIED: 'https://w3id.org/xapi/tla/verbs/certified',
        CLARIFIED: 'https://w3id.org/xapi/tla/verbs/clarified',
        CONFERRED: 'https://w3id.org/xapi/tla/verbs/conferred',
        CONTEXTUALIZED: 'https://w3id.org/xapi/tla/verbs/contextualized',
        DESELECTED: 'https://w3id.org/xapi/tla/verbs/deselected',
        DETAILED: 'https://w3id.org/xapi/tla/verbs/detailed',
        DIRECTED: 'https://w3id.org/xapi/tla/verbs/directed',
        EMPLOYED: 'https://w3id.org/xapi/tla/verbs/employed',
        EVALUATED: 'https://w3id.org/xapi/tla/verbs/evaluated',
        EXPERIENCED: 'https://w3id.org/xapi/tla/verbs/experienced',
        EXPLORED: 'https://w3id.org/xapi/tla/verbs/explored',
        INFERRED: 'https://w3id.org/xapi/tla/verbs/inferred',
        LOCATED: 'https://w3id.org/xapi/tla/verbs/located',
        MASTERED: 'https://w3id.org/xapi/tla/verbs/mastered',
        MOBILIZED: 'https://w3id.org/xapi/tla/verbs/mobilized',
        ORGANIZED: 'https://w3id.org/xapi/tla/verbs/organized',
        PLANNED: 'https://w3id.org/xapi/tla/verbs/planned',
        PRIORITIZED: 'https://w3id.org/xapi/tla/verbs/prioritized',
        PROJECTED: 'https://w3id.org/xapi/tla/verbs/projected',
        PROMOTED: 'https://w3id.org/xapi/tla/verbs/promoted',
        QUALIFIED: 'https://w3id.org/xapi/tla/verbs/qualified',
        RECOMMENDED: 'https://w3id.org/xapi/tla/verbs/recommended',
        RECRUITED: 'https://w3id.org/xapi/tla/verbs/recruited',
        REGISTERED: 'https://w3id.org/xapi/tla/verbs/registered',
        RELEASED: 'https://w3id.org/xapi/tla/verbs/released',
        RESTRICTED: 'https://w3id.org/xapi/tla/verbs/restricted',
        RESUMED: 'https://w3id.org/xapi/tla/verbs/resumed',
        SCHEDULED: 'https://w3id.org/xapi/tla/verbs/scheduled',
        SCHOOLED: 'https://w3id.org/xapi/tla/verbs/schooled',
        SCORED: 'https://w3id.org/xapi/tla/verbs/scored',
        SCREENED: 'https://w3id.org/xapi/tla/verbs/screened',
        SELECTED: 'https://w3id.org/xapi/tla/verbs/selected',
        SOCIALIZED: 'https://w3id.org/xapi/tla/verbs/socialized',
        SURVEYED: 'https://w3id.org/xapi/tla/verbs/surveyed',
        SUSPENDED: 'https://w3id.org/xapi/tla/verbs/suspended',
        TRACKED: 'https://w3id.org/xapi/tla/verbs/tracked',
        TRANSITIONED: 'https://w3id.org/xapi/tla/verbs/transitioned',
        VALIDATED: 'https://w3id.org/xapi/tla/verbs/validated',
        VERIFIED: 'https://w3id.org/xapi/tla/verbs/verified',
    },
    ACTIVITYTYPES: {
        ACTIVITY: 'https://w3id.org/xapi/tla/activity-types/activity',
        ASSESSMENT: 'https://w3id.org/xapi/tla/activity-types/assessment',
        BADGE: 'https://w3id.org/xapi/tla/activity-types/badge',
        CAREER: 'https://w3id.org/xapi/tla/activity-types/career',
        CAREER_STATE: 'https://w3id.org/xapi/tla/activity-types/career_state',
        COMPETENCY: 'https://w3id.org/xapi/tla/activity-types/competency',
        CONTENT_SET: 'https://w3id.org/xapi/tla/activity-types/content_set',
        CREDENTIAL: 'https://w3id.org/xapi/tla/activity-types/credential',
        JOB_DUTY_GIG: 'https://w3id.org/xapi/tla/activity-types/job_duty_gig',
    },
    ACTIVITYEXTENSION: {
        INSTANCE: 'https://w3id.org/xapi/tla/extensions/instance',
    },
    CONTEXTEXTENSION: {
        CONFIDENCE: 'https://w3id.org/xapi/tla/extensions/confidence',
        DEP: 'https://w3id.org/xapi/tla/extensions/DEP',
        DUE_DATE: 'https://w3id.org/xapi/tla/extensions/due_date',
        EVIDENCE: 'https://w3id.org/xapi/tla/extensions/evidence',
        EXPIRATION: 'https://w3id.org/xapi/tla/extensions/expiration',
        LOCATION: 'https://w3id.org/xapi/tla/extensions/location',
        PERMANENT_CHANGE_OF_STATION: 'https://w3id.org/xapi/tla/extensions/permanent_change_of_station',
        REASON: 'https://w3id.org/xapi/tla/extensions/reason',
        RESTRICTION_REASON: 'https://w3id.org/xapi/tla/extensions/restriction',
        UNIT_IDENTIFICATION_CODE: 'https://w3id.org/xapi/tla/extensions/unit_identification_code',
    },
    RESULTEXTENSION: {
        RECOMMENDATION_ORDER: 'https://w3id.org/xapi/tla/extensions/recommendation_order',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const NAVYASSESSMENTPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/netc-assessment/v/3',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {
        EXTENDED_INTERACTION_TYPE: 'https://w3id.org/xapi/netc-assessment/extensions/activity/extended-interaction-type',
        INTERACTION_ID_NUMBER: 'https://w3id.org/xapi/netc-assessment/extensions/activity/id-number',
    },
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {
        RESPONSE_EXPLANATION: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-explanation',
        RESPONSE_TYPE: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-type',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const NAVYCOMMONREFERENCEPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/netc/v/3',
    VERBS: {
        ACCESSED: 'https://w3id.org/xapi/netc/verbs/accessed',
        CLOSED: 'https://w3id.org/xapi/netc/verbs/closed',
        OPENED: 'https://w3id.org/xapi/netc/verbs/opened',
        PRINTED: 'https://w3id.org/xapi/netc/verbs/printed',
        UPLOADED: 'https://w3id.org/xapi/netc/verbs/uploaded',
    },
    ACTIVITYTYPES: {
        MENU: 'https://w3id.org/xapi/netc/activity-types/menu',
        MENU_ITEM: 'https://w3id.org/xapi/netc/activity-types/menu-item',
        ORGANIZATION: 'https://w3id.org/xapi/netc/activity-types/organization',
    },
    ACTIVITYEXTENSION: {
        COA_ID: 'https://w3id.org/xapi/netc/extensions/coa-id',
        RESOURCE_URL: 'https://w3id.org/xapi/netc/extensions/resource-url',
        TARGET_AUDIENCE: 'https://w3id.org/xapi/netc/extensions/target-audience',
        TARGET_RATING: 'https://w3id.org/xapi/netc/extensions/target-rating',
    },
    CONTEXTEXTENSION: {
        COURSE_ID_NUMBER: 'https://w3id.org/xapi/netc/extensions/course-id-number',
        FEEDBACK_TARGET: 'https://w3id.org/xapi/netc/extensions/feedback-target',
        HULL_APPLICABILITY: 'https://w3id.org/xapi/netc/extensions/hull-applicability',
        HULL_CONFIGURATION: 'https://w3id.org/xapi/netc/extensions/hull-configuration',
        LAUNCH_LOCATION: 'https://w3id.org/xapi/netc/extensions/launch-location',
        LEARNING_OBJECTIVE: 'https://w3id.org/xapi/netc/extensions/learning-objective',
        NAVY_ENLISTED_CLASSIFICATION: 'https://w3id.org/xapi/netc/extensions/navy-enlisted-classification',
        REFERRER_LOCATION: 'https://w3id.org/xapi/netc/extensions/referrer-location',
        SCHOOL_CENTER: 'https://w3id.org/xapi/netc/extensions/school-center',
        TECH_DOC_ID: 'https://w3id.org/xapi/netc/extensions/tech-doc-id',
        TECH_DOC_PROCEDURE_ID: 'https://w3id.org/xapi/netc/extensions/tech-doc-procedure-id',
        TECH_DOC_PROCEDURE_TITLE: 'https://w3id.org/xapi/netc/extensions/tech-doc-procedure-title',
        USER_AGENT: 'https://w3id.org/xapi/netc/extensions/user-agent',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const NAVYELEARNINGPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/netc-e-learning/v/1',
    VERBS: {},
    ACTIVITYTYPES: {
        SECTION: 'https://w3id.org/xapi/netc-e-learning/activity-types/section',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const NELCPROFILE = Object.freeze({
    CATEGORYID: 'http://profiles.usalearning.net/xapi/NELC/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        INSTRUCTOR: 'http://profiles.usalearning.net/xapi/NELC/extension/instructor',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const OPENEDXPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/openedx/v/5',
    VERBS: {
        UNREPORTED: 'https://w3id.org/xapi/openedx/verb/unreported',
        VOTED: 'https://w3id.org/xapi/openedx/verb/voted',
    },
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        SESSION_ID: 'https://w3id.org/xapi/openedx/extension/session-id',
        TRANSFORMER_VERSION: 'https://w3id.org/xapi/openedx/extension/transformer-version',
    },
    RESULTEXTENSION: {
        SPEED_FROM: 'https://w3id.org/xapi/openedx/extension/speed-from',
        SPEED_TO: 'https://w3id.org/xapi/openedx/extension/speed-to',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const ORPHANCONTAINERPROFILE = Object.freeze({
    CATEGORYID: 'https://profiles.usalearning.net/profiles/OrphanProfile/v/1',
    VERBS: {
        CHECK_OUT: 'https://xapi.org.au/geolocationprofile/verb/checkout',
        CHECKED_IN: 'https://xapi.org.au/geolocationprofile/verb/checkin',
        LOWERED_HAND: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/lowered-hand',
        MUTED: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/muted',
        RAISED_HAND: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/raised-hand',
        SHARED_SCREEN: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/shared-screen',
        STARTED_CAMERA: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/started-camera',
        STOPPED_CAMERA: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/stopped-camera',
        UNMUTED: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/unmuted',
        UNSHARED_SCREEN: 'http://schema.dases.eu/xapi/profile/virtual-classroom/verb/unshared-screen',
    },
    ACTIVITYTYPES: {
        SIMULATION_SESSION: 'https://profiles.adlnet.gov/xapi/917114b6-71b4-4fcd-b6d3-892890594446/activitytype/Preflight',
        VIRTUAL_CLASSROOM: 'https://w3id.org/xapi/virtual-classroom/activityt-types/virtual-classroom',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const PDFANNOTATORPROFILE = Object.freeze({
    CATEGORYID: 'http://www.risc-inc.com/annotator/v1.0.',
    VERBS: {
        ANNOTATED: 'http://risc-inc.com/annotator/verbs/annotated',
        MODIFIED_ANNOTATION: 'http://risc-inc.com/annotator/verbs/modified',
    },
    ACTIVITYTYPES: {
        FREETEXT_ANNOTATION: 'http://www.risc-inc.com/annotator/activities/freetext',
        HIGHLIGHTED_TEXT_ANNOTATION: 'http://risc-inc.com/annotator/activities/highlight',
        NOTE_ANNOTATION: 'http://risc-inc.com/annotator/activities/note',
        UNDERLINE_ANNOTATION: 'http://risc-inc.com/annotator/activities/underline',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        HIGHLIGHTED_STRING: 'http://www.risc-inc.com/annotator/extensions/highlightedString',
        PAGE_INDEX: 'http://www.risc-inc.com/annotator/extensions/page',
        PDF_ANNOTATION_HIGHLIGHT_COLOUR: 'http://www.risc-inc.com/annotator/extensions/color',
        PDF_RECTANGLE_MAP: 'http://www.risc-inc.com/annotator/extensions/rects',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const PERFORMANCESUPPORTPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/performance-support/v/6',
    VERBS: {
        DESELECTED: 'https://w3id.org/xapi/performance-support/verbs/deselected',
        SEARCHED: 'https://w3id.org/xapi/performance-support/verb/searched',
        SEARCHED_2: 'https://w3id.org/xapi/performance-support/performance-support/verbs/searched',
        SEARCHED_3: 'https://w3id.org/xapi/performance-support/verbs/searched',
    },
    ACTIVITYTYPES: {
        APPLICATION: 'https://w3id.org/xapi/performance-support/performance-support/activity-types/application',
        APPLICATION_2: 'https://w3id.org/xapi/performance-support/activity-types/application',
        IMAGE: 'https://w3id.org/xapi/performance-support/activity-types/image',
        PERFORMANCE_SUPPORT: 'https://w3id.org/xapi/performance-support/performance-support/activity-types/image',
        PROCEDURE: 'https://w3id.org/xapi/performance-support/performance-support/activity-types/procedure',
        PROCEDURE_2: 'https://w3id.org/xapi/performance-support/activity-types/procedure',
        TASK: 'https://w3id.org/xapi/performance-support/activity-types/task',
    },
    ACTIVITYEXTENSION: {
        PROCEDURE_METADATA: 'https://w3id.org/xapi/performance-support/extensions/procedure-metadata',
        STEP_METADATA: 'https://w3id.org/xapi/performance-support/extensions/step-metadata',
    },
    CONTEXTEXTENSION: {
        LAUNCH_MODE: 'https://w3id.org/xapi/performance-support/extensions/launch-mode',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const SCORMPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/scorm/v/2',
    VERBS: {
        COMPLETED: 'http://adlnet.gov/expapi/verbs/completed',
        FAILED: 'http://adlnet.gov/expapi/verbs/failed',
        INITIALIZED: 'http://adlnet.gov/expapi/verbs/initialized',
        PASSED: 'http://adlnet.gov/expapi/verbs/passed',
        RESPONDED: 'http://adlnet.gov/expapi/verbs/responded',
        RESUMED: 'http://adlnet.gov/expapi/verbs/resumed',
        SCORED: 'http://adlnet.gov/expapi/verbs/scored',
        SUSPENDED: 'http://adlnet.gov/expapi/verbs/suspended',
        TERMINATED: 'http://adlnet.gov/expapi/verbs/terminated',
    },
    ACTIVITYTYPES: {
        ASSESSMENT: 'http://adlnet.gov/expapi/activities/assessment',
        ATTEMPT: 'http://adlnet.gov/expapi/activities/attempt',
        CMI_INTERACTION: 'http://adlnet.gov/expapi/activities/cmi.interaction',
        COURSE: 'http://adlnet.gov/expapi/activities/course',
        LESSON: 'http://adlnet.gov/expapi/activities/lesson',
        MODULE: 'http://adlnet.gov/expapi/activities/module',
        OBJECTIVE: 'http://adlnet.gov/expapi/activities/objective',
        PROFILE: 'http://adlnet.gov/expapi/activities/profile',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const SERIOUSGAMESPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/seriousgames/v1.0',
    VERBS: {
        ACCESSED: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
        PRESSED: 'https://w3id.org/xapi/seriousgames/verbs/pressed',
        RELEASED: 'https://w3id.org/xapi/seriousgames/verbs/released',
        UNLOCKED: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
        USED: 'https://w3id.org/xapi/seriousgames/verbs/used',
    },
    ACTIVITYTYPES: {
        AREA: 'https://w3id.org/xapi/seriousgames/activity-types/area',
        CONTROLLER: 'https://w3id.org/xapi/seriousgames/activity-types/controller',
        CUTSCENE: 'https://w3id.org/xapi/seriousgames/activity-types/cutscene',
        DIALOG_TREE: 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree',
        ENEMY: 'https://w3id.org/xapi/seriousgames/activity-types/enemy',
        ITEM: 'https://w3id.org/xapi/seriousgames/activity-types/item',
        KEYBOARD: 'https://w3id.org/xapi/seriousgames/activity-types/keyboard',
        LEVEL: 'https://w3id.org/xapi/seriousgames/activity-types/level',
        MENU: 'https://w3id.org/xapi/seriousgames/activity-types/menu',
        MOUSE: 'https://w3id.org/xapi/seriousgames/activity-types/mouse',
        NON_PLAYER_CHARACTER: 'https://w3id.org/xapi/seriousgames/activity-types/non-player-character',
        QUEST: 'https://w3id.org/xapi/seriousgames/activity-types/quest',
        SCREEN: 'https://w3id.org/xapi/seriousgames/activity-types/screen',
        SERIOUS_GAME: 'https://w3id.org/xapi/seriousgames/activity-types/serious-game',
        TOUCHSCREEN: 'https://w3id.org/xapi/seriousgames/activity-types/touchscreen',
        ZONE: 'https://w3id.org/xapi/seriousgames/activity-types/zone',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {
        HEALTH: 'https://w3id.org/xapi/seriousgames/extensions/health',
        POSITION: 'https://w3id.org/xapi/seriousgames/extensions/position',
        PROGRESS: 'https://w3id.org/xapi/seriousgames/extensions/progress',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const SIMULATIONBASEPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/simulation/v/3',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        ELEMENT_NOMENCLATURE: 'https://w3id.org/xapi/simulation/extensions/element-nomenclature',
        ELEMENT_REF_DES: 'https://w3id.org/xapi/simulation/extensions/element-ref-des',
        S1000D_DMC: 'https://w3id.org/xapi/simulation/extensions/s1000d-dmc',
        S1000D_SNS: 'https://w3id.org/xapi/simulation/extensions/s1000d-sns',
        SIMULATION_MODE: 'https://w3id.org/xapi/simulation/extensions/simulation-mode',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const SOCIALMEDIAPROFILE = Object.freeze({
    CATEGORYID: 'https://xapi.org.au/sociallearningprofile/v/2',
    VERBS: {
        JOINED: 'https://xapi.org.au/sociallearningprofile/joined',
        LEFT: 'https://xapi.org.au/sociallearningprofile/left',
        LOVED: 'https://xapi.org.au/sociallearningprofile/loved',
    },
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {
        EMOTION: 'https://xapi.org.au/sociallearningprofile/emotion',
    },
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const SURVEYPOCPROFILE = Object.freeze({
    CATEGORYID: 'https://profiles.adlnet.gov/xapi/9109408b-fb88-46c8-b1cd-4bc1e2f37dab/v/1',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const SYLLABUSEVENTSPROFILE = Object.freeze({
    CATEGORYID: 'https://pttportal.af.mil/xapi/profile/syllabus-events/v/1',
    VERBS: {},
    ACTIVITYTYPES: {
        SYLLABUS_EVENT: 'https://pttportal.af.mil/xapi/activity-type/syllabus-event',
        SYLLABUS_PHASE: 'https://pttportal.af.mil/xapi/activity-type/syllabus-phase',
        SYLLABUS_UNIT: 'https://pttportal.af.mil/xapi/activity-type/syllabus-unit',
        TRAINING_PROGRAM: 'https://pttportal.af.mil/xapi/activity-type/training-program',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        MEDIA_CATEGORY: 'https://pttportal.af.mil/xapi/extension/media-category',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const TASKTRAINERSIMULATIONPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/task-trainer-simulation/v/2',
    VERBS: {
        RECEIVED: 'https://w3id.org/xapi/task-trainer-simulation/verbs/received',
        RESTARTED: 'https://w3id.org/xapi/task-trainer-simulation/verbs/restarted',
        USED: 'https://w3id.org/xapi/task-trainer-simulation/verbs/used',
    },
    ACTIVITYTYPES: {
        FEEDBACK_CORRECTIVE: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/feedback-corrective',
        FEEDBACK_ERROR: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/feedback-error',
        FEEDBACK_PERFORMANCE: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/feedback-performance',
        FEEDBACK_SAFETY: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/feedback-safety',
        TASK_TRAINER_DOCUMENT: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/task-trainer-document',
        TASK_TRAINER_SCENARIO: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/task-trainer-scenario',
        TASK_TRAINER_STEP: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/task-trainer-step',
        TASK_TRAINER_TASK: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/task-trainer-task',
        TASK_TRAINER_TOOL: 'https://w3id.org/xapi/task-trainer-simulation/activity-types/task-trainer-tool',
        TEST_TEST: 'https://w3id.org/xapi/simulation/activities/test-test',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const TINCANVOCABULARYPROFILE = Object.freeze({
    CATEGORYID: 'https://registry.tincanapi.com',
    VERBS: {
        ADJOURNED: 'http://id.tincanapi.com/verb/adjourned',
        APPLAUDED: 'http://id.tincanapi.com/verb/applauded',
        ARRANGED: 'http://id.tincanapi.com/verb/arranged',
        BOOKMARKED: 'http://id.tincanapi.com/verb/bookmarked',
        CALLED: 'http://id.tincanapi.com/verb/called',
        CLOSED_SALE: 'http://id.tincanapi.com/verb/closed-sale',
        CREATED_OPPORTUNITY: 'http://id.tincanapi.com/verb/created-opportunity',
        DEFINED: 'http://id.tincanapi.com/verb/defined',
        DISABLED: 'http://id.tincanapi.com/verb/disabled',
        DISCARDED: 'http://id.tincanapi.com/verb/discarded',
        DOWNLOADED: 'http://id.tincanapi.com/verb/downloaded',
        EARNED: 'http://id.tincanapi.com/verb/earned',
        ENABLED: 'http://id.tincanapi.com/verb/enabled',
        ENTERED_FRAME: 'http://id.tincanapi.com/verb/frame/entered',
        ESTIMATED_DURATION: 'http://id.tincanapi.com/verb/estimated-duration',
        EXITED_FRAME: 'http://id.tincanapi.com/verb/frame/exited',
        EXPECTED: 'http://id.tincanapi.com/verb/expected',
        EXPIRED: 'http://id.tincanapi.com/verb/expired',
        FOCUSED: 'http://id.tincanapi.com/verb/focused',
        HIRED: 'http://id.tincanapi.com/verb/hired',
        INTERVIEWED: 'http://id.tincanapi.com/verb/interviewed',
        LAUGHED: 'http://id.tincanapi.com/verb/laughed',
        MARKED_AS_UNREAD: 'http://id.tincanapi.com/verb/marked-unread',
        MENTIONED: 'http://id.tincanapi.com/verb/mentioned',
        MENTORED: 'http://id.tincanapi.com/verb/mentored',
        PAUSED: 'http://id.tincanapi.com/verb/paused',
        PERFORMED_OFFLINE: 'http://id.tincanapi.com/verb/performed-offline',
        PERSONALIZED: 'http://id.tincanapi.com/verb/personalized',
        PREVIEWED: 'http://id.tincanapi.com/verb/previewed',
        PROMOTED: 'http://id.tincanapi.com/verb/promoted',
        RATED: 'http://id.tincanapi.com/verb/rated',
        REPLIED: 'http://id.tincanapi.com/verb/replied',
        REPLIED_TO_TWEET: 'http://id.tincanapi.com/verb/replied-to-tweet',
        REQUESTED_ATTENTION: 'http://id.tincanapi.com/verb/requested-attention',
        RETWEETED: 'http://id.tincanapi.com/verb/retweeted',
        REVIEWED: 'http://id.tincanapi.com/verb/reviewed',
        SECURED: 'http://id.tincanapi.com/verb/secured',
        SELECTED: 'http://id.tincanapi.com/verb/selected',
        SKIPPED: 'http://id.tincanapi.com/verb/skipped',
        TALKEDWITH: 'http://id.tincanapi.com/verb/talked-with',
        TWEETED: 'http://id.tincanapi.com/verb/tweeted',
        UNFOCUSED: 'http://id.tincanapi.com/verb/unfocused',
        UNREGISTERED: 'http://id.tincanapi.com/verb/unregistered',
        VIEWED: 'http://id.tincanapi.com/verb/viewed',
        VOTED_DOWN: 'http://id.tincanapi.com/verb/voted-down',
        VOTED_UP: 'http://id.tincanapi.com/verb/voted-up',
    },
    ACTIVITYTYPES: {
        BLOG: 'http://id.tincanapi.com/activitytype/blog',
        BOOK: 'http://id.tincanapi.com/activitytype/book',
        CATEGORY: 'http://id.tincanapi.com/activitytype/category',
        CERTIFICATE: 'https://www.opigno.org/en/tincan_registry/activity_type/certificate',
        CHAPTER: 'http://id.tincanapi.com/activitytype/chapter',
        CHAT_CHANNEL: 'http://id.tincanapi.com/activitytype/chat-channel',
        CHAT_MESSAGE: 'http://id.tincanapi.com/activitytype/chat-message',
        CHECKLIST: 'http://id.tincanapi.com/activitytype/checklist',
        CHECKLIST_ITEM: 'http://id.tincanapi.com/activitytype/checklist-item',
        CODE_COMMIT: 'http://id.tincanapi.com/activitytype/code-commit',
        COMMUNITY_SITE: 'http://id.tincanapi.com/activitytype/community-site',
        CONFERENCE: 'http://id.tincanapi.com/activitytype/conference',
        CONFERENCE_SESSION: 'http://id.tincanapi.com/activitytype/conference-session',
        CONFERENCE_TRACK: 'http://id.tincanapi.com/activitytype/conference-track',
        DISCUSSION: 'http://id.tincanapi.com/activitytype/discussion',
        DOCUMENT: 'http://id.tincanapi.com/activitytype/document',
        DOUBT: 'http://id.tincanapi.com/activitytype/doubt',
        EMAIL: 'http://id.tincanapi.com/activitytype/email',
        EMBEDDED_STRATEGY: 'http://id.tincanapi.com/activitytype/strategy-embedded',
        ESSAY: 'http://id.tincanapi.com/activitytype/essay',
        FORUM_REPLY: 'http://id.tincanapi.com/activitytype/forum-reply',
        FORUM_TOPIC: 'http://id.tincanapi.com/activitytype/forum-topic',
        GOAL: 'http://id.tincanapi.com/activitytype/goal',
        GRADE_CLASSIFICATION: 'http://www.tincanapi.co.uk/activitytypes/grade_classification',
        LEGACY_LEARNING_STANDARD: 'http://id.tincanapi.com/activitytype/legacy-learning-standard',
        LMS: 'http://id.tincanapi.com/activitytype/lms',
        PARAGRAPH: 'http://id.tincanapi.com/activitytype/paragraph',
        PLAYLIST: 'http://id.tincanapi.com/activitytype/playlist',
        PROJECT: 'http://id.tincanapi.com/activitytype/project',
        PROJECT_SITE: 'http://id.tincanapi.com/activitytype/project-site',
        RESEARCH_REPORT: 'http://id.tincanapi.com/activitytype/research-report',
        RESOURCE: 'http://id.tincanapi.com/activitytype/resource',
        REWARD: 'http://id.tincanapi.com/activitytype/reward',
        SALES_OPPORTUNITY: 'http://id.tincanapi.com/activitytype/sales-opportunity',
        SCENARIO: 'http://id.tincanapi.com/activitytype/scenario',
        SCHOOL_ASSIGNMENT: 'http://id.tincanapi.com/activitytype/school-assignment',
        SECTION: 'http://id.tincanapi.com/activitytype/section',
        SECURITY_ROLE: 'http://id.tincanapi.com/activitytype/security-role',
        SIMPLE_COLLECTION: 'http://id.tincanapi.com/activitytype/collection-simple',
        SLIDE: 'http://id.tincanapi.com/activitytype/slide',
        SLIDE_DECK: 'http://id.tincanapi.com/activitytype/slide-deck',
        SOLUTION: 'http://id.tincanapi.com/activitytype/solution',
        SOURCE: 'http://id.tincanapi.com/activitytype/source',
        STATUS_UPDATE: 'http://id.tincanapi.com/activitytype/status-update',
        STEP: 'http://id.tincanapi.com/activitytype/step',
        STRATEGY: 'http://id.tincanapi.com/activitytype/strategy',
        SUBCATEGORY: 'http://id.tincanapi.com/activitytype/subcategory',
        SUGGESTION: 'http://id.tincanapi.com/activitytype/suggestion',
        TAG: 'http://id.tincanapi.com/activitytype/tag',
        TEST_DATA_BATCH: 'http://id.tincanapi.com/activitytype/test-data-batch',
        TUTOR_SESSION: 'http://id.tincanapi.com/activitytype/tutor-session',
        TWEET: 'http://id.tincanapi.com/activitytype/tweet',
        UNIT_TEST: 'http://id.tincanapi.com/activitytype/unit-test',
        UNIT_TEST_SUITE: 'http://id.tincanapi.com/activitytype/unit-test-suite',
        USER_PROFILE: 'http://id.tincanapi.com/activitytype/user-profile',
        VOCABULARY_WORD: 'http://id.tincanapi.com/activitytype/vocabulary-word',
        VOICEMAIL: 'http://id.tincanapi.com/activitytype/voicemail',
        WEBINAR: 'http://id.tincanapi.com/activitytype/webinar',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        ASSESSMENT_TYPE: 'http://id.tincanapi.com/extension/assessment-type',
        ATTEMPT_ID: 'http://id.tincanapi.com/extension/attempt-id',
        BROWSER_INFORMATION: 'http://id.tincanapi.com/extension/browser-info',
        CMI_INTERACTION_WEIGHTING: 'http://id.tincanapi.com/extension/cmi-interaction-weighting',
        COLLECTION_TYPE: 'http://id.tincanapi.com/extension/collection-type',
        COLOR: 'http://id.tincanapi.com/extension/color',
        CONDITION_TYPE: 'http://id.tincanapi.com/extension/condition-type',
        CONDITION_VALUE: 'http://id.tincanapi.com/extension/condition-value',
        DATA_URI: 'http://id.tincanapi.com/extension/data-uri',
        DATE: 'http://id.tincanapi.com/extension/date',
        DATETIME: 'http://id.tincanapi.com/extension/datetime',
        DROP_DOWN: 'http://id.tincanapi.com/extension/drop-down',
        ENDING_POSITION: 'http://id.tincanapi.com/extension/ending-position',
        FEEDBACK: 'http://id.tincanapi.com/extension/feedback',
        GEO_JSON: 'http://id.tincanapi.com/extension/geojson',
        INVITEE: 'http://id.tincanapi.com/extension/invitee',
        IP_ADDRESS: 'http://id.tincanapi.com/extension/ip-address',
        IRL: 'http://id.tincanapi.com/extension/irl',
        ISBN: 'http://id.tincanapi.com/extension/isbn',
        JWS_CERTIFICATE_LOCATION: 'http://id.tincanapi.com/extension/jws-certificate-location',
        LATITUDE: 'http://id.tincanapi.com/extension/latitude',
        LOCATION: 'http://id.tincanapi.com/extension/location',
        LONGITUDE: 'http://id.tincanapi.com/extension/longitude',
        MEASUREMENT: 'http://id.tincanapi.com/extension/measurement',
        MONETARY_VALUE: 'http://id.tincanapi.com/extension/monetary-value',
        OBSERVER: 'http://id.tincanapi.com/extension/observer',
        PLANNED_DURATION: 'http://id.tincanapi.com/extension/planned-duration',
        PLANNED_START_TIME: 'http://id.tincanapi.com/extension/planned-start-time',
        POSITION: 'http://id.tincanapi.com/extension/position',
        POWERED_BY: 'http://id.tincanapi.com/extension/powered-by',
        PRIVATE_AREA: 'http://id.tincanapi.com/extension/private-area',
        PUBLISHED: 'http://id.tincanapi.com/extension/published',
        PURPOSE: 'http://id.tincanapi.com/extension/purpose',
        REFERRER: 'http://id.tincanapi.com/extension/referrer',
        REFLECTION: 'http://id.tincanapi.com/extension/reflection',
        SEVERITY: 'http://id.tincanapi.com/extension/severity',
        SHARE_MEDIUM: 'http://id.tincanapi.com/extension/share-medium',
        STARTING_POINT: 'http://id.tincanapi.com/extension/starting-point',
        STARTING_POSITION: 'http://id.tincanapi.com/extension/starting-position',
        TAGS: 'http://id.tincanapi.com/extension/tags',
        TARGET: 'http://id.tincanapi.com/extension/target',
        TOPIC: 'http://id.tincanapi.com/extension/topic',
        TRAINING_PROVIDER: 'http://id.tincanapi.com/extension/training-provider',
        TWEET: 'http://id.tincanapi.com/extension/tweet',
        UPDATED: 'http://id.tincanapi.com/extension/updated',
    },
    RESULTEXTENSION: {
        ACTIONSPER_MINUTE: 'http://id.tincanapi.com/extension/apm',
        CLASSIFICATION: 'http://www.tincanapi.co.uk/extensions/result/classification',
        DURATION: 'http://id.tincanapi.com/extension/duration',
        ENDING_POINT: 'http://id.tincanapi.com/extension/ending-point',
        QUALITY_RATING: 'http://id.tincanapi.com/extension/quality-rating',
        TETRIS_LINES: 'http://id.tincanapi.com/extension/tetris-lines',
        TIME: 'http://id.tincanapi.com/extension/time',
        VALID_UNTIL: 'http://id.tincanapi.com/extension/valid-until',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const VIDEOPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/video/v/2',
    VERBS: {
        PAUSED: 'https://w3id.org/xapi/video/verbs/paused',
        PLAYED: 'https://w3id.org/xapi/video/verbs/played',
        SEEKED: 'https://w3id.org/xapi/video/verbs/seeked',
    },
    ACTIVITYTYPES: {
        VIDEO: 'https://w3id.org/xapi/video/activity-type/video',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        CC_SUBTITLE_ENABLED: 'https://w3id.org/xapi/video/extensions/cc-subtitle-enabled',
        CC_SUBTITLE_LANG: 'https://w3id.org/xapi/video/extensions/cc-subtitle-lang',
        COMPLETION_THRESHOLD: 'https://w3id.org/xapi/video/extensions/completion-threshold',
        FRAME_RATE: 'https://w3id.org/xapi/video/extensions/frame-rate',
        FULL_SCREEN: 'https://w3id.org/xapi/video/extensions/full-screen',
        LENGTH: 'https://w3id.org/xapi/video/extensions/length',
        QUALITY: 'https://w3id.org/xapi/video/extensions/quality',
        SCREEN_SIZE: 'https://w3id.org/xapi/video/extensions/screen-size',
        SESSION_ID: 'https://w3id.org/xapi/video/extensions/session-id',
        SPEED: 'https://w3id.org/xapi/video/extensions/speed',
        TRACK: 'https://w3id.org/xapi/video/extensions/track',
        USER_AGENT: 'https://w3id.org/xapi/video/extensions/user-agent',
        VIDEO_PLAYBACK_SIZE: 'https://w3id.org/xapi/video/extensions/video-playback-size',
        VOLUME: 'https://w3id.org/xapi/video/extensions/volume',
    },
    RESULTEXTENSION: {
        PLAYED_SEGMENTS: 'https://w3id.org/xapi/video/extensions/played-segments',
        PROGRESS: 'https://w3id.org/xapi/video/extensions/progress',
        TIME: 'https://w3id.org/xapi/video/extensions/time',
        TIME_FROM: 'https://w3id.org/xapi/video/extensions/time-from',
        TIME_TO: 'https://w3id.org/xapi/video/extensions/time-to',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const VIRTUALCLASSROOMPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/virtual-classroom/v/1',
    VERBS: {},
    ACTIVITYTYPES: {
        VIRTUAL_CLASSROOM: 'https://w3id.org/xapi/virtual-classroom/activity-types/virtual-classroom',
    },
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        CAMERA_ACTIVATED: 'https://w3id.org/xapi/virtual-classroom/extensions/camera-activated',
        HAND_RAISED: 'https://w3id.org/xapi/virtual-classroom/extensions/hand-raised',
        MICRO_ACTIVATED: 'https://w3id.org/xapi/virtual-classroom/extensions/micro-activated',
        SCREEN_SHARED: 'https://w3id.org/xapi/virtual-classroom/extensions/screen-shared',
    },
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const VIRTUALPATIENTPROFILE = Object.freeze({
    CATEGORYID: 'https://w3id.org/xapi/virtual-patient/v1.0',
    VERBS: {
        IGNORED: 'https://w3id.org/xapi/medbiq/verbs/ignored',
        UPDATED: 'https://w3id.org/xapi/medbiq/verbs/updated',
    },
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {},
    RESULTEXTENSION: {}
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles
const XAPIOPENBADGESPROFILE = Object.freeze({
    CATEGORYID: 'http://specification.openbadges.org/xapi',
    VERBS: {},
    ACTIVITYTYPES: {},
    ACTIVITYEXTENSION: {},
    CONTEXTEXTENSION: {
        OPEN_BADGE_CLASS: 'http://specification.openbadges.org/xapi/extensions/badgeclass',
    },
    RESULTEXTENSION: {
        OPEN_BADGE_ASSERTION: 'http://specification.openbadges.org/xapi/extensions/badgeassertion',
    }
});

// Auto-generated from xapi-authored-profiles/Profile_Server_Profiles
// Do not edit manually. Re-run: npm run generate:profiles

const ALL = Object.freeze({
    CATEGORYID: Object.freeze({
        ACADEMICASSESSMENTPROFILE: ACADEMICASSESSMENTPROFILE.CATEGORYID,
        ACROSSXPROFILE: ACROSSXPROFILE.CATEGORYID,
        ACTIONABLEDATABOOKADBPROFILE: ACTIONABLEDATABOOKADBPROFILE.CATEGORYID,
        ACTIVITYSTREAMSVOCABULARYPROFILE: ACTIVITYSTREAMSVOCABULARYPROFILE.CATEGORYID,
        ADLVOCABULARYPROFILE: ADLVOCABULARYPROFILE.CATEGORYID,
        AUDIOPROFILE: AUDIOPROFILE.CATEGORYID,
        BOLLPROFILE: BOLLPROFILE.CATEGORYID,
        CMI5PROFILE: CMI5PROFILE.CATEGORYID,
        CONTENTREPOSITORYPROFILE: CONTENTREPOSITORYPROFILE.CATEGORYID,
        COREPROFILE: COREPROFILE.CATEGORYID,
        DATASECURITYMODULEPROFILE: DATASECURITYMODULEPROFILE.CATEGORYID,
        DODISDPROFILE: DODISDPROFILE.CATEGORYID,
        EDACOURSEPROFILE: EDACOURSEPROFILE.CATEGORYID,
        EMOTIONAPIPROFILE: EMOTIONAPIPROFILE.CATEGORYID,
        FEEDBACKINTERACTIONPROFILE: FEEDBACKINTERACTIONPROFILE.CATEGORYID,
        FLASHCARDSPROFILE: FLASHCARDSPROFILE.CATEGORYID,
        FLYINGPROFILE: FLYINGPROFILE.CATEGORYID,
        GBLXAPIK12EDUCATIONAPPSPROFILE: GBLXAPIK12EDUCATIONAPPSPROFILE.CATEGORYID,
        GENERALVOCABULARYPROFILE: GENERALVOCABULARYPROFILE.CATEGORYID,
        GEOLOCATIONPROFILE: GEOLOCATIONPROFILE.CATEGORYID,
        GROUNDTRAININGPROFILE: GROUNDTRAININGPROFILE.CATEGORYID,
        HROPENASSESSMENTSPROFILE: HROPENASSESSMENTSPROFILE.CATEGORYID,
        HYFLEXCLASSROOMPROFILE: HYFLEXCLASSROOMPROFILE.CATEGORYID,
        IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE: IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE.CATEGORYID,
        INITIALIZEDHHINITPROFILE: INITIALIZEDHHINITPROFILE.CATEGORYID,
        LANGUAGEEXPERIMENTPROFILE: LANGUAGEEXPERIMENTPROFILE.CATEGORYID,
        LEARNINGMANAGEMENTSYSTEMPROFILE: LEARNINGMANAGEMENTSYSTEMPROFILE.CATEGORYID,
        TLAPROFILE: TLAPROFILE.CATEGORYID,
        NAVYASSESSMENTPROFILE: NAVYASSESSMENTPROFILE.CATEGORYID,
        NAVYCOMMONREFERENCEPROFILE: NAVYCOMMONREFERENCEPROFILE.CATEGORYID,
        NAVYELEARNINGPROFILE: NAVYELEARNINGPROFILE.CATEGORYID,
        NELCPROFILE: NELCPROFILE.CATEGORYID,
        OPENEDXPROFILE: OPENEDXPROFILE.CATEGORYID,
        ORPHANCONTAINERPROFILE: ORPHANCONTAINERPROFILE.CATEGORYID,
        PDFANNOTATORPROFILE: PDFANNOTATORPROFILE.CATEGORYID,
        PERFORMANCESUPPORTPROFILE: PERFORMANCESUPPORTPROFILE.CATEGORYID,
        SCORMPROFILE: SCORMPROFILE.CATEGORYID,
        SERIOUSGAMESPROFILE: SERIOUSGAMESPROFILE.CATEGORYID,
        SIMULATIONBASEPROFILE: SIMULATIONBASEPROFILE.CATEGORYID,
        SOCIALMEDIAPROFILE: SOCIALMEDIAPROFILE.CATEGORYID,
        SURVEYPOCPROFILE: SURVEYPOCPROFILE.CATEGORYID,
        SYLLABUSEVENTSPROFILE: SYLLABUSEVENTSPROFILE.CATEGORYID,
        TASKTRAINERSIMULATIONPROFILE: TASKTRAINERSIMULATIONPROFILE.CATEGORYID,
        TINCANVOCABULARYPROFILE: TINCANVOCABULARYPROFILE.CATEGORYID,
        VIDEOPROFILE: VIDEOPROFILE.CATEGORYID,
        VIRTUALCLASSROOMPROFILE: VIRTUALCLASSROOMPROFILE.CATEGORYID,
        VIRTUALPATIENTPROFILE: VIRTUALPATIENTPROFILE.CATEGORYID,
        XAPIOPENBADGESPROFILE: XAPIOPENBADGESPROFILE.CATEGORYID,
    }),
    VERBS: Object.freeze({
        ...ACADEMICASSESSMENTPROFILE.VERBS,
        ...ACROSSXPROFILE.VERBS,
        ...ACTIONABLEDATABOOKADBPROFILE.VERBS,
        ...ACTIVITYSTREAMSVOCABULARYPROFILE.VERBS,
        ...ADLVOCABULARYPROFILE.VERBS,
        ...AUDIOPROFILE.VERBS,
        ...BOLLPROFILE.VERBS,
        ...CMI5PROFILE.VERBS,
        ...CONTENTREPOSITORYPROFILE.VERBS,
        ...COREPROFILE.VERBS,
        ...DATASECURITYMODULEPROFILE.VERBS,
        ...DODISDPROFILE.VERBS,
        ...EDACOURSEPROFILE.VERBS,
        ...EMOTIONAPIPROFILE.VERBS,
        ...FEEDBACKINTERACTIONPROFILE.VERBS,
        ...FLASHCARDSPROFILE.VERBS,
        ...FLYINGPROFILE.VERBS,
        ...GBLXAPIK12EDUCATIONAPPSPROFILE.VERBS,
        ...GENERALVOCABULARYPROFILE.VERBS,
        ...GEOLOCATIONPROFILE.VERBS,
        ...GROUNDTRAININGPROFILE.VERBS,
        ...HROPENASSESSMENTSPROFILE.VERBS,
        ...HYFLEXCLASSROOMPROFILE.VERBS,
        ...IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE.VERBS,
        ...INITIALIZEDHHINITPROFILE.VERBS,
        ...LANGUAGEEXPERIMENTPROFILE.VERBS,
        ...LEARNINGMANAGEMENTSYSTEMPROFILE.VERBS,
        ...TLAPROFILE.VERBS,
        ...NAVYASSESSMENTPROFILE.VERBS,
        ...NAVYCOMMONREFERENCEPROFILE.VERBS,
        ...NAVYELEARNINGPROFILE.VERBS,
        ...NELCPROFILE.VERBS,
        ...OPENEDXPROFILE.VERBS,
        ...ORPHANCONTAINERPROFILE.VERBS,
        ...PDFANNOTATORPROFILE.VERBS,
        ...PERFORMANCESUPPORTPROFILE.VERBS,
        ...SCORMPROFILE.VERBS,
        ...SERIOUSGAMESPROFILE.VERBS,
        ...SIMULATIONBASEPROFILE.VERBS,
        ...SOCIALMEDIAPROFILE.VERBS,
        ...SURVEYPOCPROFILE.VERBS,
        ...SYLLABUSEVENTSPROFILE.VERBS,
        ...TASKTRAINERSIMULATIONPROFILE.VERBS,
        ...TINCANVOCABULARYPROFILE.VERBS,
        ...VIDEOPROFILE.VERBS,
        ...VIRTUALCLASSROOMPROFILE.VERBS,
        ...VIRTUALPATIENTPROFILE.VERBS,
        ...XAPIOPENBADGESPROFILE.VERBS,
    }),
    ACTIVITYTYPES: Object.freeze({
        ...ACADEMICASSESSMENTPROFILE.ACTIVITYTYPES,
        ...ACROSSXPROFILE.ACTIVITYTYPES,
        ...ACTIONABLEDATABOOKADBPROFILE.ACTIVITYTYPES,
        ...ACTIVITYSTREAMSVOCABULARYPROFILE.ACTIVITYTYPES,
        ...ADLVOCABULARYPROFILE.ACTIVITYTYPES,
        ...AUDIOPROFILE.ACTIVITYTYPES,
        ...BOLLPROFILE.ACTIVITYTYPES,
        ...CMI5PROFILE.ACTIVITYTYPES,
        ...CONTENTREPOSITORYPROFILE.ACTIVITYTYPES,
        ...COREPROFILE.ACTIVITYTYPES,
        ...DATASECURITYMODULEPROFILE.ACTIVITYTYPES,
        ...DODISDPROFILE.ACTIVITYTYPES,
        ...EDACOURSEPROFILE.ACTIVITYTYPES,
        ...EMOTIONAPIPROFILE.ACTIVITYTYPES,
        ...FEEDBACKINTERACTIONPROFILE.ACTIVITYTYPES,
        ...FLASHCARDSPROFILE.ACTIVITYTYPES,
        ...FLYINGPROFILE.ACTIVITYTYPES,
        ...GBLXAPIK12EDUCATIONAPPSPROFILE.ACTIVITYTYPES,
        ...GENERALVOCABULARYPROFILE.ACTIVITYTYPES,
        ...GEOLOCATIONPROFILE.ACTIVITYTYPES,
        ...GROUNDTRAININGPROFILE.ACTIVITYTYPES,
        ...HROPENASSESSMENTSPROFILE.ACTIVITYTYPES,
        ...HYFLEXCLASSROOMPROFILE.ACTIVITYTYPES,
        ...IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE.ACTIVITYTYPES,
        ...INITIALIZEDHHINITPROFILE.ACTIVITYTYPES,
        ...LANGUAGEEXPERIMENTPROFILE.ACTIVITYTYPES,
        ...LEARNINGMANAGEMENTSYSTEMPROFILE.ACTIVITYTYPES,
        ...TLAPROFILE.ACTIVITYTYPES,
        ...NAVYASSESSMENTPROFILE.ACTIVITYTYPES,
        ...NAVYCOMMONREFERENCEPROFILE.ACTIVITYTYPES,
        ...NAVYELEARNINGPROFILE.ACTIVITYTYPES,
        ...NELCPROFILE.ACTIVITYTYPES,
        ...OPENEDXPROFILE.ACTIVITYTYPES,
        ...ORPHANCONTAINERPROFILE.ACTIVITYTYPES,
        ...PDFANNOTATORPROFILE.ACTIVITYTYPES,
        ...PERFORMANCESUPPORTPROFILE.ACTIVITYTYPES,
        ...SCORMPROFILE.ACTIVITYTYPES,
        ...SERIOUSGAMESPROFILE.ACTIVITYTYPES,
        ...SIMULATIONBASEPROFILE.ACTIVITYTYPES,
        ...SOCIALMEDIAPROFILE.ACTIVITYTYPES,
        ...SURVEYPOCPROFILE.ACTIVITYTYPES,
        ...SYLLABUSEVENTSPROFILE.ACTIVITYTYPES,
        ...TASKTRAINERSIMULATIONPROFILE.ACTIVITYTYPES,
        ...TINCANVOCABULARYPROFILE.ACTIVITYTYPES,
        ...VIDEOPROFILE.ACTIVITYTYPES,
        ...VIRTUALCLASSROOMPROFILE.ACTIVITYTYPES,
        ...VIRTUALPATIENTPROFILE.ACTIVITYTYPES,
        ...XAPIOPENBADGESPROFILE.ACTIVITYTYPES,
    }),
    ACTIVITYEXTENSION: Object.freeze({
        ...ACADEMICASSESSMENTPROFILE.ACTIVITYEXTENSION,
        ...ACROSSXPROFILE.ACTIVITYEXTENSION,
        ...ACTIONABLEDATABOOKADBPROFILE.ACTIVITYEXTENSION,
        ...ACTIVITYSTREAMSVOCABULARYPROFILE.ACTIVITYEXTENSION,
        ...ADLVOCABULARYPROFILE.ACTIVITYEXTENSION,
        ...AUDIOPROFILE.ACTIVITYEXTENSION,
        ...BOLLPROFILE.ACTIVITYEXTENSION,
        ...CMI5PROFILE.ACTIVITYEXTENSION,
        ...CONTENTREPOSITORYPROFILE.ACTIVITYEXTENSION,
        ...COREPROFILE.ACTIVITYEXTENSION,
        ...DATASECURITYMODULEPROFILE.ACTIVITYEXTENSION,
        ...DODISDPROFILE.ACTIVITYEXTENSION,
        ...EDACOURSEPROFILE.ACTIVITYEXTENSION,
        ...EMOTIONAPIPROFILE.ACTIVITYEXTENSION,
        ...FEEDBACKINTERACTIONPROFILE.ACTIVITYEXTENSION,
        ...FLASHCARDSPROFILE.ACTIVITYEXTENSION,
        ...FLYINGPROFILE.ACTIVITYEXTENSION,
        ...GBLXAPIK12EDUCATIONAPPSPROFILE.ACTIVITYEXTENSION,
        ...GENERALVOCABULARYPROFILE.ACTIVITYEXTENSION,
        ...GEOLOCATIONPROFILE.ACTIVITYEXTENSION,
        ...GROUNDTRAININGPROFILE.ACTIVITYEXTENSION,
        ...HROPENASSESSMENTSPROFILE.ACTIVITYEXTENSION,
        ...HYFLEXCLASSROOMPROFILE.ACTIVITYEXTENSION,
        ...IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE.ACTIVITYEXTENSION,
        ...INITIALIZEDHHINITPROFILE.ACTIVITYEXTENSION,
        ...LANGUAGEEXPERIMENTPROFILE.ACTIVITYEXTENSION,
        ...LEARNINGMANAGEMENTSYSTEMPROFILE.ACTIVITYEXTENSION,
        ...TLAPROFILE.ACTIVITYEXTENSION,
        ...NAVYASSESSMENTPROFILE.ACTIVITYEXTENSION,
        ...NAVYCOMMONREFERENCEPROFILE.ACTIVITYEXTENSION,
        ...NAVYELEARNINGPROFILE.ACTIVITYEXTENSION,
        ...NELCPROFILE.ACTIVITYEXTENSION,
        ...OPENEDXPROFILE.ACTIVITYEXTENSION,
        ...ORPHANCONTAINERPROFILE.ACTIVITYEXTENSION,
        ...PDFANNOTATORPROFILE.ACTIVITYEXTENSION,
        ...PERFORMANCESUPPORTPROFILE.ACTIVITYEXTENSION,
        ...SCORMPROFILE.ACTIVITYEXTENSION,
        ...SERIOUSGAMESPROFILE.ACTIVITYEXTENSION,
        ...SIMULATIONBASEPROFILE.ACTIVITYEXTENSION,
        ...SOCIALMEDIAPROFILE.ACTIVITYEXTENSION,
        ...SURVEYPOCPROFILE.ACTIVITYEXTENSION,
        ...SYLLABUSEVENTSPROFILE.ACTIVITYEXTENSION,
        ...TASKTRAINERSIMULATIONPROFILE.ACTIVITYEXTENSION,
        ...TINCANVOCABULARYPROFILE.ACTIVITYEXTENSION,
        ...VIDEOPROFILE.ACTIVITYEXTENSION,
        ...VIRTUALCLASSROOMPROFILE.ACTIVITYEXTENSION,
        ...VIRTUALPATIENTPROFILE.ACTIVITYEXTENSION,
        ...XAPIOPENBADGESPROFILE.ACTIVITYEXTENSION,
    }),
    CONTEXTEXTENSION: Object.freeze({
        ...ACADEMICASSESSMENTPROFILE.CONTEXTEXTENSION,
        ...ACROSSXPROFILE.CONTEXTEXTENSION,
        ...ACTIONABLEDATABOOKADBPROFILE.CONTEXTEXTENSION,
        ...ACTIVITYSTREAMSVOCABULARYPROFILE.CONTEXTEXTENSION,
        ...ADLVOCABULARYPROFILE.CONTEXTEXTENSION,
        ...AUDIOPROFILE.CONTEXTEXTENSION,
        ...BOLLPROFILE.CONTEXTEXTENSION,
        ...CMI5PROFILE.CONTEXTEXTENSION,
        ...CONTENTREPOSITORYPROFILE.CONTEXTEXTENSION,
        ...COREPROFILE.CONTEXTEXTENSION,
        ...DATASECURITYMODULEPROFILE.CONTEXTEXTENSION,
        ...DODISDPROFILE.CONTEXTEXTENSION,
        ...EDACOURSEPROFILE.CONTEXTEXTENSION,
        ...EMOTIONAPIPROFILE.CONTEXTEXTENSION,
        ...FEEDBACKINTERACTIONPROFILE.CONTEXTEXTENSION,
        ...FLASHCARDSPROFILE.CONTEXTEXTENSION,
        ...FLYINGPROFILE.CONTEXTEXTENSION,
        ...GBLXAPIK12EDUCATIONAPPSPROFILE.CONTEXTEXTENSION,
        ...GENERALVOCABULARYPROFILE.CONTEXTEXTENSION,
        ...GEOLOCATIONPROFILE.CONTEXTEXTENSION,
        ...GROUNDTRAININGPROFILE.CONTEXTEXTENSION,
        ...HROPENASSESSMENTSPROFILE.CONTEXTEXTENSION,
        ...HYFLEXCLASSROOMPROFILE.CONTEXTEXTENSION,
        ...IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE.CONTEXTEXTENSION,
        ...INITIALIZEDHHINITPROFILE.CONTEXTEXTENSION,
        ...LANGUAGEEXPERIMENTPROFILE.CONTEXTEXTENSION,
        ...LEARNINGMANAGEMENTSYSTEMPROFILE.CONTEXTEXTENSION,
        ...TLAPROFILE.CONTEXTEXTENSION,
        ...NAVYASSESSMENTPROFILE.CONTEXTEXTENSION,
        ...NAVYCOMMONREFERENCEPROFILE.CONTEXTEXTENSION,
        ...NAVYELEARNINGPROFILE.CONTEXTEXTENSION,
        ...NELCPROFILE.CONTEXTEXTENSION,
        ...OPENEDXPROFILE.CONTEXTEXTENSION,
        ...ORPHANCONTAINERPROFILE.CONTEXTEXTENSION,
        ...PDFANNOTATORPROFILE.CONTEXTEXTENSION,
        ...PERFORMANCESUPPORTPROFILE.CONTEXTEXTENSION,
        ...SCORMPROFILE.CONTEXTEXTENSION,
        ...SERIOUSGAMESPROFILE.CONTEXTEXTENSION,
        ...SIMULATIONBASEPROFILE.CONTEXTEXTENSION,
        ...SOCIALMEDIAPROFILE.CONTEXTEXTENSION,
        ...SURVEYPOCPROFILE.CONTEXTEXTENSION,
        ...SYLLABUSEVENTSPROFILE.CONTEXTEXTENSION,
        ...TASKTRAINERSIMULATIONPROFILE.CONTEXTEXTENSION,
        ...TINCANVOCABULARYPROFILE.CONTEXTEXTENSION,
        ...VIDEOPROFILE.CONTEXTEXTENSION,
        ...VIRTUALCLASSROOMPROFILE.CONTEXTEXTENSION,
        ...VIRTUALPATIENTPROFILE.CONTEXTEXTENSION,
        ...XAPIOPENBADGESPROFILE.CONTEXTEXTENSION,
    }),
    RESULTEXTENSION: Object.freeze({
        ...ACADEMICASSESSMENTPROFILE.RESULTEXTENSION,
        ...ACROSSXPROFILE.RESULTEXTENSION,
        ...ACTIONABLEDATABOOKADBPROFILE.RESULTEXTENSION,
        ...ACTIVITYSTREAMSVOCABULARYPROFILE.RESULTEXTENSION,
        ...ADLVOCABULARYPROFILE.RESULTEXTENSION,
        ...AUDIOPROFILE.RESULTEXTENSION,
        ...BOLLPROFILE.RESULTEXTENSION,
        ...CMI5PROFILE.RESULTEXTENSION,
        ...CONTENTREPOSITORYPROFILE.RESULTEXTENSION,
        ...COREPROFILE.RESULTEXTENSION,
        ...DATASECURITYMODULEPROFILE.RESULTEXTENSION,
        ...DODISDPROFILE.RESULTEXTENSION,
        ...EDACOURSEPROFILE.RESULTEXTENSION,
        ...EMOTIONAPIPROFILE.RESULTEXTENSION,
        ...FEEDBACKINTERACTIONPROFILE.RESULTEXTENSION,
        ...FLASHCARDSPROFILE.RESULTEXTENSION,
        ...FLYINGPROFILE.RESULTEXTENSION,
        ...GBLXAPIK12EDUCATIONAPPSPROFILE.RESULTEXTENSION,
        ...GENERALVOCABULARYPROFILE.RESULTEXTENSION,
        ...GEOLOCATIONPROFILE.RESULTEXTENSION,
        ...GROUNDTRAININGPROFILE.RESULTEXTENSION,
        ...HROPENASSESSMENTSPROFILE.RESULTEXTENSION,
        ...HYFLEXCLASSROOMPROFILE.RESULTEXTENSION,
        ...IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE.RESULTEXTENSION,
        ...INITIALIZEDHHINITPROFILE.RESULTEXTENSION,
        ...LANGUAGEEXPERIMENTPROFILE.RESULTEXTENSION,
        ...LEARNINGMANAGEMENTSYSTEMPROFILE.RESULTEXTENSION,
        ...TLAPROFILE.RESULTEXTENSION,
        ...NAVYASSESSMENTPROFILE.RESULTEXTENSION,
        ...NAVYCOMMONREFERENCEPROFILE.RESULTEXTENSION,
        ...NAVYELEARNINGPROFILE.RESULTEXTENSION,
        ...NELCPROFILE.RESULTEXTENSION,
        ...OPENEDXPROFILE.RESULTEXTENSION,
        ...ORPHANCONTAINERPROFILE.RESULTEXTENSION,
        ...PDFANNOTATORPROFILE.RESULTEXTENSION,
        ...PERFORMANCESUPPORTPROFILE.RESULTEXTENSION,
        ...SCORMPROFILE.RESULTEXTENSION,
        ...SERIOUSGAMESPROFILE.RESULTEXTENSION,
        ...SIMULATIONBASEPROFILE.RESULTEXTENSION,
        ...SOCIALMEDIAPROFILE.RESULTEXTENSION,
        ...SURVEYPOCPROFILE.RESULTEXTENSION,
        ...SYLLABUSEVENTSPROFILE.RESULTEXTENSION,
        ...TASKTRAINERSIMULATIONPROFILE.RESULTEXTENSION,
        ...TINCANVOCABULARYPROFILE.RESULTEXTENSION,
        ...VIDEOPROFILE.RESULTEXTENSION,
        ...VIRTUALCLASSROOMPROFILE.RESULTEXTENSION,
        ...VIRTUALPATIENTPROFILE.RESULTEXTENSION,
        ...XAPIOPENBADGESPROFILE.RESULTEXTENSION,
    })
});

/**
 * The Object Class of a Statement
 */
class ObjectStatement {
    /**
     * The constructor of the ObjectStatement class
     * 
     * @param {string} id the id of the object
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} type the type of the object
     * @param {string} baseURI the base URI for the object construction
     * @param {string} language the language for the name and description (default: "en")
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id, type, baseURI, language = "en", name = null, description = null) {
        if(isUri(id)) {
            this.id = id;
        } else {
            this.id = setAsUri(id, baseURI);
        }
        this.definitionType = setAsUri(type, baseURI);
        if(name) {
            this.definitionName.set(language, name);
        }
        if(description) {
            this.definitionDescription.set(language, description);
        }
        this.defaultURI = baseURI;
    }

    /**
     * The ID of the Object
     * 
     * @type {string}
     */
    id;
    /**
     * The type of the Object
     * 
     * @type {string}
     */
    definitionType;
    /**
     * The name of the Object
     * 
     * @type {Map<string, string>}
     */
    definitionName = new Map();
    /**
     * The description of the Object
     * 
     * @type {Map<string, string>}
     */
    definitionDescription = new Map();

    /**
     * The extensions of the Object definition
     *
     * @type {Object}
     */
    definitionExtensions;

    /**
     * default URI for the object construction
     * @type {string}
     * */
    defaultURI;

    /**
     * Set the name of the Object definition
     * @param {string} lang - The language code
     * @param {string} name - The name of the Object definition
     */
    setObjectDefinitionName(lang, name) {
        this.definitionName.set(lang, name);
    }

    /**
     * Set the description of the Object definition
     * @param {string} lang - The language code
     * @param {string} description - The description of the Object definition
     */
    setObjectDefinitionDescription(lang, description) {
        this.definitionDescription.set(lang, description);
    }

    /**
     * Set the extensions of the Object definition
     * @param {Object} ext extensions object
     */
    setExtensions(ext) {
        this.definitionExtensions = ext;
    }

    /**
     * Add or set a single extension key-value pair in the Object definition
     * @param {typeof ALL.ACTIVITYEXTENSION[keyof typeof ALL.ACTIVITYEXTENSION]|string} key extension key
     * @param {any} value extension value
     */
    setExtension(key, value) {
        if(!this.definitionExtensions) {
            this.definitionExtensions = {};
        }
        this.definitionExtensions[key] = value;
    }

    /**
     * Convert to xAPI object, including interaction activities if set
     * @returns {Object}
     */
    toXAPI() {
        var object = {};
        if (this.id) {
            object.id = this.id;
        }
        object.definition = {};
        if (this.definitionName && this.definitionName.size > 0) {
            object.definition.name = Object.fromEntries(this.definitionName);
        }
        if (this.definitionDescription && this.definitionDescription.size > 0) {
            object.definition.description = Object.fromEntries(this.definitionDescription);
        }
        if (this.definitionType) {
            object.definition.type = this.definitionType;
        }
        if (this.definitionExtensions) {
            object.definition.extensions = this.definitionExtensions;
        }
        return object;
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.definitionType + ',' + this.id.replaceAll(',', '\\,');
    }

    /**
     * Create an ObjectStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {ObjectStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return null;
        const id = xapiObj.id;
        const type = xapiObj.definition && xapiObj.definition.type ? xapiObj.definition.type : undefined;
        const obj = new ObjectStatement(id, type, baseURI);
        for (const [lang, name] of Object.entries(xapiObj.definition?.name || {})) {
            obj.setObjectDefinitionName(lang, name);
        }
        for (const [lang, desc] of Object.entries(xapiObj.definition?.description || {})) {
            obj.setObjectDefinitionDescription(lang, desc);
        }
        if (xapiObj.definition?.extensions) {
            obj.setExtensions(xapiObj.definition.extensions);
        }
        return obj;
    }
}

/**
 * The Context Class of a Statement
 */
class ContextStatement {
    /**
     * Constructor of the ContextStatement class
     * 
     * @param {string} base default URI for the context construction
     * @param {string} platform platform of context
     * @param {typeof ALL.CATEGORYID[keyof typeof ALL.CATEGORYID]} categoryId
     * @param {string} registrationId registration id of context
     */
    constructor(base, platform, registrationId=null, categoryId=null) {
        this.defaultURI = base;
        this.platform = platform;
        if(registrationId != null) {
            this.registration=registrationId;
        } else {
            this.registration=v4();
        }
        // Initialize contextActivities with category by default
        this.contextActivities = {};
        this.addCategory(categoryId);
    }

    /**
     * Add a category to the context
     * @param {typeof ALL.CATEGORYID[keyof typeof ALL.CATEGORYID]} categoryId
     */
    addCategory(categoryId) {
        if(categoryId) {
            if(!this.contextActivities.category) {
                 this.contextActivities.category = [];
            }
            this.contextActivities.category.push(
                {
                    id: setAsUri(categoryId, this.defaultURI),
                    definition: {
                        type : ALL.ACTIVITYTYPES.PROFILE
                    }
                }
            );
        }
    }

    /** 
     * default URI for the context construction
     * @type {string}
      */
    defaultURI;

    /** 
     * Registration Id of the Context
     * 
     * @type {string}
     */
    registration;

    
    /** 
     * Platform of the Context
     * 
     * @type {string}
     */
    platform;

    /** 
     * Extensions of the Context
     * 
     * @type {Object}
     */
    extensions;

    /**
     * Context Activities (parent, grouping, category, other)
     * @type {Object}
     */
    contextActivities;

    /**
     * Add or set a context activity
     * @param {typeof STATEMENT.CONTEXT.ACTIVITIES[keyof typeof STATEMENT.CONTEXT.ACTIVITIES]} type
     * @param {ObjectStatement|ObjectStatement[]|string} activity activity object(s) or activity id
     * @param {string} [activityType] activity type when activity is an id
     */
    addContextActivity(type, activity, activityType) {
        if (typeof activity === 'string') {
              activity = new ObjectStatement(activity, activityType, this.defaultURI);
        }
        if ([STATEMENT.CONTEXT.ACTIVITIES.PARENT, STATEMENT.CONTEXT.ACTIVITIES.GROUPING, STATEMENT.CONTEXT.ACTIVITIES.CATEGORY, STATEMENT.CONTEXT.ACTIVITIES.OTHER].includes(type)) {
            // Accept single object or array
            if (!this.contextActivities[type]) {
                this.contextActivities[type] = [];
            }
            if (Array.isArray(activity)) {
                this.contextActivities[type].push(...activity);
            } else {
                this.contextActivities[type].push(activity);
            }
        }
    }
    
    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        // Deep copy and serialize contextActivities
        const serializedContextActivities = {};
        for (const [type, activities] of Object.entries(this.contextActivities)) {
            serializedContextActivities[type] = activities.map(act => {
                // If it has a toXAPI method, use it
                if (act && typeof act.toXAPI === 'function') {
                    const obj = act.toXAPI();
                    // Flatten definition fields to top-level for contextActivities (xAPI spec)
                    return {
                        id: obj.id,
                        ...(obj.definition && obj.definition.type ? { definition: { type: obj.definition.type } } : {})
                    };
                }
                // Otherwise, assume it's already a plain object
                return act;
            });
        }
        return {
            platform: this.platform,
            registration: this.registration,
            contextActivities: serializedContextActivities,
            ...(this.extensions ? { extensions: this.extensions } : {})
        };
    }

    /**
     * Set the extensions of the Context
     * @param {Object} ext extensions object
     */
    setExtensions(ext) {
        this.extensions = ext;
    }

    /**
     * Add or set a single extension key-value pair
     * @param {typeof ALL.CONTEXTEXTENSION[keyof typeof ALL.CONTEXTEXTENSION]|string} key extension key
     * @param {any} value extension value
     */
    setExtension(key, value) {
        if(!this.extensions) {
            this.extensions = {};
        }
        this.extensions[key] = value;
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }

    /**
     * Create a ContextStatement from xAPI context object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {ContextStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return null;
        const base = baseURI;
        const platform = xapiObj.platform;
        const registrationId = xapiObj.registration;
        const ctx = new ContextStatement(base, platform, registrationId);
        if (xapiObj.contextActivities) ctx.contextActivities = xapiObj.contextActivities;
        if (xapiObj.extensions) ctx.extensions = xapiObj.extensions;
        return ctx;
    }
}

/**
 * The Verb Class  of a Statement
 */
class VerbStatement {
    /**
     * Constructor of VerbStatement class
     * 
     * @param {typeof ALL.VERBS[keyof typeof ALL.VERBS]|string} id The verb id of the statement
     * @param {string} baseURI The base URI for the statement
     */
    constructor(id, baseURI) {
        if(isUri(id)) {
            this.id = id;
            this.display.set('en', id.split('/').pop()); // Default display is the last part of the URI
        } else {
            this.id = setAsUri(id, baseURI);
            this.display.set('en', id);
        }
    }
    
    /**
     * The Verb Id 
     * @type {string}
     */
    id;

    /**
     * The Verb display 
     * @type {Map<string, string>}
     */
    display = new Map();

    /**
     * Add or set a verb display
     * @param {string} lang
     * @param {string} display
     */
    addDisplay(lang, display) {
        this.display.set(lang, display);
    }

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        var verb = {};
        if(this.id) {
            verb.id = this.id;
        }
        
        if(this.display) {
            verb.display = this.display;
        }
        return verb;
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.id;
    }

    /**
     * Create a VerbStatement from xAPI verb object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {VerbStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return null;
        const id = xapiObj.id;
        const display = xapiObj.display;
        const verb = new VerbStatement(id, baseURI);
        if (display) {
            for (const [lang, text] of Object.entries(display)) {
                verb.addDisplay(lang, text);
            }
        }
        return verb;
    }
}

/**
 * The Result Class of a Statement
 */
class ResultStatement {
    /**
     * Constructor of the ResultStatement class
     * 
     * @param {string} defaultURI The default URI for the extensions
     */
    constructor(defaultURI) {
        this.defaultURI = defaultURI;
        this.Score = null;
        this.Success = null;
        this.Completion = null;
        this.Response = null;
        this.Duration = null;
        this.Extensions = {};
    }

    /**
     * The ID of the Result
     * 
     * @type {string}
     */
    defaultURI;

    /**
     * The Score of the Result
     * 
     * @type {Object}
     */
    Score;
    /**
     * The success status of the Result
     * 
     * @type {boolean}
     */
    Success;
    /**
     * The Completion status of the Result
     * 
     * @type {boolean}
     */
    Completion;
    /**
     * The response of the Result
     * 
     * @type {string}
     */
    Response;
    /**
     * The duration of the Result
     * 
     * @type {string}
     */
    Duration;
    /**
     * The Extensions of the Result
     * 
     * @type {Object}
     */
    Extensions;

    /**
     * Check if the result is empty or not
     * @returns {boolean}
     */
    isEmpty() {
        return (this.Score == null) && (this.Duration == null) && (this.Success == null) && (this.Completion == null) && (this.Response == null) && (Object.keys(this.Extensions).length == 0);
    }

    /**
     * Set extensions from list
     * @param {Object} extensions extension list
     */
    setExtensions(extensions) {
        for (var key in extensions) {
            this.setExtension(key,extensions[key]);
        }
    }

    /**
     * Set result extension for key value
     * @param {typeof ALL.RESULTEXTENSION[keyof typeof ALL.RESULTEXTENSION]|string} key the key of the extension
     * @param {*} value the value of the extension
     */
    setExtension(key, value) {
        switch (key.toLowerCase()) {
            case 'success': { this.Success = value; break; }
            case 'completion': { this.Completion = value; break; }
            case 'response': { this.Response = value; break; }
            case 'score': { this.Score = this.setScoreValue("raw", value); break; }
            case 'duration': { this.Duration = value; break; }
            default: { this.Extensions[key] = value; break; }
        }
    }

    /**
     * Set the score of the statement
     * @param {string} key the key for the score 
     * @param {number} value the score 
     */
    setScoreValue(key, value) {
        if(! this.Score) {
            this.Score = {};
        }
        if(STATEMENT.RESULT.SCORE.hasOwnProperty(key.toUpperCase())) {
            this.Score[key] = Number(value);
        }    
    }

        /**
     * Set the score of the statement
     * @param {number} raw the raw score
     * @param {number} min the min score
     * @param {number} max the max score
     * @param {number} scaled the scaled score
     */
    setScore(raw, min, max, scaled) {
        if (raw) {
            this.setScoreRaw(raw);
        }

        if (min) {
            this.setScoreMin(min);
        }

        if (max) {
            this.setScoreMax(max);
        }

        if (scaled) {
            this.setScoreScaled(scaled);
        }
    }

        /**
     * Set the raw score of the statement
     * @param {number} raw the raw score 
     */
    setScoreRaw(raw) {
        this.setScoreValue(STATEMENT.RESULT.SCORE.RAW, raw);
    }
    
    /**
     * Set the min score of the statement
     * @param {number} min the min score 
     */
    setScoreMin(min) {
        this.setScoreValue(STATEMENT.RESULT.SCORE.MIN, min);
    }

    /**
     * Set the max score of the statement
     * @param {number} max the max score 
     */
    setScoreMax(max) {
        this.setScoreValue(STATEMENT.RESULT.SCORE.MAX, max);
    }

    /**
     * Set the scaled score of the statement
     * @param {number} scaled the scaled score 
     */
    setScoreScaled(scaled) {
        this.setScoreValue(STATEMENT.RESULT.SCORE.SCALED, scaled);
    }

    /**
     * Set completion status of the statement
     * @param {boolean} value the completion status
     */
    setCompletion(value) {
        this.setExtension(STATEMENT.RESULT.COMPLETION, value);
    }

    /**
     * Set success status of the statement
     * @param {boolean} value the success status
     */
    setSuccess(value) {
        this.setExtension(STATEMENT.RESULT.SUCCESS, value);
    }

    /**
     * Set duration of the statement
     * @param {Date} init init date of statement
     * @param {Date} end end date of statement
     */
    setDuration(init, end) {
        const durationInMs = end.getTime()-init.getTime();
        const durationInSec = durationInMs / 1000;
        const seconds = durationInSec % 60;
        const minutes = Math.floor(durationInSec / 60) % 60;
        const hours = Math.floor(durationInSec / 3600) % 24;
        const days = Math.floor(durationInSec / 86400);

        // Construct the ISO 8601 duration string
        const isoDuration = `P${days}DT${hours}H${minutes}M${seconds}S`;
        this.setExtension(STATEMENT.RESULT.DURATION, isoDuration);
    }

    /**
     * Set response of the statement
     * @param {string} value the response
     */
    setResponse(value) {
        this.setExtension(STATEMENT.RESULT.RESPONSE, value);
    }

    /**
     * Set progress status of the statement
     * @param {number} value the progress status
     */
    setProgress(value) {
        this.setExtension(STATEMENT.RESULT.PROGRESS, value);
    }

    /**
     * Set result extension for key of the statement
     * @param {typeof ALL.RESULTEXTENSION[keyof typeof ALL.RESULTEXTENSION]|string} key the key of the extension
     * @param {string} value the value of the extension
     */
    setVar(key,value) {
        this.setExtension(key, value);
    }

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        var ret = {};

        if (this.Success !== null) {
            ret.success = (this.Success) ? true : false;
        }

        if (this.Completion !== null) {
            ret.completion = (this.Completion) ? true : false;
        }

        if (this.Response) {
            ret.response = this.Response.toString();
        }

        if (this.Score !== null) {
            ret.score = this.Score;
        }

        if (this.Duration !== null) {
            ret.duration = this.Duration;
        }


        if (this.Extensions !== null && obsize(this.Extensions) > 0) {
            ret.extensions = this.Extensions;

            for (var key in this.Extensions) {
                if (key in ALL.RESULTEXTENSION) {
                    this.Extensions[ALL.RESULTEXTENSION[key]] = this.Extensions[key];
                    delete this.Extensions[key];
                } else {
                    var newuri= setAsUri(key, this.defaultURI);
                    this.Extensions[newuri] = this.Extensions[key];
                    if(newuri !== key) {
                        delete this.Extensions[key];
                    }
                }
            }
        }

        return ret;
    }

    /**
     * Create a ResultStatement from xAPI result object
     * @param {Object} xapiObj
     * @param {string} baseURI
     * @returns {ResultStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return new ResultStatement(baseURI);
        const result = new ResultStatement(baseURI);
        if ('score' in xapiObj) result.Score = xapiObj.score;
        if ('success' in xapiObj) result.Success = xapiObj.success;
        if ('completion' in xapiObj) result.Completion = xapiObj.completion;
        if ('response' in xapiObj) result.Response = xapiObj.response;
        if ('duration' in xapiObj) result.Duration = xapiObj.duration;
        if ('extensions' in xapiObj) result.setExtensions(xapiObj.extensions);
        return result;
    }
    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        var success = (this.Success !== null) ? ',success,' + this.Success.toString() : '';
        var completion = (this.Completion !== null) ? ',completion,' + this.Completion.toString() : '';
        var response = '';
        if (this.Response) {
            let respStr = (typeof this.Response === 'string') ? this.Response : String(this.Response);
            response = ',response,' + respStr.replaceAll(',', '\,');
        }
        var score = '';

        if (exists(this.Score)) {
            if (exists(this.Score.raw)) {
                score += ',score,' + this.Score.raw;
            }

            if (exists(this.Score.min)) {
                score += ',score_min,' + this.Score.min;
            }

            if (exists(this.Score.max)) {
                score += ',score_max,' + this.Score.max;
            }

            if (exists(this.Score.scaled)) {
                score += ',score_scaled,' + this.Score.scaled;
            }
        }

        var result = success + completion + response + score;

        if (this.Extensions !== null && obsize(this.Extensions) > 0) {
            for (var key in this.Extensions) {
                result += ',' + key.replaceAll(',', '\\,') + ',';
                if (this.Extensions[key] !== null) {
                    if (typeof this.Extensions[key] === 'number') {
                        result += this.Extensions[key];
                    } else if (typeof this.Extensions[key] === 'string') {
                        result += this.Extensions[key].replaceAll(',', '\\,');
                    } else if (typeof this.Extensions[key] === 'object') {
                        if (ismap(this.Extensions[key])) {
                            var smap = '';

                            for (var k in this.Extensions[key]) {
                                if (typeof this.Extensions[key][k] === 'number') {
                                    smap += k + '=' + this.Extensions[key][k] + '-';
                                } else {
                                    smap += k + '=' + this.Extensions[key][k].replaceAll(',', '\\,') + '-';
                                }
                            }

                            result += smap.slice(0,-1);
                        }
                    } else {
                        result += this.Extensions[key];
                    }
                }
            }
        }

        return result;
    }
}

/**
 * Get the size of the object
 * @param {Object} obj the object to get the size
 * @returns {number}
 */
var obsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

/**
 * Check if is map
 * @param {Object} obj the object to check
 * @returns {boolean}
 */
var ismap = function(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            return false;
        }
    }
    return true;
};

/**
 * Check if exist
 * @param {Object} value the object to check
 * @returns {boolean}
 */
var exists = function(value) {
    return !(typeof value === 'undefined' || value === null);
};

/**
 * The Object Class of a Statement
 */
class InteractionObjectStatement extends ObjectStatement {
    /**
        * The correctResponsesPattern property for interaction activities.
        * Internally it is always handled as an array of strings.
        * @type {string[]}
     */
    correctResponsesPattern;

    /**
     * The interactionType property for interaction activities (e.g., 'choice', 'fill-in', 'long-fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric', 'other')
     * @type {string}
     */ 
    interactionType;

    /**
     * The choices, scale, source, target, and steps properties for interaction activities, which are arrays of objects with id and description
     * Each item in choices/scale should be an object with an 'id' and a 'description' that can be a string or an object with language keys
     * @type {Array<{id: string, description: string|object}>}
     */
    choices;

    /**
     * The scale property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */

    scale;

    /**
     * The source property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */
    source;

    /**
     * The target property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */
    target;

    /**
     * The steps property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */
    steps;


    /**
     * Constructor for InteractionObjectStatement
     * @param {string} objectId - The identifier of the object (IRI or UUID)
     * @param {string} objectType - The type of the object (IRI)
     * @param {string} defaultURI - The default base URI to resolve relative IDs
     */
    constructor(objectId, objectType, defaultURI) {
        super(objectId, objectType, defaultURI);
    }

    /**
     * Set the interactionType for interaction activities
     * @param {typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES[keyof typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES]} interactionType
     */
    setInteractionType(interactionType, debug = false) {
        if(!this.interactionType) {
            this.interactionType = interactionType; // Set interactionType based on the first component type added if not already set
        } else if (this.interactionType !== interactionType) {
            // Handle case where component type differs from existing interactionType
            if (debug) {
                throw new Error(`Component type ${interactionType} does not match existing interactionType ${this.interactionType}`);
            } else {
                console.warn(`Adding component of type ${interactionType} to interaction with interactionType ${this.interactionType}`);
                return;
            }
        }
    }

    /**
     * Set the correctResponsesPattern array
     * @param {string|string[]} pattern
     */
    addCorrectResponsesPattern(pattern) {
        if (!this.correctResponsesPattern) {
            this.correctResponsesPattern = [];
        }
        const values = Array.isArray(pattern) ? pattern : [pattern];
        for (const value of values) {
            if (typeof value !== 'string') {
                continue;
            }
            const normalized = value.trim();
            if (!normalized) {
                continue;
            }
            if (!this.correctResponsesPattern.includes(normalized)) {
                this.correctResponsesPattern.push(normalized);
            }
        }
    }

    /**
     * Add a single choice with language support (for interaction activities)
     * @param {typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES[keyof typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES]} componentType - One of 'choices', 'scale', 'source', 'target', 'steps'
     * @param {string} id - The identifier for the choice
     * @param {string} lang - The language code (e.g., 'en')
     * @param {string} description - The description in the given language
     */
    addInteractionWithLang(componentType, id, lang, description) {
        // Find which property/properties this componentType maps to
        const componentsMap = STATEMENT.INTERACTIONOBJECT.INTERACTIONCOMPONENTS;
        let matched = false;
        for (const [interactionType, componentProps] of Object.entries(componentsMap)) {
            let typeKey = interactionType.toUpperCase();
            let interactionTypeValue = STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES[typeKey];
            if (componentType === interactionTypeValue) {
                matched = true;
                for (const prop of componentProps) {
                    if (!this[prop]) {
                        this[prop] = [];
                    }
                    let existing = this[prop].find(c => c.id === id);
                    if (existing) {
                        if (typeof existing.description !== 'object' || existing.description === null) {
                            existing.description = {};
                        }
                        existing.description[lang] = description;
                    } else {
                        let desc = {};
                        desc[lang] = description;
                        this[prop].push({ id, description: desc });
                    }
                }
            }
        }
        if (!matched) {
            console.warn(`Component type ${componentType} does not map to any INTERACTIONCOMPONENTS property.`);
        }
    }

    toXAPI() {
        var object = super.toXAPI();
        // Add interaction activity properties if present
        if (this.interactionType) {
            object.definition.interactionType = this.interactionType;
        }
        if (this.correctResponsesPattern) {
            if (this.correctResponsesPattern.length === 1) {
                object.definition.correctResponsesPattern = this.correctResponsesPattern[0];
            } else {
                object.definition.correctResponsesPattern = this.correctResponsesPattern;
            }
        }
        // Use INTERACTIONCOMPONENTS mapping for dynamic property assignment
        const componentsMap = STATEMENT.INTERACTIONOBJECT.INTERACTIONCOMPONENTS;
        for (const componentProps of Object.values(componentsMap)) {
            for (const prop of componentProps) {
                if (this[prop]) {
                    // For choices/scale, ensure each item is {id, description: {lang: text}}
                    if ((prop === "choices" || prop === "scale") && Array.isArray(this[prop])) {
                        object.definition[prop] = this[prop].map(item => {
                            if (item.id && item.description && typeof item.description === 'object') {
                                return { id: item.id, description: item.description };
                            } else if (item.id && typeof item.description === 'string') {
                                // fallback: wrap string in default lang
                                return { id: item.id, description: { en: item.description } };
                            } else {
                                return item;
                            }
                        });
                    } else {
                        object.definition[prop] = this[prop];
                    }
                }
            }
        }
        return object;
    }

    toCSV() {
        let csv = super.toCSV();
        if (this.interactionType) {
            csv += `,${this.interactionType}`;
        }
        if (this.correctResponsesPattern) {
            csv += `,${this.correctResponsesPattern.join('|')}`;
        }
        [STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES.CHOICES, STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES.SCALE, STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES.MATCHING, STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES.STEPS].forEach((key) => {
            if (this[key]) {
                csv += `,${key}:${this[key].map(item => item.id).join('|')}`;
            }
        });
        return csv;
    }

    /**
     * Create an InteractionObjectStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {InteractionObjectStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return null;
        const id = xapiObj.id;
        const type = xapiObj.definition && xapiObj.definition.type ? xapiObj.definition.type : undefined;
        const obj = new InteractionObjectStatement(id, type, baseURI);
        if (xapiObj.definition) {
            if (xapiObj.definition.interactionType) obj.interactionType = xapiObj.definition.interactionType;
            if (xapiObj.definition.correctResponsesPattern) {
                obj.correctResponsesPattern = [];
                obj.addCorrectResponsesPattern(xapiObj.definition.correctResponsesPattern);
            }
            // Use INTERACTIONCOMPONENTS mapping for dynamic property assignment
            const componentsMap = STATEMENT.INTERACTIONOBJECT.INTERACTIONCOMPONENTS;
            const seen = new Set();
            for (const componentProps of Object.values(componentsMap)) {
                for (const prop of componentProps) {
                    if (!seen.has(prop) && xapiObj.definition[prop]) {
                        obj[prop] = xapiObj.definition[prop];
                        seen.add(prop);
                    }
                }
            }
        }
        return obj;
    }
}

/**
 * xAPI Attachment object (5.2.2.6)
 */
class AttachmentStatement {
    /**
     * @param {string} usageType - IRI that identifies attachment usage
     * @param {Object<string,string>} display - Language map title
     * @param {string} contentType - Internet media type
     * @param {number} length - Content length in octets
     * @param {string} sha2 - SHA-2 hash of content
     * @param {string} [defaultURI] - Base URI used if usageType is not absolute
     */
    constructor(usageType, display, contentType, length, sha2, defaultURI = "") {
        this.defaultURI = defaultURI;
        this.usageType = usageType ? setAsUri(usageType, defaultURI) : null;
        this.display = display || {};
        this.contentType = contentType;
        this.length = length;
        this.sha2 = sha2;
    }

    /** @type {string|null} */
    usageType;

    /** @type {Object<string,string>} */
    display;

    /** @type {Object<string,string>|undefined} */
    description;

    /** @type {string|undefined} */
    contentType;

    /** @type {number|undefined} */
    length;

    /** @type {string|undefined} */
    sha2;

    /** @type {string|undefined} */
    fileUrl;

    /** @type {string} */
    defaultURI;

    /**
     * Sets the attachment description language map
     * @param {Object<string,string>} description
     * @returns {AttachmentStatement}
     */
    setDescription(description) {
        this.description = description;
        return this;
    }

    /**
     * Sets file URL where the attachment can be fetched
     * @param {string} fileUrl - IRL/URL of the attachment
     * @returns {AttachmentStatement}
     */
    setFileUrl(fileUrl) {
        if (fileUrl) {
            this.fileUrl = isUri(fileUrl) ? fileUrl : setAsUri(fileUrl, this.defaultURI);
        }
        return this;
    }

    /**
     * Validate required xAPI attachment fields
     * @returns {boolean}
     */
    isValid() {
        return Boolean(
            this.usageType &&
            this.display &&
            Object.keys(this.display).length > 0 &&
            this.contentType &&
            Number.isInteger(this.length) &&
            this.length >= 0 &&
            this.sha2
        );
    }

    /**
     * Serialize attachment to xAPI object
     * @returns {Object}
     */
    toXAPI() {
        const xapi = {
            usageType: this.usageType,
            display: this.display,
            contentType: this.contentType,
            length: this.length,
            sha2: this.sha2
        };
        if (this.description && Object.keys(this.description).length > 0) {
            xapi.description = this.description;
        }
        if (this.fileUrl) {
            xapi.fileUrl = this.fileUrl;
        }
        return xapi;
    }

    /**
     * Creates an AttachmentStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} [baseURI]
     * @returns {AttachmentStatement}
     */
    static fromXAPI(xapiObj, baseURI = "") {
        const attachment = new AttachmentStatement(
            xapiObj.usageType,
            xapiObj.display,
            xapiObj.contentType,
            xapiObj.length,
            xapiObj.sha2,
            baseURI
        );
        if (xapiObj.description) {
            attachment.setDescription(xapiObj.description);
        }
        if (xapiObj.fileUrl) {
            attachment.setFileUrl(xapiObj.fileUrl);
        }
        return attachment;
    }
}

/**
* Statement class
*/
class Statement {
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {typeof ALL.VERBS[keyof typeof ALL.VERBS]|string} verbId verb id of the statement
     * @param {string} objectId object id of the statement
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor, verbId, objectId, objectType, context, defaultURI) {
        this.id = v4();
        this.actor = actor;
        this.verb = new VerbStatement(verbId, defaultURI);
        this.defaultURI = defaultURI;
        if(objectType === ALL.ACTIVITYTYPES.CMI_INTERACTION) {
            this.object = new InteractionObjectStatement(objectId, objectType, this.defaultURI);
        } else {
            this.object = new ObjectStatement(objectId, objectType, this.defaultURI);
        }
        this.timestamp = new Date();
        this.context = context;
        this.version = "1.0.3";
        this.result = new ResultStatement(this.defaultURI);
        this.attachments = [];
    }

    /**
     * Create a Statement from a plain object (copy-constructor)
     * @param {Object} statementObj
     * @returns {Statement}
     */
    static fromObject(statementObj) {
        const stmt = Object.create(Statement.prototype);
        Object.assign(stmt, statementObj);
        return stmt;
    }
    /**
     * Id of the statement
     * @type {string}
     */
    id;
    /**
     * Version of the statement
     * @type {string}
     */
    version;
    /**
     * default URI of the statement
     * @type {string}
     */
    defaultURI;
    /**
     * Actor of the statement
     * @type {ActorStatement}
     */
    actor;
    /**
     * Verb of the statement
     * @type {VerbStatement}
     */
    verb;
    /**
     * Object of the statement
     * @type {ObjectStatement}
     */
    object;
    /**
     * Timestamp of the statement
     * @type {Date}
     */
    timestamp;
    /**
     * Context of the statement
     * @type {ContextStatement}
     */
    context;
    /**
     * Result of the statement
     * @type {ResultStatement}
     */
    result;

    /**
     * Attachments associated with the statement
     * @type {AttachmentStatement[]}
     */
    attachments;

    
    /**
     * Convert to xAPI format
     * @returns {Object}
     */
    toXAPI() {
        var xapiTrace={};
        if(this.id) {
            xapiTrace.id = this.id;
        }
        if(this.actor) {
            xapiTrace.actor = this.actor.toXAPI();
        }
        if(this.verb) {
            xapiTrace.verb = this.verb.toXAPI();
        }
        if(this.object) {
            xapiTrace.object = this.object.toXAPI();
        }
        if(!this.result.isEmpty()) {
            xapiTrace.result = this.result.toXAPI();
        }
        if(this.context) {
            xapiTrace.context = this.context.toXAPI();
        }
        if(this.timestamp) {
            xapiTrace.timestamp = this.timestamp.toISOString();
        }
        if(this.version) {
            xapiTrace.version = this.version;
        }
        if (Array.isArray(this.attachments) && this.attachments.length > 0) {
            xapiTrace.attachments = this.attachments.map((attachment) =>
                attachment && typeof attachment.toXAPI === 'function' ? attachment.toXAPI() : attachment
            );
        }
        return xapiTrace;
    }

    /**
     * Create a Statement from an xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI default URI for the statement construction (optional)
     * @returns {Statement}
     */
    static fromXAPI(xapiObj, baseURI) {
        // Actor
        const actor = ActorStatement.fromXAPI(xapiObj.actor);
        // Verb
        const verb = VerbStatement.fromXAPI(xapiObj.verb, baseURI);
        // Object
        let object;
        if (xapiObj.object && xapiObj.object.definition && xapiObj.object.definition.interactionType) {
            object = InteractionObjectStatement.fromXAPI(xapiObj.object, baseURI);
        } else {
            object = ObjectStatement.fromXAPI(xapiObj.object, baseURI);
        }
        // Context
        const context = xapiObj.context ? ContextStatement.fromXAPI(xapiObj.context, baseURI) : null;
        // Result
        const result = xapiObj.result ? ResultStatement.fromXAPI(xapiObj.result, baseURI) : null;

        // Create Statement instance (bypass constructor)
        const stmt = Object.create(Statement.prototype);
        stmt.id = xapiObj.id || v4();
        stmt.actor = actor;
        stmt.verb = verb;
        stmt.object = object;
        stmt.context = context;
        stmt.result = result;
        stmt.timestamp = xapiObj.timestamp ? new Date(xapiObj.timestamp) : new Date();
        stmt.version = xapiObj.version || "1.0.3";
        stmt.defaultURI = baseURI;
        stmt.attachments = Array.isArray(xapiObj.attachments)
            ? xapiObj.attachments.map((attachment) => AttachmentStatement.fromXAPI(attachment, baseURI))
            : [];
        return stmt;
    }
    /**
     * Convert to CSV format
     * 
     * @returns {String}
     */
    toCSV() {
        var csv=[];
        csv.push(this.timestamp.toISOString());
        csv.push(this.verb.toCSV());
        csv.push(this.object.toCSV());
        var result='';
        if(!this.result.isEmpty()) {
            result=this.result.toCSV();
        }
        return `${csv.join(",")}${result}`;
    }
}

/**
* Statement class
*/
class LRSStatement extends Statement {
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {typeof ALL.VERBS[keyof typeof ALL.VERBS]} verbId verb id of the statement
     * @param {string} objectId object id of the statement
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor, verbId, objectId, objectType, context, defaultURI) {
        super(actor, verbId, objectId, objectType, context, defaultURI);
        this.authority=new ActorStatement({});
        this.stored = new Date();
    }

    /**
     * @param {Date} stored
     */
    stored;

    /**
     * @param {ActorStatement} authority
     **/
    authority;
    
        
    /**
     * Convert to xAPI format
     * @returns {Object} xAPI statement object
     */
    toXAPI() {
        return super.toXAPI();
    }

    /**
     * Create a Statement from an xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI default URI for the statement construction (optional)
     * @returns {Statement} A new Statement instance created from the xAPI object
     */
    static fromXAPI(xapiObj, baseURI) {
        return super.fromXAPI(xapiObj, baseURI);
    }

    /**
     * Convert to CSV format
     * 
     * @returns {String}
     */
    toCSV() {
        return super.toCSV();
    }
}

// ------------------------------------------------------------------
// 1) THE BUILDER


// ------------------------------------------------------------------
/**
 * Statement Builder Class
 */
class StatementBuilder {
  /**
   * XAPI Client 
   * @type {xAPITrackerAsset}
   */
    client;

    /**
     * Statement
     * @type {Statement}
     */
    statement;

    /**
     * Promise of Statement sent
     * @type {Promise<void>}
     */
    _sendPromise;

  /**
   * @param  {xAPITrackerAsset} xapiClient  any client that has a `.sendStatement(statement)` → Promise
   * @param  {Statement} initial     a partial Statement (actor, verb, object…)
   */
  constructor(xapiClient, initial) {
    this.client    = xapiClient;
    this.statement = initial;
    this._sendPromise = null;
  }

  // RESULT
  /**
   * Set success to statemement
   * @param {boolean} success 
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withSuccess(success) {
    this.statement.result.setSuccess(success);
    return this;
  }

/**
 * Sets score-related properties to statemement
 * @param {Partial<{raw: number; min: number; max: number; scaled: number}>} score - Score configuration
 * @returns {StatementBuilder} Returns the current instance for chaining
 */
  withScore(score) {
    this.statement.result.setScore(
      score.raw ?? score?.raw, 
      score.min ?? score?.min,
      score.max ?? score?.max,
      score.scaled ?? score?.scaled
    );
    return this;
}
  /**
   * Set raw score to statemement
   * @param {number} raw the raw score value
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreRaw(raw) {
    this.statement.result.setScoreRaw(raw);
    return this;
  }
  /**
   * Set min score to statemement
   * @param {number} min the min score value
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreMin(min) {
    this.statement.result.setScoreMin(min);
    return this;
  }
  /**
   * Set max score to statemement
   * @param {number} max the max score value
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreMax(max) {
    this.statement.result.setScoreMax(max);
    return this;
  }
  /**
   * Set scaled score to statemement
   * @param {number} scaled the scaled score value
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreScaled(scaled) {
    this.statement.result.setScoreScaled(scaled);
    return this;
  }

  /**
   * Set completion status to statement
   * @param {boolean} value completion status of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withCompletion(value) {
    this.statement.result.setCompletion(value);
    return this;
  }

  /**
   * Set duration to statement
   * @param {Date} init init date of statement
   * @param {Date} end end date of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withDuration(init, end) {
    this.statement.result.setDuration(init, end);
    return this;
  }

  /**
   * Set response to statement
   * @param {string} value response of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withResponse(value) {
    this.statement.result.setResponse(value);
    return this;
  }

  /**
   * Set progress to statement
   * @param {number} value progress of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withProgress(value) {
    this.statement.result.setProgress(value);
    return this;
  }

  /**
   * Add result extension to statement
   * @param {typeof ALL.RESULTEXTENSION[keyof typeof ALL.RESULTEXTENSION]|string} key key of the result extension
   * @param {*} value value of the result extension
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withResultExtension(key, value) {
    this.statement.result.setExtension(key, value);
    return this;
  }

  /**
     * Add result extensions as Object key/values list of the statement
     * @param {Object} extensions extensions list
     */
  withResultExtensions(extensions = {}) {
    this.statement.result.setExtensions(extensions);
    return this;
  }
  /**
   * Add context extension to statement
   * @param {typeof ALL.CONTEXTEXTENSION[keyof typeof ALL.CONTEXTEXTENSION]|string} key key of the context extension
   * @param {*} value value of the context extension
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withContextExtension(key, value) {
    this.statement.context.setExtension(key, value);
    return this;
  }
  
  /**
     * Add context activity to statement
     * @param {typeof STATEMENT.CONTEXT.ACTIVITIES[keyof typeof STATEMENT.CONTEXT.ACTIVITIES]} type
     * @param {string} activityId
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} activityType
     * @return {StatementBuilder} Returns the current instance for chaining
     */
  withContextActivity(type, activityId, activityType) {
    this.statement.context.addContextActivity(type, activityId, activityType);
    return this;
  }

  /**
     * Add context category to statement
     * @param {typeof ALL.CATEGORYID[keyof typeof ALL.CATEGORYID]} categoryId
     * @return {StatementBuilder} Returns the current instance for chaining
     */
  withContextCategory(categoryId) {
    this.statement.context.addCategory(categoryId);
    return this;
  }

  /**
   * Add or set a verb display
   * @param {string} lang
   * @param {string} display
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withVerbDisplay(lang, display) {
    this.statement.verb.addDisplay(lang, display);
    return this;
  }

  /**
   * Add or set a name of the Object definition
   * @param {string} lang
   * @param {Set<string>} list list of the Object definition names
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectDefinitionsName(lang, list) {
    for(const name of list) {
      this.statement.object.setObjectDefinitionName(lang, name);
    }
    return this;
  }

  /**
   * Add or set a description of the Object definition
   * @param {string} lang
   * @param {Set<string>} list list of the Object definition descriptions
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectDefinitionsDescription(lang, list) {
    for(const description of list) {
      this.statement.object.setObjectDefinitionDescription(lang, description);
    }
    return this;
  }
  /**
   * Add or set a name of the Object definition
   * @param {string} lang
   * @param {string} name name of the Object definition
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectDefinitionName(lang, name) {
    this.statement.object.setObjectDefinitionName(lang, name);
    return this;
  }
  /**
   * Add or set a description of the Object definition
   * @param {string} lang
   * @param {string} description description of the Object definition
   * @return {StatementBuilder} Returns the current instance for chaining
   * */ 
  withObjectDefinitionDescription(lang, description) {
    this.statement.object.setObjectDefinitionDescription(lang, description);
    return this;
  }

  /**
   * Add object/activity extension to statement object definition
   * @param {typeof ALL.ACTIVITYEXTENSION[keyof typeof ALL.ACTIVITYEXTENSION]|string} key key of the object extension
   * @param {*} value value of the object extension
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectExtension(key, value) {
    this.statement.object.setExtension(key, value);
    return this;
  }

  /**
   * Add object/activity extensions as Object key/values list
   * @param {Object} extensions extensions list
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectExtensions(extensions = {}) {
    this.statement.object.setExtensions(extensions);
    return this;
  }

  /**
   * Add or set an interaction component with language support (for interaction activities)
   * @param {string} type - One of 'choices', 'scale', 'source', 'target', 'steps'
   * @param {string} id - The identifier for the component
   * @param {string} lang - The language code (e.g., 'en')
   * @param {string} description - The description in the given language
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withInteractionWithLang(type, id, lang, description) {
    if(this.statement.object instanceof InteractionObjectStatement) {
      this.statement.object.addInteractionWithLang(type, id, lang, description);
    } else {
      if (this.client.settings.debug) {
        throw new Error("Trying to set interaction choice on a non-interaction object");
      } else {
        console.warn("Trying to set interaction choice on a non-interaction object");
        return this;
      }
    }
    return this;
  }

  /**
   * Add or set an interaction type for interaction activities
   * @param {string} type interaction type to set
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withInteractionType(type) {
    if(this.statement.object instanceof InteractionObjectStatement) {
      this.statement.object.setInteractionType(type);
    } else {
      if (this.client.settings.debug) {
        throw new Error("Trying to set interaction scale on a non-interaction object");
      } else {
        console.warn("Trying to set interaction choice on a non-interaction object");
        return this;
      }
    }
    return this;
  }
  
  /**
   * Add or set a correct responses pattern for interaction activities
   * @param {string|string[]} pattern correct responses pattern(s) to add
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withCorrectResponsesPattern(pattern) {
    if(this.statement.object instanceof InteractionObjectStatement) {
      this.statement.object.addCorrectResponsesPattern(pattern);
    } else {
      if (this.client.settings.debug) {
        throw new Error("Trying to set correct responses pattern on a non-interaction object");
      } else {
        console.warn("Trying to set correct responses pattern on a non-interaction object");
        return this;
      }
    }
    return this;
  }

  /**
   * Add one xAPI attachment to the statement
   * @param {AttachmentStatement|Object} attachment - Attachment instance or plain attachment object
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withAttachment(attachment) {
    if (!Array.isArray(this.statement.attachments)) {
      this.statement.attachments = [];
    }
    if (attachment instanceof AttachmentStatement) {
      this.statement.attachments.push(attachment);
    } else {
      this.statement.attachments.push(AttachmentStatement.fromXAPI(attachment, this.statement.defaultURI));
    }
    return this;
  }

  /**
   * Add multiple xAPI attachments to the statement
   * @param {Array<AttachmentStatement|Object>} attachments - List of attachments
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withAttachments(attachments = []) {
    for (const attachment of attachments) {
      this.withAttachment(attachment);
    }
    return this;
  }

  /**
   * Convert the built statement to xAPI format
   * @returns {Object} The xAPI statement object
   */
  toXAPI() {
    return this.statement.toXAPI();
  }

  /**
   * Sends a statement to the queue and returns a promise that resolves when the statement is processed.
   *
   * @returns {Promise} The promise sent
   */
  async send() {
    if (!this._sendPromise) {
      // @ts-ignore
      this._sendPromise = await this.client.enqueue(this.statement);
    }
    return this._sendPromise;
  }
}

class LRSStatementBuilder extends StatementBuilder {
    /**
     * Constructor of LRSStatementBuilder
     * @param {xAPITrackerAsset} xapiClient the Tracker
     * @param {object} initial the initial statement
     */
    constructor(xapiClient, initial) {
        super(xapiClient, initial);
    }

    /**
     * Statement
     * @type {LRSStatement}
     */
    statement;

    /**
     * Adds a context activity to the statement
     * @param {typeof STATEMENT.CONTEXT.ACTIVITIES[keyof typeof STATEMENT.CONTEXT.ACTIVITIES]} type - The context activity type from STATEMENT_BUILDER_IDS.CONTEXT.ACTIVITIES
     * @param {string} id - The IRI identifier of the context activity
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} activityType - The activity type IRI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withContextActivity(type, id, activityType) {
        this.statement.context.addContextActivity(type, id, activityType);
        return this;
    }

    /**
     * Sets the actor using an account identifier
     * @param {string} accountName - The account name
     * @param {string} accountHomePage - The home page IRI of the account service provider
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorAccount(accountName, accountHomePage) {
        this.statement.actor.setActor('account', { name: accountName, homePage: accountHomePage });
        return this;
    }

    /**
     * Sets the actor using an mbox (mailto URI)
     * @param {string} mbox - The mailto URI of the actor (e.g. 'mailto:user@example.com')
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorMbox(mbox) {
        this.statement.actor.setActor('mbox', mbox);
        return this;
    }

    /**
     * Sets the actor using an mbox SHA1 hash
     * @param {string} mboxSha1 - The SHA1 hash of the actor's mbox URI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorMboxSha1(mboxSha1) {
        this.statement.actor.setActor('mbox_sha1sum', mboxSha1);
        return this;
    }

    /**
     * Sets the actor using an OpenID URI
     * @param {string} openid - The OpenID URI of the actor
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorOpenID(openid) {
        this.statement.actor.setActor('openid', openid);
        return this;
    }

    /**
     * Sets the authority using an account identifier
     * @param {string} accountName - The account name
     * @param {string} accountHomePage - The home page IRI of the account service provider
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityAccount(accountName, accountHomePage) {
        this.statement.authority.setActor('account', { name: accountName, homePage: accountHomePage });
        return this;
    }

    /**
     * Sets the authority using an mbox (mailto URI)
     * @param {string} mbox - The mailto URI of the authority (e.g. 'mailto:lrs@example.com')
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityMbox(mbox) {
        this.statement.authority.setActor('mbox', mbox);
        return this;
    }

    /**
     * Sets the authority using an mbox SHA1 hash
     * @param {string} mboxSha1 - The SHA1 hash of the authority's mbox URI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityMboxSha1(mboxSha1) {
        this.statement.authority.setActor('mbox_sha1sum', mboxSha1);
        return this;
    }

    /**
     * Sets the authority using an OpenID URI
     * @param {string} openid - The OpenID URI of the authority
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityOpenID(openid) {
        this.statement.authority.setActor('openid', openid);
        return this;
    }

    /**
     * Add or set the stored timestamp of the statement
     * @param {Date|string} stored - The stored timestamp to set (can be a Date object or an ISO 8601 string)
     * @return {LRSStatementBuilder} This builder instance for chaining
     * */
    withStored(stored) {
        this.statement.stored = stored ? (stored instanceof Date ? stored : new Date(stored)) : undefined;
        return this;
    }

    /**
   * Add or set an actor to the statement
   * @param {string} type - The type of the actor
   * @param {object} actor - The actor object
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withActor(type, actor) {
    this.statement.actor.setActor(type, actor);
    return this;
  }

 /**
     * Sets the ID of the statement
     * @param {string} id - The UUID to set as the statement ID
     * @returns {StatementBuilder} This builder instance for chaining
     */
    withId(id) {
        this.statement.id = id;
        return this;
    }

     /**
     * Sets the version of the statement
     * @param {string} version - The version to set
     * @returns {StatementBuilder} This builder instance for chaining
     */
    withVersion(version) {
        this.statement.version = version;
        return this;
    }

    /**
     * Sets the timestamp of the statement
     * @param {Date|string} timestamp - The timestamp to set (can be a Date object or an ISO 8601 string)
     * @returns {StatementBuilder} This builder instance for chaining
     */
    withTimestamp(timestamp) {
        this.statement.timestamp = timestamp instanceof Date ? timestamp : new Date(timestamp);
        return this;
    }

    /**
     * Sends the built statement to the LRS
     * @returns {Promise<void>} Promise that resolves when the statement has been sent
     */
    async send() {
        return await super.send();
    }


}

const msFn$1 = ms.default || ms;

/**
 * XAPI Tracker Asset Class
 * Handles xAPI tracking with batch processing, retry logic, and backup capabilities
 */
class xAPITrackerAsset {
    // XAPI PARAMETERS

    /**
     * XAPI Tracker instance
     * @type {XAPI|null}
     */
    xapi=null;

    /**
     * Settings of XAPI Tracker Asset
     * @typedef {Object} settings
     * @property {boolean} batch_mode
     * @property {string} batch_endpoint
     * @property {number} batch_length
     * @property {number} batch_timeout
     * @property {string} actor_homePage
     * @property {string} actor_name
     * @property {boolean} backup_mode
     * @property {string} backup_endpoint
     * @property {string} backup_type
     * @property {string} default_uri
     * @property {number} max_retry_delay
     * @property {boolean} debug
     * @property {string} parent_activity_id
    * @property {string} parent_activity_type
     */
    settings={
        batch_mode:true,
        batch_endpoint:"http://myurl.com/endpoint",
        batch_length:100,
        batch_timeout:msFn$1("30sec"),
        actor_homePage:"http://myhomepage.com",
        actor_name:"my_default_actor",
        backup_mode:false,
        backup_endpoint:"http://myurl.com/backup-endpoint",
        backup_type:"XAPI",
        default_uri:"mydefaulturi",
        max_retry_delay:msFn$1("2min"),
        debug:false,
        parent_activity_id:'',
        parent_activity_type:ALL.ACTIVITYTYPES.LESSON
    };

    /**
     * Authentication token for xAPI requests
     * @type {string|null}
     */
    auth_token = null;

    /**
     * Current online status
     * @type {boolean}
     */
    online = false;

    /**
     * Current connected status
     * @type {boolean}
     */
    connected = false;

    /**
     * Current started status
     * @type {boolean}
     */
    started = false;

    // STATEMENTS PARAMETERS

    /**
     * Queue of statements to be sent
     * @type {Array<Statement>}
     */
    statementsToSend = [];

    /**
     * Flag indicating if sending is currently in progress
     * @type {boolean}
     */
    sendingInProgress = false;

    /**
     * Current offset in the statements queue
     * @type {number}
     */
    offset = 0;

    // BACKUP PARAMETERS
    /**
     * Additional parameters for backup requests
     * @type {Object|null}
     */
    backupRequestParameters = null;

    // ACTOR PARAMETERS
    /**
     * Actor statement object
     * @type {ActorStatement}
     */
    actor;

    /**
     * Context statement object
     * @type {ContextStatement}
     */
    context;
    
    /**
     * Context statement without parent object
     * @type {ContextStatement}
     */
    context_without_parent;

    // BATCH AND RETRY PARAMETERS
    /**
     * Current retry delay in milliseconds
     * @type {number|null}
     */
    retryDelay;

    /**
     * Timer reference for batch processing
     * @type {NodeJS.Timeout|null}
     */
    timer = null;

    /**
     * Creates an instance of xAPITrackerAsset
     */
    constructor() {
        this.#onOffline();
    }

    /**
     * Logs out the current session by clearing the authentication token
     */
    logout() {
         if(this.connected) {
            this.auth_token = null;
         }
    }

    /**
     * Event handler called when the client goes offline
     */
    #onOffline() {
        this.online = false;        
        if (this.settings.debug) console.warn("XAPI Tracker for Serious Games went offline");
    }

    start() {
        this.started = true;
        this.actor = new ActorStatement({account :{name: this.settings.actor_name, homePage: this.settings.actor_homePage}});
        this.context = new ContextStatement(this.settings.default_uri, this.settings.actor_homePage);
        this.context_without_parent = new ContextStatement(this.settings.default_uri, this.settings.actor_homePage, this.context.registration, null);
        if(this.settings.parent_activity_id) {
            this.context.addContextActivity("parent", this.settings.parent_activity_id, this.settings.parent_activity_type);
        }
        if(this.connected) {
            this.xapi = new XAPI({
                endpoint: this.settings.batch_endpoint,
                auth: this.auth_token
            });
        }
        if(this.xapi != null) {
            this.#onOnline();
        } else {
            this.#onOffline();
        }
    }

    stop() {
        this.started = false;
        this.connected=false;
        this.online=false;
        this.offset = 0;
        this.statementsToSend = [];
        this.timer = null;
        this.actor = null;
        this.context = null;
        this.xapi=null;
        this.#onOffline();
    }

    /**
     * Event handler called when the client comes online
     * @returns {Promise<void>}
     */
    async #onOnline() {
        this.online = true;
        if (this.settings.debug) console.info("XAPI Tracker for Serious Games back Online");
    }

    /**
     * Updates the authentication configuration
     * 
     */
    async login() {
        if(this.auth_token) {
            this.connected=true;
        } else {
            this.connected=false;
        }
    }

    /**
     * Sends a batch of statements to the xAPI endpoint
     * @returns {Promise<void>}
     */
    async #sendBatch() {
        if (!this.online) return;
        if (this.offset >= this.statementsToSend.length) return;

        const end = Math.min(this.offset + this.settings.batch_length, this.statementsToSend.length);
        const batch = this.statementsToSend.slice(this.offset, end);
        const statements = batch.map(statement => statement.toXAPI());

        try {
            if(!this.sendingInProgress) {
                this.sendingInProgress = true;
                const result = await this.xapi.sendStatements({statements: statements});
                this.sendingInProgress = false;
                if (this.settings.debug) {
                    console.debug("Batch sent successfully:", result);
                }
                this.offset += batch.length;
                this.retryDelay = null;
            }
        } catch (error) {
            console.error("Error sending batch:", error.response);
            const status = error.response.status;
            const errorMessage = error.response.data.message || error.message;

            switch (status) {
                case 401: // Unauthorized
                case 403: // Forbidden
                    console.error(`${status === 401 ? 'Unauthorized' : 'Forbidden'}: ${errorMessage}`);
                    this.#onOffline();
                    await this.refreshAuth();
                    this.sendingInProgress = false;
                    await this.#sendBatch();
                    break;
                default:
                    console.error(`[TRACKER: Batch Processor] Batch upload returned status ${status} with message: ${errorMessage}`);
                    this.sendingInProgress = false;
                    this.#onOffline();
                    break;
            }

            if(this.retryDelay == null) {
                this.retryDelay = this.settings.batch_timeout;
            }
            this.retryDelay = Math.min(this.retryDelay * 2, this.settings.max_retry_delay);
            this.timer = null;
        }

        if (this.offset < this.statementsToSend.length) {
            this.#startTimer();
        }
    }

    /**
     * Refreshes the authentication token
     * @returns {Promise<void>}
     */
    async refreshAuth() {
        this.login();
    }

    /**
     * Starts the timer for batch processing
     */
    #startTimer() {
        if (this.timer) return;
        let timeout = this.retryDelay ? this.retryDelay : this.settings.batch_timeout;

        this.timer = setTimeout(async () => {
            await this.#sendBatch();
            this.timer = null;
            if (this.offset < this.statementsToSend.length) {
                this.#startTimer();
            }
        }, timeout);
    }

    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId, objectType, objectId, context = this.context, lrs = false) {
        const statement = new Statement(this.actor, verbId, objectId, objectType, context, this.settings.default_uri);
        if(lrs) {
            return new LRSStatementBuilder(this, statement);
        } else {
            return new StatementBuilder(this, statement);
        }
    }

    /**
     * Creates a StatementBuilder from an existing xAPI statement object
     * @overload
     * @param {Object} statement - The statement to send
     * @param {true} lrs - Whether to create an LRSStatementBuilder
     * @return {LRSStatementBuilder} A new LRSStatementBuilder instance
     */
    /**
     * @overload
     * @param {Object} statement - The statement to send
     * @param {false} [lrs] - Whether to create a regular StatementBuilder
     * @return {StatementBuilder} A new StatementBuilder instance
     */
    /**
     * @param {Object} statement
     * @param {boolean} [lrs]
     * @return {StatementBuilder|LRSStatementBuilder}
     */
    fromXAPI(statement, lrs = false) {
        if(lrs) {   
            const stmt = LRSStatement.fromXAPI(statement, this.settings.default_uri);
            return new LRSStatementBuilder(this, stmt);
        } else {
            const stmt = Statement.fromXAPI(statement, this.settings.default_uri);
            return new StatementBuilder(this, stmt);
        }
    }

    /**
     * Sends statements to the backup endpoint
     * @returns {Promise<void>}
     */
    async #sendBackup() {
        if (this.online && this.settings.backup_endpoint && this.settings.backup_endpoint.trim()) {
            let contentType;
            let statements;

            switch (this.settings.backup_type) {
                case 'XAPI':
                    statements = this.statementsToSend.map(statement => JSON.stringify(statement.toXAPI()));
                    contentType = 'application/json';
                    break;
                case 'CSV':
                    statements = this.statementsToSend.map(statement => statement.toCSV());
                    contentType = 'text/csv';
                    break;
                default:
                    return;
            }

            const body = {
                tofile: true,
                result: statements.join('\n'),
                contentType: contentType
            };

            const myRequest = {
                url: this.settings.backup_endpoint,
                method: 'POST',
                headers: {
                    'Authorization': this.auth_token || '',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(body, null, 2)
            };

            if (this.backupRequestParameters) {
                if (this.backupRequestParameters.content_type) {
                    myRequest.headers['Content-Type'] = this.backupRequestParameters.content_type;
                }

                if (this.backupRequestParameters.headers && typeof this.backupRequestParameters.headers === 'object') {
                    Object.entries(this.backupRequestParameters.headers).forEach(([key, value]) => {
                        myRequest.headers[key] = value;
                    });
                }

                if (this.backupRequestParameters.query_parameters && typeof this.backupRequestParameters.query_parameters === 'object') {
                    const queryParams = new URLSearchParams(this.backupRequestParameters.query_parameters).toString();
                    myRequest.url += `?${queryParams}`;
                }
            }

            try {
                const response = await axios(myRequest);
                console.log(response);
            } catch (error) {
                if (error.response) {
                    const status = error.response.status;
                    const errorMessage = error.response.data.message || error.message;

                    switch (status) {
                        case 401: // Unauthorized
                        case 403: // Forbidden
                            this.#onOffline();
                            console.error(`${status === 401 ? 'Unauthorized' : 'Forbidden'}: ${errorMessage}`);
                            await this.refreshAuth();
                            await this.#sendBackup();
                            break;
                        default:
                            console.error(`[TRACKER: Backup Processor] Backup upload returned status ${status} with message: ${errorMessage}`);
                            break;
                    }
                } else {
                    throw new Error(`Request failed: ${error.message}`);
                }
            }
        }
    }

    /**
     * Adds a statement to the queue and starts processing if needed
     * @param {Statement} statement - The statement to enqueue
     * @returns {Promise<void>}
     */
    async enqueue(statement) {
        if(this.settings.debug) {
            console.debug(statement.toXAPI());
            console.debug(statement.toCSV());
        }

        this.statementsToSend.push(statement);

        if (this.online && this.statementsToSend.length >= this.offset + this.settings.batch_length) {
            await this.#sendBatch();
        }

        this.#startTimer();
    }

    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Options object
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    async flush({withBackup = false} = {}) {
        if(withBackup) {
            await Promise.all([
                this.#sendBatch(),
                this.#sendBackup()
            ]);
        } else {
            await this.#sendBatch();
        }
    }
}

/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
     /**
     * @typedef {Object} oauth1Settings
     * @property {string} username
     * @property {string} password
     */
    oauth1Settings={
        username:"",
        password:""
    };
    /**
     * Creates an instance of xAPITrackerAssetOAuth1.
     */
    constructor() {
        super();
        this.oauth1Settings.username="";
        this.oauth1Settings.password="";
        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    async login() {
        this.auth_token=XAPI.toBasicAuth(this.oauth1Settings.username, this.oauth1Settings.password);
        return super.login();
    }

    /**
     * Refreshes the authentication token.
     * Delegates to the parent class implementation.
     *
     * @returns {Promise<void>} A promise that resolves when the refresh is complete
     */
    async refreshAuth() {
        super.refreshAuth();
    }

    /**
     * Logs out the current session.
     * Delegates to the parent class implementation.
     */
    logout() {
        super.logout();
    }
}

/**
 * A class that implements OAuth 2.0 protocol for authentication and token management.
 * Supports various grant types including password and refresh_token flows.
 */
class OAuth2Protocol {
  /**
   * Error message template for missing required fields.
   * @type {string}
   */
  fieldMissingMessage;

  /**
   * Error message template for unsupported grant types.
   * @type {string}
   */
  unsupportedGrantTypeMessage;

  /**
   * Error message template for unsupported PKCE methods.
   * @type {string}
   */
  unsupportedCodeChallengeMethodMessage;

  /**
   * The authorization endpoint URL.
   * @type {string|null}
   */
  authEndpoint = null;

  /**
   * The token endpoint URL.
   * @type {string|null}
   */
  tokenEndpoint = null;

  /**
   * The OAuth2 grant type being used.
   * @type {string|null}
   */
  grantType = null;

  /**
   * The username for authentication.
   * @type {string|null}
   */
  username = null;

  /**
   * The password for authentication.
   * @type {string|null}
   */
  password = null;

  /**
   * The client identifier.
   * @type {string|null}
   */
  clientId = null;

  /**
   * The requested scope of access.
   * @type {string|null}
   */
  scope = null;

  /**
   * The state parameter for CSRF protection.
   * @type {string|null}
   */
  state = null;

  /**
   * The login hint for authentication.
   * @type {string|null}
   */
  login_hint = null;

  /**
   * The PKCE code challenge method.
   * @type {string|null}
   */
  codeChallengeMethod = null;

  /**
   * The current authentication token.
   * @typedef {Object|null} token
   * @property {string} access_token
   * @property {string} refresh_token
   */
  token=null;

  /**
   * Flag indicating if a token refresh is currently in progress.
   * @type {boolean}
   */
  tokenRefreshInProgress = false;

  /**
   * Callback function for token updates.
   * @type {Function|null}
   */
  onAuthorizationInfoUpdate = null;

  /**
   * Creates an instance of OAuth2Protocol.
   * Initializes error messages and default property values.
   * @param {Object} config - Configuration object containing OAuth2 parameters
   * @param {string} config.token_endpoint - The token endpoint URL
   * @param {string} config.grant_type - The grant type (password, refresh_token, etc.)
   * @param {string} config.client_id - The client ID
   * @param {string} [config.scope] - Optional scope
   * @param {string} [config.state] - Optional state
   * @param {string} [config.code_challenge_method] - Optional PKCE code challenge method
   * @param {string} [config.username] - Username for password grant type
   * @param {string} [config.password] - Password for password grant type
   * @param {string} [config.login_hint] - Login hint for password grant type
   */
  constructor(config) {
    this.fieldMissingMessage = 'Field "{0}" required for "OAuth 2.0" authentication is missing!';
    this.unsupportedGrantTypeMessage = 'Grant type "{0}" not supported. Please use either "code" type or "password" type.';
    this.unsupportedCodeChallengeMethodMessage = 'Code challenge (PKCE) method "{0}" not supported. Please use "S256" method or disable it.';
    this.tokenEndpoint = this.#getRequiredValue(config, 'token_endpoint');
    this.grantType = this.#getRequiredValue(config, 'grant_type').toLowerCase();
    this.clientId = this.#getRequiredValue(config, 'client_id');
    this.scope = config.scope || null;
    this.state = config.state || null;

    // Parse PKCE
    if (config.code_challenge_method) {
      const codeChallengeMethodString = config.code_challenge_method.toUpperCase();
      if (codeChallengeMethodString === 'S256') {
        this.codeChallengeMethod = 'S256';
      } else {
        throw new Error(this.unsupportedCodeChallengeMethodMessage.replace('{0}', codeChallengeMethodString));
      }
    }

    switch (this.grantType) {
      case "password":
        this.username = this.#getRequiredValue(config, 'username');
        this.password = this.#getRequiredValue(config, 'password');
        this.login_hint = this.#getRequiredValue(config, 'login_hint');
        break;
      default:
        throw new Error(this.unsupportedGrantTypeMessage.replace('{0}', this.grantType));
    }
  }

  /**
   * Initializes the OAuth2 protocol with the provided configuration.
   *

   * @returns {Promise<void>}
   * @throws {Error} If required configuration values are missing or grant type is unsupported
   */
  async getToken() {
    console.log("[OAuth2] Starting");
    switch (this.grantType) {
      case "refresh_token":
        this.token = await this.#doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
        break;
      case "password":
        this.token = await this.#doResourceOwnedPasswordCredentialsFlow(
          this.tokenEndpoint,
          this.clientId,
          this.username,
          this.password,
          this.login_hint,
          this.scope,
          this.state,
        );
        break;
      default:
        throw new Error(this.unsupportedGrantTypeMessage.replace('{0}', this.grantType));
    }

    if (this.token) {
      console.log("[OAuth2] Token obtained: " + this.token.access_token);
    }
  }

  /**
   * Retrieves a required value from the configuration object.
   *
   * @param {Object} config - The configuration object
   * @param {string} key - The key of the required value
   * @returns {*} The value associated with the key
   * @throws {Error} If the required value is missing
   */
  #getRequiredValue(config, key) {
    if (!config[key]) {
      throw new Error(this.fieldMissingMessage.replace('{0}', key));
    }
    return config[key];
  }

  /**
   * Performs the Resource Owner Password Credentials flow.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} username - The username
   * @param {string} password - The password
   * @param {string} [scope] - Optional scope
   * @param {string} [state] - Optional state
   * @param {string} login_hint - The login hint
   * @returns {Promise<Object>} The token response
   */
  async #doResourceOwnedPasswordCredentialsFlow(tokenUrl, clientId, username, password, login_hint, scope, state) {
    const form = {
      username,
      password,
      login_hint
    };
    if(scope) {
      form.scope = scope;
    }
    if(state) {
      form.state = state;
    }
    return await this.#doTokenRequest(tokenUrl, clientId, "password", form);
  }

  /**
   * Makes a token request to the OAuth2 token endpoint.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} grantType - The grant type
   * @param {Object} otherParams - Additional parameters to include in the request
   * @returns {Promise<Object>} The token response
   * @throws {Error} If the token request fails
   */
  async #doTokenRequest(tokenUrl, clientId, grantType, otherParams) {
    const form = {
      grant_type: grantType,
      client_id: clientId,
      ...otherParams
    };

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Error during token request');
      } else {
        throw error;
      }
    }
  }

  /**
   * Performs a refresh token request.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} refreshToken - The refresh token
   * @returns {Promise<Object>} The new token response
   */
  async #doRefreshToken(tokenUrl, clientId, refreshToken) {
    return await this.#doTokenRequest(tokenUrl, clientId, "refresh_token", { refresh_token: refreshToken });
  }

  /**
   * Refreshes the current access token using the refresh token.
   *
   * @returns {Promise<string>} The new access token
   */
  async refreshToken() {
    if(this.tokenRefreshInProgress == false) {
      try {
        this.tokenRefreshInProgress = true;
        this.token = await this.#doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
        this.tokenRefreshInProgress = false;
        return this.token.access_token;
      } catch(error) {
        this.tokenRefreshInProgress = false;
        console.error(error);
      }
    } else {
      while(this.tokenRefreshInProgress == true) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  /**
   * Checks if the current token has expired.
   *
   * @returns {boolean} True if the token has expired, false otherwise
   */
  hasTokenExpired() {
    let expiredTime = new Date(this.token.requestTime.getTime() + this.token.expires_in*1000);
    let now = new Date();
    if(expiredTime > now) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Updates the request with the current authorization token.
   * Refreshes the token if it has expired.
   *
   * @param {Object} request - The request object to update
   * @returns {Promise<void>}
   */
  async #updateParamsForAuth(request) {
    if (this.hasTokenExpired()) {
      this.token = await this.#doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
      if (this.onAuthorizationInfoUpdate) {
        this.onAuthorizationInfoUpdate(this.token);
      }
    }

    request.headers = {
      ...request.headers,
      'Authorization': `${this.token.token_type.charAt(0).toUpperCase() + this.token.token_type.slice(1)} ${this.token.access_token}`
    };
  }

  /**
   * Registers a callback function to be called when authorization information is updated.
   *
   * @param {Function} callback - The callback function to register
   */
  #registerAuthInfoUpdate(callback) {
    if (callback) {
      this.onAuthorizationInfoUpdate = callback;
      if (this.token) {
        callback(this.token);
      }
    }
  }

  /**
   * Logs out the current session by invalidating the refresh token.
   *
   * @returns {Promise<void>}
   * @throws {Error} If the logout request fails
   */
  async logout() {
    const form = {
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: this.token.refresh_token
    };

    try {
      const response = await fetch(this.tokenEndpoint.replace("/token", "/logout"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      const data = await response.json();
      console.log(data);
      console.log("[OAuth2] Logged out successfully");
    } catch(error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || '[OAuth2] Error during logout');
      } else {
        throw error;
      }
    }
  }
}

/**
 * A specialized tracker asset that implements OAuth2 authentication.
 * Extends the base xAPITrackerAsset with OAuth2 capabilities.
 */
class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {

    /**
     * @typedef {Object} OAuth2Settings
     * @property {string} token_endpoint
     * @property {string} grant_type
     * @property {string} client_id
     * @property {string} scope
     * @property {string} [state]
     * @property {string} [code_challenge_method]
     * @property {string} username
     * @property {string} password
     * @property {string} login_hint
     */
    oauth2Settings = {
        token_endpoint:        "https://…/token",
        client_id:             "my_client_id",
        grant_type:            "password",
        scope:                 "openid profile",
        state:                 "",
        code_challenge_method: "",
        username:              "alice@example.com",
        password:              "supersecret",
        login_hint:            "alice@example.com"
    };


    /**
     * Instance of OAuth2Protocol handling authentication
     * @type {OAuth2Protocol|null}
     */
    oauth2 = null;

    /**
     * Creates an instance of xAPITrackerAssetOAuth2.

     */
    constructor() {
        super();
        this.oauth2 = null;
        window.addEventListener('beforeunload', async () => {
            if (this.auth_token) {
                await this.logout();
            }
        });
    }

    async login() {
        if(!this.online) {
            // Fetch token after object construction
            await this.#initAuth();
        }
    }

    /**
     * Retrieves an OAuth2 access token.
     *
     * @returns {Promise<string|null>} The access token or null if failed
     */
    async #getToken() {
        try {
            this.oauth2 = new OAuth2Protocol(this.oauth2Settings);
            await this.oauth2.getToken();
            return this.oauth2.token.access_token; // Return the access token
        } catch(e) {
            console.error(e);
            return null;
        }
    }

    /**
     * Initializes authentication by obtaining and setting the OAuth2 token.
     *
     * @returns {Promise<void>}
     */
    async #initAuth() {
        const oAuth2Token = await this.#getToken();
        if(oAuth2Token !== null) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            return super.login();
        }
    }

    /**
     * Refreshes the OAuth2 authentication token.
     *
     * @returns {Promise<void>}
     */
    async refreshAuth() {
        const oAuth2Token = await this.oauth2.refreshToken();
        if(oAuth2Token) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            super.login();
        }
    }

    /**
     * Logs out the current session by invalidating the token.
     *
     * @returns {Promise<void>}
     */
    async logout() {
        await this.oauth2.logout();
        // logout
        super.logout();
    }
}

/**
 * Accessible Tracker
 */
class AccessibleTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {string} type the type of the accessible object
     */
    constructor(tracker, id, type=ALL.ACTIVITYTYPES.AREA) {
        this.AccessibleId=id;
        this.Type=type;
        this.Tracker = tracker;
    }
    /**
     * the id of the accessible object
     * @type {string}
     */
    AccessibleId;
    /**
     * the type of the accessible object
     * @type {string}
     */
    Type;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    Tracker;

    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    accessed() {
        return this.Tracker.trace(SERIOUSGAMESPROFILE.VERBS.ACCESSED,this.Type,this.AccessibleId);
    }

    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    skipped() {
        return this.Tracker.trace(ALL.VERBS.SKIPPED,this.Type,this.AccessibleId);
    }
}

/**
 * Completable Tracker
 */
class CompletableTracker {
    /**
     * Constructor of completable Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the completable object
     * @param {string} type the Type of the completable object
     */
    constructor(tracker, id, type) {
        this.CompletableId=id;
        this.Type=type;
        this.Tracker = tracker;
        this.IsInitialized=false;
    }

    /**
     * the id of the completable object
     * @Type {string}
     */
    CompletableId;

    /**
     * the Type of the completable object
     * @Type {string}
     */
    Type;

    /**
     * the Tracker of the completable object
     * @Type {xAPITrackerAsset}
     */
    Tracker;

    /**
     * is initialized
     * @Type {boolean}
     */
    IsInitialized;

    /**
     * Initialized Time
     * @Type {Date}
     */
    InitializedTime;


    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized() {
        var addInitializedTime = true;
        if(this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("The initialized statement for the specified id has already been sent!");
            } else {
                console.warn("The initialized statement for the specified id has already been sent!");
                addInitializedTime = false;
            }
        }
        if (addInitializedTime) {
            this.InitializedTime = new Date();
            this.IsInitialized=true;
        }
        return this.Tracker.trace(ALL.VERBS.INITIALIZED,this.Type,this.CompletableId);
    }

    /**
     * Send Progressed statement
     * @param {number} progress the progress of the completable object
     * @returns {StatementBuilder}
     */
    progressed(progress) {
        return this.Tracker.trace(ALL.VERBS.PROGRESSED,this.Type,this.CompletableId)
            .withProgress(progress);
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the completable object
     * @param {boolean} completion the completion status of the completable object
     * @param {number} score the score of the completable object
     * @returns {StatementBuilder}
     */
    completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an Completed statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Completed statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.IsInitialized=false;

        return this.Tracker.trace(ALL.VERBS.COMPLETED,this.Type,this.CompletableId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(this.InitializedTime, actualDate);
    }
}

const SERIOUSGAMEPROFILE = Object.freeze({
    CATEGORYID:  'https://w3id.org/xapi/seriousgame',
    VERBS: {
        //Completable Verbs
        INITIALIZED: 'http://adlnet.gov/expapi/verbs/initialized',
        PROGRESSED: 'http://adlnet.gov/expapi/verbs/progressed',
        COMPLETED: 'http://adlnet.gov/expapi/verbs/completed',
        //Accessible Verbs
        ACCESSED: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
        SKIPPED: 'http://id.tincanapi.com/verb/skipped',
        //Alternative Verbs
        SELECTED: 'https://w3id.org/xapi/adb/verbs/selected',
        UNLOCKED: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
        //GameObject Verbs
        INTERACTED: 'http://adlnet.gov/expapi/verbs/interacted',
        USED: 'https://w3id.org/xapi/seriousgames/verbs/used'
    },
    ACTIVITYTYPES: {
        // Completable
        GAME: 'https://w3id.org/xapi/seriousgames/activity-types/serious-game' ,
        SESSION: 'https://w3id.org/xapi/seriousgames/activity-types/session',
        LEVEL: 'https://w3id.org/xapi/seriousgames/activity-types/level',
        QUEST: 'https://w3id.org/xapi/seriousgames/activity-types/quest',
        STAGE: 'https://w3id.org/xapi/seriousgames/activity-types/stage',
        COMBAT: 'https://w3id.org/xapi/seriousgames/activity-types/combat',
        STORYNODE: 'https://w3id.org/xapi/seriousgames/activity-types/story-node',
        RACE: 'https://w3id.org/xapi/seriousgames/activity-types/race',
        COMPLETABLE: 'https://w3id.org/xapi/seriousgames/activity-types/completable',
        // Accessible
        SCREEN: 'https://w3id.org/xapi/seriousgames/activity-types/screen' ,
        AREA: 'https://w3id.org/xapi/seriousgames/activity-types/area',
        ZONE: 'https://w3id.org/xapi/seriousgames/activity-types/zone',
        CUTSCENE: 'https://w3id.org/xapi/seriousgames/activity-types/cutscene',
        ACCESSIBLE: 'https://w3id.org/xapi/seriousgames/activity-types/accessible',
        // Alternative
        QUESTION: 'http://adlnet.gov/expapi/activities/question' ,
        MENU: 'https://w3id.org/xapi/seriousgames/activity-types/menu',
        DIALOG: 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree',
        PATH: 'https://w3id.org/xapi/seriousgames/activity-types/path',
        ARENA: 'https://w3id.org/xapi/seriousgames/activity-types/arena',
        ALTERNATIVE: 'https://w3id.org/xapi/seriousgames/activity-types/alternative',
        // GameObject
        ENEMY: 'https://w3id.org/xapi/seriousgames/activity-types/enemy' ,
        NPC: 'https://w3id.org/xapi/seriousgames/activity-types/non-player-character',
        ITEM: 'https://w3id.org/xapi/seriousgames/activity-types/item',
        GAMEOBJECT: 'https://w3id.org/xapi/seriousgames/activity-types/game-object'
    }
});

/**
 * Accessible Tracker
 */
class AlternativeTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {string} type the type of the accessible object
     */
    constructor(tracker, id, type=SERIOUSGAMEPROFILE.ACTIVITYTYPES.ALTERNATIVE) {
        this.AlternativeId=id;
        this.Type=type;
        this.Tracker = tracker;
    }
    /**
     * the id of the alternative object
     * @type {string}
     */
    AlternativeId;
    /**
     * the type of the alternative object
     * @type {string}
     */
    Type;
    /**
     * the tracker of the alternative object
     * @type {xAPITrackerAsset}
     */
    Tracker;

    /**
     * Send selected statement
     * @param {string} optionId the optionId of the selected statement
     * @returns {StatementBuilder}
     */
    selected(optionId) {        
        return this.Tracker.trace(ALL.VERBS.SELECTED,this.Type,this.AlternativeId)
            .withResponse(optionId);
    }

    /**
     * Send unlocked statement
     * @param {string} optionId the optionId of the Unlocked statement
     * @returns {StatementBuilder}
     */
    unlocked(optionId) {
        return this.Tracker.trace(SERIOUSGAMESPROFILE.VERBS.UNLOCKED,this.Type,this.AlternativeId)
                .withResponse(optionId);
    }
}

/**
 * Game Object Tracker
 */
class GameObjectTracker {
    /**
     * Constructor of Game Object tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Game Object object
     * @param {string} type the Type of the Game Object object
     */
    constructor(tracker,id, type=SERIOUSGAMEPROFILE.ACTIVITYTYPES.GAMEOBJECT) {
        this.GameobjectId=id;
        this.Type=type;
        this.Tracker= tracker;
    }
    /**
     * the id of the Game Object object
     * @Type {string}
     */
    GameobjectId;
    /**
     * the Type of the Game Object object
     * @Type {string}
     */
    Type;
    /**
     * the Trackerof the Game Object object
     * @Type {xAPITrackerAsset}
     */
    tracker;

    /**
     * Send Interacted statement
     * @returns {StatementBuilder}
     */
    interacted() {
        return this.Tracker.trace(ALL.VERBS.INTERACTED,this.Type,this.GameobjectId);
    }
    
    /**
     * Send Used statement
     * @returns {StatementBuilder}
     */
    used() {
        return this.Tracker.trace(ALL.VERBS.USED,this.Type,this.GameobjectId);
    }
}

/**
 * Scorm Tracker
 */
class ScormTracker {
    /**
     * Constructor of Scorm Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the Scorm object
     * @param {string} type the type of the Scorm object
     * @param {ContextStatement} context the context statement of the Scorm object
     */
    constructor(tracker, id, type=SCORMPROFILE.ACTIVITYTYPES.LESSON, context = tracker.context) {
        this.ScormId=id;
        this.Type=type;
        this.Tracker = tracker;
        this.Context = context;
        this.IsInitialized=false;
    }
    /**
     * the id of the Scorm object
     * @type {string}
     */
    ScormId;
    /**
     * the type of the Scorm object
     * @type {string}
     */
    Type;
    /**
     * the Tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    Tracker;

    /**
     * is initialized
     * @type {boolean}
     */
    IsInitialized;

    /**
     * Initialized Time
     * @type {Date}
     */
    InitializedTime;

    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized() {
        var addInitializedTime = true;
        if(this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("The initialized statement for the specified id has already been sent!");
            } else {
                console.warn("The initialized statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.InitializedTime = new Date();
            this.IsInitialized=true;
        }
        if(this.Type != SCORMPROFILE.ACTIVITYTYPES.LESSON) {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.Tracker.trace(SCORMPROFILE.VERBS.INITIALIZED, this.Type, this.ScormId, this.Context);
    }

    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    suspended() {
        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.IsInitialized=false;
        if(this.Type != SCORMPROFILE.ACTIVITYTYPES.LESSON) {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.Tracker.trace(SCORMPROFILE.VERBS.SUSPENDED, this.Type, this.ScormId, this.Context)
                .withDuration(this.InitializedTime, actualDate);
    }

    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    resumed() {
        var addInitializedTime = true;
        if(this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("The Resumed statement for the specified id has already been sent!");
            } else {
                console.warn("The Resumed statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.InitializedTime = new Date();
            this.IsInitialized=true;
        }
        if(this.Type != SCORMPROFILE.ACTIVITYTYPES.LESSON) {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.Tracker.trace(SCORMPROFILE.VERBS.RESUMED, this.Type, this.ScormId, this.Context);
    }

    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    terminated() {
        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an Terminated statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Terminated statement!");
                return;
            }
        }
        let actualDate=new Date();
        this.IsInitialized=false;
        if(this.Type != SCORMPROFILE.ACTIVITYTYPES.LESSON) {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.Tracker.trace(SCORMPROFILE.VERBS.TERMINATED, this.Type, this.ScormId, this.Context)
                    .withDuration(this.InitializedTime, actualDate);
    }

    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    passed() {
        return this.Tracker.trace(SCORMPROFILE.VERBS.PASSED, this.Type, this.ScormId, this.Context);
    }

    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    failed() {
        return this.Tracker.trace(SCORMPROFILE.VERBS.FAILED, this.Type, this.ScormId, this.Context);
    }

    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    scored(score) {
        if (typeof score === 'undefined') {score = 1;}

        return this.Tracker.trace(SCORMPROFILE.VERBS.SCORED, this.Type, this.ScormId, this.Context)
            .withScore({raw:score});
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the Scorm object
     * @param {boolean} completion the completion status of the Scorm object
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        if(!this.IsInitialized) {
            if (this.Tracker.settings.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        return this.Tracker.trace(SCORMPROFILE.VERBS.COMPLETED, this.Type, this.ScormId, this.Context)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(this.InitializedTime, actualDate);
    }
}

const msFn = ms.default || ms;

/**
 * Main JavaScript Tracker class for xAPI tracking functionality
 */
class JSTracker {
    ALL = ALL;
    STATEMENT_BUILDER_IDS = STATEMENT;
    /**
     * The underlying tracker instance
     * @type {xAPITrackerAssetOAuth2|xAPITrackerAssetOAuth1|xAPITrackerAsset}
     */
    tracker;
    
    /**
     * Settings of JSTracker
     * @typedef {Object} trackerSettings
     * @property {boolean} generateSettingsFromURLParams
     * @property {string} oauth_type
     * @property {boolean} batch_mode
     * @property {string} batch_endpoint
     * @property {string} oauth_type
     * @property {number} batch_length
     * @property {number} batch_timeout
     * @property {string} actor_homePage
     * @property {string} actor_name
     * @property {boolean} backup_mode
     * @property {string} backup_endpoint
     * @property {string} backup_type
     * @property {string} default_uri
     * @property {number} max_retry_delay
     * @property {boolean} debug
     * @property {string} parent_activity_id
    * @property {string} parent_activity_type
     */
    trackerSettings={
        generateSettingsFromURLParams:false,
        oauth_type:"OAuth0",
        batch_mode:true,
        batch_endpoint:"http://myurl.com/endpoint",
        batch_length:100,
        batch_timeout:msFn("30sec"),
        actor_homePage:"http://myhomepage.com",
        actor_name:"my_default_actor",
        backup_mode:false,
        backup_endpoint:"http://myurl.com/backup-endpoint",
        backup_type:"XAPI",
        default_uri:"mydefaulturi",
        max_retry_delay:msFn("2min"),
        debug:false,
        parent_activity_id:'',
        parent_activity_type:ALL.ACTIVITYTYPES.LESSON
    };
    /**
     * @typedef {Object} oauth1
     * @property {string} username
     * @property {string} password
     */
    oauth1={
        username:"superusername",
        password:"supersecret"
    };

    /**
     * @typedef {Object} oauth2
     * @property {string} token_endpoint
     * @property {string} grant_type
     * @property {string} client_id
     * @property {string} scope
     * @property {string} [state]
     * @property {string} [code_challenge_method]
     * @property {string} username
     * @property {string} password
     * @property {string} login_hint
     */
    oauth2 = {
        token_endpoint:        "https://…/token",
        client_id:             "my_client_id",
        grant_type:            "password",
        scope:                 "openid profile",
        state:                 "",
        code_challenge_method: "",
        username:              "alice@example.com",
        password:              "supersecret",
        login_hint:            "alice@example.com"
    };

    /**
     * Creates a new JSTracker instance
     */
    constructor() {
    }

    /**
     * 
     * @returns {Promise<void>} 
     */
    async login() {
        if(this.trackerSettings.generateSettingsFromURLParams) {
            this.generateXAPITrackerFromURLParams();
        }
         if (this.trackerSettings.oauth_type === "OAuth2") {
            /**
             * @type {xAPITrackerAssetOAuth2}
             */
            this.tracker = new xAPITrackerAssetOAuth2();
            if (this.tracker && 'oauth2Settings' in this.tracker) {
                this.tracker.oauth2Settings = this.oauth2;
            } else {
                throw new Error("tracker isn't OAuth2");
            }
        } else if (this.trackerSettings.oauth_type === "OAuth1") {
            /**
             * @type {xAPITrackerAssetOAuth1}
             */
            this.tracker = new xAPITrackerAssetOAuth1();
            if (this.tracker && 'oauth1Settings' in this.tracker) {
                this.tracker.oauth1Settings = this.oauth1;
            } else {
                throw new Error("tracker isn't OAuth1");
            }
        } else {
            this.tracker = new xAPITrackerAsset();
        }
        this.tracker.settings = this.trackerSettings;
        await this.tracker.login();
    }

    start() {
        if(!this.tracker) {
            this.tracker = new xAPITrackerAsset();
        }
        this.tracker.settings = this.trackerSettings;
        this.tracker.start();
        this.Started=true;
    }

    stop() {
        this.tracker.stop();
        this.started = false;
    };

    logout() {
        if(this.tracker) {
            this.tracker.logout();
        }
        this.trackerSettings.oauth_type="OAuth0";
    }

    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Flush options
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    flush({ withBackup = false } = {}) {
        if(this.tracker) {
            return this.tracker.flush({ withBackup: withBackup });
        }
    }

    /**
     * Generates an xAPI tracker instance from URL parameters
     */
    generateXAPITrackerFromURLParams() {
        const xAPIConfig = {};
        const urlParams = new URLSearchParams(window.location.search);
        let result_uri, backup_uri, backup_type, actor_name, actor_homePage, strDebug, debug;
        let username, password;
        let batchLength, batchTimeout, maxRetryDelay;

        if (urlParams.size > 0) {
            // RESULT URI
            result_uri = urlParams.get('result_uri');

            // BACKUP URI
            backup_uri = urlParams.get('backup_uri');
            backup_type = urlParams.get('backup_type');

            // ACTOR DATA
            actor_homePage = urlParams.get('actor_homepage');
            actor_name = urlParams.get('actor_user');

            // SSO OAUTH 2.0 DATA
            const sso_token_endpoint = urlParams.get('sso_token_endpoint');
            if (sso_token_endpoint) {
                xAPIConfig.token_endpoint = sso_token_endpoint;
            }
            const sso_client_id = urlParams.get('sso_client_id');
            if (sso_client_id) {
                xAPIConfig.client_id = sso_client_id;
            }
            const sso_login_hint = urlParams.get('sso_login_hint');
            if (sso_login_hint) {
                xAPIConfig.login_hint = sso_login_hint;
            }
            const sso_grant_type = urlParams.get('sso_grant_type');
            if (sso_grant_type) {
                xAPIConfig.grant_type = sso_grant_type;
            }
            const sso_scope = urlParams.get('sso_scope');
            if (sso_scope) {
                xAPIConfig.scope = sso_scope;
            }
            const sso_username = urlParams.get('sso_username');
            if (sso_username) {
                xAPIConfig.username = sso_username;
            }
            const sso_password = urlParams.get('sso_password');
            if (sso_password) {
                xAPIConfig.password = sso_password;
            } else {
                if (sso_username) {
                    xAPIConfig.password = sso_username;
                }
            }

            // OAUTH 1.0 DATA
            username = urlParams.get('username');
            password = urlParams.get('password');

            // OAUTH 0: VIA AUTHTOKEN DIRECTLY (not recommended)
            urlParams.get('auth_token');

            // DEBUG
            strDebug = urlParams.get('debug');

            // BATCH
            var batch_length_param=urlParams.get('batch_length');
            var batch_timeout_param=urlParams.get('batch_timeout');
            var max_retry_delay_param=urlParams.get('max_retry_delay');
            if(batch_length_param) {
                batchLength = parseInt(batch_length_param);
            }
            if(batch_timeout_param) {
                batchTimeout = msFn(batch_timeout_param);
            }
            if(max_retry_delay_param) {
                maxRetryDelay = msFn(max_retry_delay_param);
            }
            
            if (strDebug !== null && strDebug === "true") {
                debug = Boolean(strDebug);
                console.debug(result_uri);
                console.debug(backup_type);
                console.debug(actor_name);
                console.debug(actor_homePage);
                console.debug(debug);
                console.debug(batchLength);
                console.debug(batchTimeout);
                console.debug(maxRetryDelay);
            }
        } else {
            result_uri = null;
            backup_type = "XAPI";
            actor_homePage = null;
            actor_name = null;
            debug = false;
        }

        if (xAPIConfig.token_endpoint) {
            this.trackerSettings.oauth_type="OAuth2";
            this.oauth2.client_id = xAPIConfig.client_id;
            this.oauth2.grant_type = xAPIConfig.grant_type;
            this.oauth2.login_hint = xAPIConfig.login_hint;
            this.oauth2.username = xAPIConfig.username;
            this.oauth2.password = xAPIConfig.password;
            this.oauth2.scope = xAPIConfig.scope;
            this.oauth2.token_endpoint = xAPIConfig.token_endpoint;
        } else if (username && password) {
            this.trackerSettings.oauth_type="OAuth1";
            this.oauth1.username = username;
            this.oauth1.password = password;
        }
        this.trackerSettings.batch_endpoint=result_uri;
        this.trackerSettings.actor_homePage=actor_homePage;
        this.trackerSettings.actor_name=actor_name;
        this.trackerSettings.backup_endpoint=backup_uri;
        this.trackerSettings.backup_type=backup_type;
        this.trackerSettings.debug=debug;
        this.trackerSettings.batch_length=batchLength;
        this.trackerSettings.batch_timeout=batchTimeout;
        this.trackerSettings.max_retry_delay=maxRetryDelay;
    }

    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId, objectType, objectId) {
        if (!this.tracker) {
            throw new Error("Tracker not initialized. Call login() and start() before trace().");
        }
        return this.tracker.trace(verbId, objectType, objectId);
    }

    /**
     * Creates a new statement builder from an xAPI statement
     * @param {Object} statement - The xAPI statement to create the builder from
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    fromXAPI(statement) {
        if (!this.tracker) {
            throw new Error("Tracker not initialized. Call login() and start() before sending statements.");
        }
        return this.tracker.fromXAPI(statement);
    }
}

/**
 * SCORM-specific tracker extending JSTracker
 */
class JSScormTracker extends JSTracker {
    SCORMPROFILE = SCORMPROFILE;
    STATEMENT_BUILDER_IDS = STATEMENT;
    ALL = ALL;
    /**
     * list of scorm instances
     */
    scormInstances={};

    /**
     * Creates a new JSScormTracker instance
     */
    constructor() {
        super();
    }

    async login() {
        await super.login();
        if(!this.scormInstances[this.trackerSettings.parent_activity_type]) {
            this.scormInstances[this.trackerSettings.parent_activity_type]= {};
        }
        if(this.trackerSettings.parent_activity_id && !(this.trackerSettings.parent_activity_id in this.scormInstances[this.trackerSettings.parent_activity_type])) {
            this.scormInstances[this.trackerSettings.parent_activity_type][this.trackerSettings.parent_activity_id]= new ScormTracker(this.tracker, this.trackerSettings.parent_activity_id, this.trackerSettings.parent_activity_type, this.tracker.context_without_parent);
        }
    }

    logout() {
        super.logout();
        this.scormInstances={};
    }

    /**
     * Creates a new SCORM tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - SCORM type
     * @returns {ScormTracker} New SCORM tracker instance
     */
    scorm(id, type=SCORMPROFILE.ACTIVITYTYPES.LESSON) {
        var scorm;
        if(!this.scormInstances[type]) {
            this.scormInstances[type]={};
        }
        if(!this.scormInstances[type][id]) {
            scorm =new ScormTracker(this.tracker, id, type);
            this.scormInstances[type][id]=scorm;
        } else {
            scorm=this.scormInstances[type][id];
        }
        return scorm;
    }

    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @return {StatementBuilder} A new StatementBuilder instance
     *  */
    trace(verbId, objectType, objectId) {
        return super.trace(verbId, objectType, objectId);
    }

    /**
     * Creates a new statement builder from an xAPI statement
     * @param {Object} statement - The xAPI statement to create the builder from
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    fromXAPI(statement) {
        return super.fromXAPI(statement);
    }
}

/**
 * SCORM-specific tracker extending JSTracker
 */
class LRSTracker extends JSTracker {
    ALL = ALL;    
    STATEMENT_BUILDER_IDS = STATEMENT;
    /**
     * Creates a new MyTracker instance
     */
    constructor() {
        super();
    }

    async login() {
        await super.login();
    }

    logout() {
        super.logout();
    }
        /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @return {StatementBuilder} A new StatementBuilder instance
     *  */
    trace(verbId, objectType, objectId) {
        if (!this.tracker) {
            throw new Error("Tracker not initialized. Call login() and start() before trace().");
        }
        return this.tracker.trace(verbId, objectType, objectId, this.tracker.context, true);
    }

    /**
     * Creates a new statement builder from an xAPI statement
     * @param {Object} statement - The xAPI statement to create the builder from
     * @returns {LRSStatementBuilder} A new StatementBuilder instance
     */
    fromXAPI(statement) {
        return this.tracker.fromXAPI(statement, true);
    }
}


/**
 * Serious Game Tracker extending JSTracker with game-specific functionality
 */
class SeriousGameTracker extends JSTracker {
    /**
     * Accessible type constants
     */
    SERIOUSGAMEPROFILE = SERIOUSGAMESPROFILE;
    STATEMENT_BUILDER_IDS = STATEMENT;
    ALL = ALL;

    /**
     * SCORM tracker instance
     * @type {ScormTracker}
     */
    scormTracker;

    /**
     * list of instances
     */
    instances= {
        "completable": {},
        "gameObject": {},
        "alternative": {},
        "accessible": {}
    };

    /**
     * Creates a new SeriousGameTracker instance
     */
    constructor() {
        super();
        this.parent_activity_id=this.trackerSettings.parent_activity_id || '';
    }

    async login() {
        this.scormTracker = new ScormTracker(this.tracker, this.parent_activity_id, ALL.ACTIVITYTYPES.LESSON, this.tracker.context_without_parent);
        await super.login();
    }

    logout() {
        super.logout();
        this.scormTracker=null;
        this.instances={
            "completable": {},
            "gameObject": {},
            "alternative": {},
            "accessible": {}
        };
    }

    start() {
        super.start();
    }

    stop() {
        super.stop();
    }

    /**
     * Marks the game as started
     * @returns {StatementBuilder} Promise that resolves when the start is recorded
     */
    initialized() {
        return this.scormTracker.initialized();
    }

    /**
     * Marks the game as paused
     * @returns {StatementBuilder} Promise that resolves when the pause is recorded
     */
    pause() {
        return this.scormTracker.suspended();
    }

    /**
     * Marks the game as resumed
     * @returns {StatementBuilder} Promise that resolves when the resume is recorded
     */
    resumed() {
        return this.scormTracker.resumed();
    }

    /**
     * Marks the game as finished
     * @returns {StatementBuilder} Promise that resolves when the finish is recorded
     */
    terminated() {
        return this.scormTracker.terminated();
    }

    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @return {StatementBuilder} A new StatementBuilder instance
     *  */
    trace(verbId, objectType, objectId) {
        return super.trace(verbId, objectType, objectId);
    }

    /**
     * Creates a new statement builder from an xAPI statement
     * @param {Object} statement - The xAPI statement to create the builder from
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    fromXAPI(statement) {
        return super.fromXAPI(statement);
    }
    
    /**
     * Creates a game object tracker instance
     * @param {string} id - Game object ID
     * @param {string} type - Game object type
     * @returns {GameObjectTracker} New GameObjectTracker instance
     */
    gameObject(id, type=SERIOUSGAMESPROFILE.ACTIVITYTYPES.ITEM) {
        var gameObject;
        if(!this.instances["gameObject"][type]) {
            this.instances["gameObject"][type]={};
        }
        if(!this.instances["gameObject"][type][id]) {
            gameObject =new GameObjectTracker(this.tracker, id, type);
            this.instances["gameObject"][type][id]=gameObject;
        } else {
            gameObject=this.instances["gameObject"][type][id];
        }
        return gameObject;
    }

    /**
     * Creates a completable tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - Completable type
     * @returns {CompletableTracker} New CompletableTracker instance
     */
    completable(id, type=SERIOUSGAMESPROFILE.ACTIVITYTYPES.SERIOUS_GAME) {
        var completable;
        if(!this.instances["completable"][type]) {
            this.instances["completable"][type]={};
        }
        if(!this.instances["completable"][type][id]) {
            completable =new CompletableTracker(this.tracker, id, type);
            this.instances["completable"][type][id]=completable;
        } else {
            completable=this.instances["completable"][type][id];
        }
        return completable;
    }

    /**
     * Creates an alternative tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - Alternative type
     * @returns {AlternativeTracker} New AlternativeTracker instance
     */
    alternative(id, type=ALL.ACTIVITYTYPES.ASSESSMENT) {
        var alternative;
        if(!this.instances["alternative"][type]) {
            this.instances["alternative"][type]={};
        }
        if(!this.instances["alternative"][type][id]) {
            alternative =new AlternativeTracker(this.tracker, id, type);
            this.instances["alternative"][type][id]=alternative;
        } else {
            alternative=this.instances["alternative"][type][id];
        }
        return alternative;
    }

    /**
     * Creates an accessible tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - Accessible type
     * @returns {AccessibleTracker} New AccessibleTracker instance
     */
    accessible(id, type=SERIOUSGAMESPROFILE.ACTIVITYTYPES.AREA) {
        var accessible;
        if(!this.instances["accessible"][type]) {
            this.instances["accessible"][type]={};
        }
        if(!this.instances["accessible"][type][id]) {
            accessible =new AccessibleTracker(this.tracker, id, type);
            this.instances["accessible"][type][id]=accessible;
        } else {
            accessible=this.instances["accessible"][type][id];
        }
        return accessible;
    }
}

export { JSScormTracker, JSTracker, LRSTracker, SeriousGameTracker };
