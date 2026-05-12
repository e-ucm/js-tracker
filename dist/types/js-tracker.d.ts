/**
 * Main JavaScript Tracker class for xAPI tracking functionality
 */
export class JSTracker {
    ALL: Readonly<{
        CATEGORYID: Readonly<{
            ACADEMICASSESSMENTPROFILE: "https://pttportal.af.mil/xapi/profile/academic-assessment/v/1";
            ACROSSXPROFILE: "https://w3id.org/xapi/acrossx/v/2";
            ACTIONABLEDATABOOKADBPROFILE: "https://w3id.org/xapi/adb/v/2";
            ACTIVITYSTREAMSVOCABULARYPROFILE: "http://activitystrea.ms/schema";
            ADLVOCABULARYPROFILE: "https://w3id.org/xapi/adl/v/2";
            AUDIOPROFILE: "https://w3id.org/xapi/audio/v1.0";
            BOLLPROFILE: "https://ed3chain.com/xapi/boll/v/1";
            CMI5PROFILE: "https://w3id.org/xapi/cmi5/context/categories/cmi5/v/7";
            CONTENTREPOSITORYPROFILE: "https://xapi.org.au/contentprofile/v/2";
            COREPROFILE: "https://pttportal.af.mil/xapi/profile/core/v/1";
            DATASECURITYMODULEPROFILE: "https://profiles.adlnet.gov/xapi/71d1605b-b078-4494-b7b8-7f3a2b442f36/v/2";
            DODISDPROFILE: "https://w3id.org/xapi/dod-isd/v1.0";
            EDACOURSEPROFILE: "https://profiles.adlnet.gov/xapi/90feff49-3709-460a-855a-0025d0b12ab7/v/1";
            EMOTIONAPIPROFILE: "https://profiles.adlnet.gov/xapi/4a1d0786-1de4-4941-9edc-2513b5c83a17/v/1";
            FEEDBACKINTERACTIONPROFILE: "https://xapi.com.au/profiles/feedback-interaction/v1.0/v/2";
            FLASHCARDSPROFILE: "https://w3id.org/xapi/flashcards/v0.1";
            FLYINGPROFILE: "https://pttportal.af.mil/xapi/profile/flying/v/1";
            GBLXAPIK12EDUCATIONAPPSPROFILE: "https://w3id.org/xapi/gblxapi/v1.0";
            GENERALVOCABULARYPROFILE: "https://pttportal.af.mil/xapi/profile/vocab/v/1";
            GEOLOCATIONPROFILE: "https://xapi.org.au/geolocationprofile/v/1";
            GROUNDTRAININGPROFILE: "https://pttportal.af.mil/xapi/profile/ground-training/v/1";
            HROPENASSESSMENTSPROFILE: "http://profiles.usalearning.net/xapi/043b24b4-4389-435f-b052-805fd5563166/v/2";
            HYFLEXCLASSROOMPROFILE: "https://profiles.adlnet.gov/xapi/45ffd9b1-dcd2-4cee-87e1-5de83d5159c0/v/2";
            IMSGLOBALLEARNINGTOOLINTEROPERABILITYPROFILE: "http://profiles.usalearning.net/xapi/5eda3789-9801-4dcc-ae22-9971b2a31871/v/9";
            INITIALIZEDHHINITPROFILE: "https://profiles.adlnet.gov/xapi/b0085953-4e4e-4429-ba4e-afd6746095c4/v/1";
            LANGUAGEEXPERIMENTPROFILE: "https://w3id.org/xapi/langexperiment/v/1";
            LEARNINGMANAGEMENTSYSTEMPROFILE: "https://w3id.org/xapi/lms/v/1";
            TLAPROFILE: "https://w3id.org/xapi/tla/v/4";
            NAVYASSESSMENTPROFILE: "https://w3id.org/xapi/netc-assessment/v/3";
            NAVYCOMMONREFERENCEPROFILE: "https://w3id.org/xapi/netc/v/3";
            NAVYELEARNINGPROFILE: "https://w3id.org/xapi/netc-e-learning/v/1";
            NELCPROFILE: "http://profiles.usalearning.net/xapi/NELC/v/1";
            OPENEDXPROFILE: "https://w3id.org/xapi/openedx/v/5";
            ORPHANCONTAINERPROFILE: "https://profiles.usalearning.net/profiles/OrphanProfile/v/1";
            PDFANNOTATORPROFILE: "http://www.risc-inc.com/annotator/v1.0.";
            PERFORMANCESUPPORTPROFILE: "https://w3id.org/xapi/performance-support/v/6";
            SCORMPROFILE: "https://w3id.org/xapi/scorm/v/2";
            SERIOUSGAMESPROFILE: "https://w3id.org/xapi/seriousgames/v1.0";
            SIMULATIONBASEPROFILE: "https://w3id.org/xapi/simulation/v/3";
            SOCIALMEDIAPROFILE: "https://xapi.org.au/sociallearningprofile/v/2";
            SURVEYPOCPROFILE: "https://profiles.adlnet.gov/xapi/9109408b-fb88-46c8-b1cd-4bc1e2f37dab/v/1";
            SYLLABUSEVENTSPROFILE: "https://pttportal.af.mil/xapi/profile/syllabus-events/v/1";
            TASKTRAINERSIMULATIONPROFILE: "https://w3id.org/xapi/task-trainer-simulation/v/2";
            TINCANVOCABULARYPROFILE: "https://registry.tincanapi.com";
            VIDEOPROFILE: "https://w3id.org/xapi/video/v/2";
            VIRTUALCLASSROOMPROFILE: "https://w3id.org/xapi/virtual-classroom/v/1";
            VIRTUALPATIENTPROFILE: "https://w3id.org/xapi/virtual-patient/v1.0";
            XAPIOPENBADGESPROFILE: "http://specification.openbadges.org/xapi";
        }>;
        VERBS: Readonly<{
            IGNORED: string;
            UPDATED: string;
            PAUSED: string;
            PLAYED: string;
            SEEKED: string;
            ADJOURNED: string;
            APPLAUDED: string;
            ARRANGED: string;
            BOOKMARKED: string;
            CALLED: string;
            CLOSED_SALE: string;
            CREATED_OPPORTUNITY: string;
            DEFINED: string;
            DISABLED: string;
            DISCARDED: string;
            DOWNLOADED: string;
            EARNED: string;
            ENABLED: string;
            ENTERED_FRAME: string;
            ESTIMATED_DURATION: string;
            EXITED_FRAME: string;
            EXPECTED: string;
            EXPIRED: string;
            FOCUSED: string;
            HIRED: string;
            INTERVIEWED: string;
            LAUGHED: string;
            MARKED_AS_UNREAD: string;
            MENTIONED: string;
            MENTORED: string;
            PERFORMED_OFFLINE: string;
            PERSONALIZED: string;
            PREVIEWED: string;
            PROMOTED: string;
            RATED: string;
            REPLIED: string;
            REPLIED_TO_TWEET: string;
            REQUESTED_ATTENTION: string;
            RETWEETED: string;
            REVIEWED: string;
            SECURED: string;
            SELECTED: string;
            SKIPPED: string;
            TALKEDWITH: string;
            TWEETED: string;
            UNFOCUSED: string;
            UNREGISTERED: string;
            VIEWED: string;
            VOTED_DOWN: string;
            VOTED_UP: string;
            RECEIVED: string;
            RESTARTED: string;
            USED: string;
            JOINED: string;
            LEFT: string;
            LOVED: string;
            ACCESSED: string;
            PRESSED: string;
            RELEASED: string;
            UNLOCKED: string;
            COMPLETED: string;
            FAILED: string;
            INITIALIZED: string;
            PASSED: string;
            RESPONDED: string;
            RESUMED: string;
            SCORED: string;
            SUSPENDED: string;
            TERMINATED: string;
            DESELECTED: string;
            SEARCHED: string;
            SEARCHED_2: string;
            SEARCHED_3: string;
            ANNOTATED: string;
            MODIFIED_ANNOTATION: string;
            CHECK_OUT: string;
            CHECKED_IN: string;
            LOWERED_HAND: string;
            MUTED: string;
            RAISED_HAND: string;
            SHARED_SCREEN: string;
            STARTED_CAMERA: string;
            STOPPED_CAMERA: string;
            UNMUTED: string;
            UNSHARED_SCREEN: string;
            UNREPORTED: string;
            VOTED: string;
            CLOSED: string;
            OPENED: string;
            PRINTED: string;
            UPLOADED: string;
            APPRAISED: string;
            APPROVED: string;
            ASSERTED: string;
            ASSESSED: string;
            ATTENDED: string;
            CAPTURED: string;
            CERTIFIED: string;
            CLARIFIED: string;
            CONFERRED: string;
            CONTEXTUALIZED: string;
            DETAILED: string;
            DIRECTED: string;
            EMPLOYED: string;
            EVALUATED: string;
            EXPERIENCED: string;
            EXPLORED: string;
            INFERRED: string;
            LOCATED: string;
            MASTERED: string;
            MOBILIZED: string;
            ORGANIZED: string;
            PLANNED: string;
            PRIORITIZED: string;
            PROJECTED: string;
            QUALIFIED: string;
            RECOMMENDED: string;
            RECRUITED: string;
            REGISTERED: string;
            RESTRICTED: string;
            SCHEDULED: string;
            SCHOOLED: string;
            SCREENED: string;
            SOCIALIZED: string;
            SURVEYED: string;
            TRACKED: string;
            TRANSITIONED: string;
            VALIDATED: string;
            VERIFIED: string;
            RETURNED_LTI: string;
            USED_LTI: string;
            DRWAING: string;
            KICK: string;
            PROOFREAD: string;
            RECORD_VIDEO: string;
            REVISE: string;
            CHOOSE: string;
            DESIGNED: string;
            EMULATED: string;
            PERFORMED: string;
            RECORDED: string;
            SIMULATED: string;
            SOLVED: string;
            SOLVED_2: string;
            WROTE: string;
            CHECKED_OUT: string;
            FINISHED: string;
            COMMENTED: string;
            ABLED: string;
            ACCLIMATIZED: string;
            ACCOMMODATED: string;
            ACCOMPLISHED: string;
            ACHIEVED: string;
            ACKNOWLEDGED: string;
            ACTIVATED: string;
            ACTUATED: string;
            ADAPTED: string;
            ADJUSTED: string;
            ADMINISTERED: string;
            ADVANCED: string;
            ADVISED: string;
            ALERTED: string;
            ALIGNED: string;
            ALLOCATED: string;
            ALLOWED: string;
            ALTERED: string;
            AMBUSHED: string;
            ANALYZED: string;
            ANNOUNCED: string;
            ANSWERED: string;
            APPLIED: string;
            APPRECIATED: string;
            ARCHIVED: string;
            ARMED: string;
            ASKED: string;
            ASSAULTED: string;
            ASSEMBLED: string;
            ASSIGNED: string;
            ASSISTED: string;
            ASSUMED: string;
            ATTACHED: string;
            ATTACKED: string;
            ATTENDED_CLOSELY: string;
            AUTHENTICATED: string;
            BALANCED: string;
            BELIEVED: string;
            BREACHED: string;
            BRIEFED: string;
            BYPASSED: string;
            CALCULATED: string;
            CALIBRATED: string;
            CAMOUFLAGED: string;
            CANCELED: string;
            CARRIED: string;
            CATEGORIZED: string;
            CAUSED: string;
            CENTERED: string;
            CHALLENGED: string;
            CHANGED: string;
            CHARGED: string;
            CHECKED: string;
            CHOSE: string;
            CLASSIFIED: string;
            CLEANED: string;
            CLEARED: string;
            COLLATED: string;
            COLLECTED: string;
            COMBINED: string;
            COMMANDED: string;
            COMMUNICATED: string;
            COMPARED: string;
            COMPILED: string;
            COMPLETED_ASSIGNMENT: string;
            COMPLIED: string;
            COMPOSED: string;
            COMPUTED: string;
            CONCEIVED: string;
            CONCLUDED: string;
            CONDENSED: string;
            CONDUCTED: string;
            CONFIRMED: string;
            CONJECTURED: string;
            CONNECTED: string;
            CONSOLIDATED: string;
            CONSTRUCTED: string;
            CONTRASTED: string;
            CONTRIVED: string;
            CONTROLLED: string;
            CONVERTED: string;
            COORDINATED: string;
            CORRECTED: string;
            CORRELATED: string;
            COVERED: string;
            CREATED: string;
            CREPT: string;
            CRITICIZED: string;
            CROSS_CHECKED: string;
            CROSSED: string;
            DEBRIEFED: string;
            DEBUGGED: string;
            DECIDED: string;
            DECONTAMINATED: string;
            DEFENDED: string;
            DELAYED: string;
            DELETED: string;
            DELIVERED: string;
            DEMONSTRATED: string;
            DEPARTED: string;
            DEPLOYED: string;
            DERIVED: string;
            DESCRIBED: string;
            DESIGNATED: string;
            DESTROYED: string;
            DETECTED: string;
            DETERMINED: string;
            DEVELOPED: string;
            DEVISED: string;
            DIAGNOSED: string;
            DIAGRAMMED: string;
            DIFFERENTIATED: string;
            DISASSEMBLED: string;
            DISCONNECTED: string;
            DISCOVERED: string;
            DISCRIMINATED: string;
            DISENGAGED: string;
            DISMANTLED: string;
            DISPATCHED: string;
            DISPLACED: string;
            DISPLAYED: string;
            DISPOSED: string;
            DISSEMINATED: string;
            DISTINGUISHED: string;
            DISTRIBUTED: string;
            DIVIDED: string;
            DRAFTED: string;
            DREW: string;
            DROVE: string;
            DUG: string;
            EDITED: string;
            EFFECTED: string;
            EGRESSED: string;
            ELABORATED: string;
            ELEVATED: string;
            ELIMINATED: string;
            EMPLACED: string;
            ENCODED: string;
            ENCRYPTED: string;
            ENERGIZED: string;
            ENFORCED: string;
            ENGAGED: string;
            ENSURED: string;
            ENTERED: string;
            ESTABLISHED: string;
            ESTIMATED: string;
            EVACUATED: string;
            EVADED: string;
            EXCHANGED: string;
            EXECUTED: string;
            EXPLAINED: string;
            EXPRESSED: string;
            EXTENDED: string;
            EXTRACTED: string;
            FELL: string;
            FELT: string;
            FILLED_OUT: string;
            FINALIZED: string;
            FIRED: string;
            FIT: string;
            FOLLOWED: string;
            FORMATTED: string;
            FORMULATED: string;
            FORWARDED: string;
            FOUND: string;
            FUELED: string;
            GAVE: string;
            GENERALIZED: string;
            GENERATED: string;
            GROUNDED: string;
            GROUPED: string;
            GUARDED: string;
            GUIDED: string;
            HARDENED: string;
            HEARD: string;
            HELD: string;
            HOISTED: string;
            HOVERED: string;
            HYPOTHESIZED: string;
            IDENTIFIED: string;
            ILLUSTRATED: string;
            IMAGINED: string;
            IMPLEMENTED: string;
            INDICATED: string;
            INFILTRATED: string;
            INFLUENCED: string;
            INFORMED: string;
            INITIATED: string;
            INNOVATED: string;
            INPUT: string;
            INSERTED: string;
            INSPECTED: string;
            INSTALLED: string;
            INSTRUCTED: string;
            INTEGRATED: string;
            INTERCEPTED: string;
            INTERPRETED: string;
            INVENTED: string;
            INVESTIGATED: string;
            ISOLATED: string;
            ISSUED: string;
            JACKED: string;
            JUDGED: string;
            JUSTIFIED: string;
            LABELED: string;
            LAID: string;
            LANDED: string;
            LAUNCHED: string;
            LED: string;
            LEVELED: string;
            LIFTED: string;
            LISTED: string;
            LISTENED: string;
            LISTENED_ATTENTIVELY: string;
            LOADED: string;
            LOGGED: string;
            LUBRICATED: string;
            MADE: string;
            MAINTAINED: string;
            MANAGED: string;
            MANEUVERED: string;
            MANIPULATED: string;
            MAPPED: string;
            MATCHED: string;
            MEASURED: string;
            MODIFIED: string;
            MONITORED: string;
            MOUNTED: string;
            MOVED: string;
            NAMED: string;
            NAVIGATED: string;
            NEUTRALIZED: string;
            NOTIFIED: string;
            OBEYED_RULES: string;
            OBSERVED: string;
            OBTAINED: string;
            OCCUPIED: string;
            OPERATED: string;
            ORDERED: string;
            ORIENTED: string;
            ORIGINATED: string;
            OUTLINED: string;
            PACKED: string;
            PARKED: string;
            PATROLLED: string;
            PERCEIVED: string;
            PLACED: string;
            PLOTTED: string;
            POLICED: string;
            POSITIONED: string;
            POSTED: string;
            PREDICTED: string;
            PREPARED: string;
            PRESCRIBED: string;
            PRESSURIZED: string;
            PREVENTED: string;
            PRIMED: string;
            PROCESSED: string;
            PROCURED: string;
            PRODUCED: string;
            PROGRAMMED: string;
            PROPOSED: string;
            PROTECTED: string;
            PROVIDED: string;
            PUBLISHED: string;
            PULLED: string;
            QUEUED: string;
            RAISED: string;
            RAN: string;
            RANGED: string;
            RANKED: string;
            REACHED: string;
            REACTED: string;
            READ: string;
            READIED: string;
            REALIGNED: string;
            REASSESSED: string;
            RECALLED: string;
            RECOGNIZED: string;
            RECONCILED: string;
            RECONNOITERED: string;
            RECOUNTED: string;
            RECOVERED: string;
            REDISTRIBUTED: string;
            REDUCED: string;
            REESTABLISHED: string;
            REEXAMINED: string;
            REFUELED: string;
            REGULATED: string;
            RELIEVED: string;
            RELOCATED: string;
            REMOVED: string;
            REORGANIZED: string;
            REPAIRED: string;
            REPLACED: string;
            REPLENISHED: string;
            REPORTED: string;
            REQUESTED: string;
            RESET: string;
            RESOLVED: string;
            RESTATED: string;
            RETRIEVED: string;
            RETURNED: string;
            REVISED: string;
            ROTATED: string;
            ROUTED: string;
            SAVED: string;
            SAW: string;
            SCANNED: string;
            SENT: string;
            SEPARATED: string;
            SERVED: string;
            SERVICED: string;
            SET: string;
            SET_UP: string;
            SHARED: string;
            SHOWED: string;
            SHOWED_AWARENESS: string;
            SHOWED_SENSITIVITY: string;
            SHUT_DOWN: string;
            SIGHTED: string;
            SIGNALED: string;
            SMELLED: string;
            SORTED: string;
            SPECIFIED: string;
            SPLINTED: string;
            SQUEEZED: string;
            STARTED: string;
            STATED: string;
            STAYED: string;
            STEERED: string;
            STOCKPILED: string;
            STOOD_TO: string;
            STOPPED: string;
            STORED: string;
            STOWED: string;
            STRUCK: string;
            STUDIED: string;
            SUBMITTED: string;
            SUMMARIZED: string;
            SUPERVISED: string;
            SUPPORTED: string;
            SUPPRESSED: string;
            SWAM: string;
            SWEPT: string;
            SYNTHESIZED: string;
            TAILORED: string;
            TAPPED: string;
            TASKED: string;
            TASTED: string;
            TEMPERED: string;
            TEMPLATED: string;
            TESTED: string;
            THREW: string;
            TIGHTENED: string;
            TOLD: string;
            TOOK: string;
            TOOK_CHARGE: string;
            TOOK_OFF: string;
            TRACED: string;
            TRAINED: string;
            TRANSFERRED: string;
            TRANSLATED: string;
            TRANSMITTED: string;
            TRANSPORTED: string;
            TRAVERSED: string;
            TREATED: string;
            TRIAGED: string;
            TROUBLESHOT: string;
            TUNED: string;
            TURNED: string;
            TWISTED: string;
            TYPED: string;
            UNLOADED: string;
            UTILIZED: string;
            VISUALIZED: string;
            WAITED: string;
            WAR_GAMED: string;
            WORE: string;
            ZEROED: string;
            CHAPTER_INTRODUCTION_FINISHED: string;
            ADDED: string;
            COMMENCED: string;
            WITHDREW: string;
            ABANDONED: string;
            SATISFIED: string;
            WAIVED: string;
            DECLINED: string;
            ATTEMPTED: string;
            EXITED: string;
            IMPORTED: string;
            INTERACTED: string;
            LOGGED_IN: string;
            LOGGED_OUT: string;
            PREFERRED: string;
            PROGRESSED: string;
            VOIDED: string;
            ACCEPTED: string;
            AGREED: string;
            APPENDED: string;
            AUTHORED: string;
            AUTHORIZED: string;
            BORROWED: string;
            BUILT: string;
            CHECKEDIN: string;
            CONSUMED: string;
            DENIED: string;
            DISAGREED: string;
            DISLIKED: string;
            FAVORITED: string;
            FLAGGED_AS_INAPPROPRIATE: string;
            HOSTED: string;
            INVITED: string;
            LIKED: string;
            LOST: string;
            MADEFRIEND: string;
            PRESENTED: string;
            PURCHASED: string;
            REJECTED: string;
            REMOVED_FRIEND: string;
            REQUESTED_FRIEND: string;
            RETRACTED: string;
            RSVP_MAYBE: string;
            RSVP_NO: string;
            RSVP_YES: string;
            SOLD: string;
            SPONSORED: string;
            STOPPED_FOLLOWING: string;
            TAGGED: string;
            TIED: string;
            UNFAVORITED: string;
            UNLIKED: string;
            UNSATISFIED: string;
            UNSAVED: string;
            UNSHARED: string;
            WAS_AT: string;
            WATCHED: string;
            WON: string;
            ARRIVED: string;
            COACHED: string;
            DEMANDED: string;
            HIGHLIGHTED: string;
            NOTED: string;
            REFERENCED: string;
            REVEALED: string;
            WAS_ASSIGNED: string;
        }>;
        ACTIVITYTYPES: Readonly<{
            VIRTUAL_CLASSROOM: string;
            VIDEO: string;
            BLOG: string;
            BOOK: string;
            CATEGORY: string;
            CERTIFICATE: string;
            CHAPTER: string;
            CHAT_CHANNEL: string;
            CHAT_MESSAGE: string;
            CHECKLIST: string;
            CHECKLIST_ITEM: string;
            CODE_COMMIT: string;
            COMMUNITY_SITE: string;
            CONFERENCE: string;
            CONFERENCE_SESSION: string;
            CONFERENCE_TRACK: string;
            DISCUSSION: string;
            DOCUMENT: string;
            DOUBT: string;
            EMAIL: string;
            EMBEDDED_STRATEGY: string;
            ESSAY: string;
            FORUM_REPLY: string;
            FORUM_TOPIC: string;
            GOAL: string;
            GRADE_CLASSIFICATION: string;
            LEGACY_LEARNING_STANDARD: string;
            LMS: string;
            PARAGRAPH: string;
            PLAYLIST: string;
            PROJECT: string;
            PROJECT_SITE: string;
            RESEARCH_REPORT: string;
            RESOURCE: string;
            REWARD: string;
            SALES_OPPORTUNITY: string;
            SCENARIO: string;
            SCHOOL_ASSIGNMENT: string;
            SECTION: string;
            SECURITY_ROLE: string;
            SIMPLE_COLLECTION: string;
            SLIDE: string;
            SLIDE_DECK: string;
            SOLUTION: string;
            SOURCE: string;
            STATUS_UPDATE: string;
            STEP: string;
            STRATEGY: string;
            SUBCATEGORY: string;
            SUGGESTION: string;
            TAG: string;
            TEST_DATA_BATCH: string;
            TUTOR_SESSION: string;
            TWEET: string;
            UNIT_TEST: string;
            UNIT_TEST_SUITE: string;
            USER_PROFILE: string;
            VOCABULARY_WORD: string;
            VOICEMAIL: string;
            WEBINAR: string;
            FEEDBACK_CORRECTIVE: string;
            FEEDBACK_ERROR: string;
            FEEDBACK_PERFORMANCE: string;
            FEEDBACK_SAFETY: string;
            TASK_TRAINER_DOCUMENT: string;
            TASK_TRAINER_SCENARIO: string;
            TASK_TRAINER_STEP: string;
            TASK_TRAINER_TASK: string;
            TASK_TRAINER_TOOL: string;
            TEST_TEST: string;
            SYLLABUS_EVENT: string;
            SYLLABUS_PHASE: string;
            SYLLABUS_UNIT: string;
            TRAINING_PROGRAM: string;
            AREA: string;
            CONTROLLER: string;
            CUTSCENE: string;
            DIALOG_TREE: string;
            ENEMY: string;
            ITEM: string;
            KEYBOARD: string;
            LEVEL: string;
            MENU: string;
            MOUSE: string;
            NON_PLAYER_CHARACTER: string;
            QUEST: string;
            SCREEN: string;
            SERIOUS_GAME: string;
            TOUCHSCREEN: string;
            ZONE: string;
            ASSESSMENT: string;
            ATTEMPT: string;
            CMI_INTERACTION: string;
            COURSE: string;
            LESSON: string;
            MODULE: string;
            OBJECTIVE: string;
            PROFILE: string;
            APPLICATION: string;
            APPLICATION_2: string;
            IMAGE: string;
            PERFORMANCE_SUPPORT: string;
            PROCEDURE: string;
            PROCEDURE_2: string;
            TASK: string;
            FREETEXT_ANNOTATION: string;
            HIGHLIGHTED_TEXT_ANNOTATION: string;
            NOTE_ANNOTATION: string;
            UNDERLINE_ANNOTATION: string;
            SIMULATION_SESSION: string;
            MENU_ITEM: string;
            ORGANIZATION: string;
            ACTIVITY: string;
            BADGE: string;
            CAREER: string;
            CAREER_STATE: string;
            COMPETENCY: string;
            CONTENT_SET: string;
            CREDENTIAL: string;
            JOB_DUTY_GIG: string;
            CLASS_SECTION: string;
            CONCENTRATION: string;
            FEEDBACK_ON_CLASS: string;
            HIGHLIGHT_VIDEO: string;
            PHOTO: string;
            SECOND_DEVICE: string;
            SPEAK: string;
            WHISPER: string;
            AUDIO: string;
            CODE_ASSESSMENT: string;
            FIELD_ASSESSMENT: string;
            LEADERSHIP_ASSESSMENT: string;
            PERSONALITY_ASSESSMENT: string;
            POLICE_ASSESSMENT: string;
            PSYCHOMETRIC_ASSESSMENT: string;
            VIRTUAL_REALITY_ASSESSMENT: string;
            WORK_SAMPLE_ASSESSMENT: string;
            GROUND_TRAINING_ASSESSMENT: string;
            GROUND_TRAINING_LESSON: string;
            PLACE: string;
            FLIGHT_OPERATION: string;
            MANEUVER: string;
            FLASHCARD: string;
            FLASHCARD_DECK: string;
            FEEDBACK_INTERACTION: string;
            JOURNAL_ARTICLE: string;
            SURVEY: string;
            BLOCK: string;
            LMS_COURSE: string;
            PRINTED_ASSESSMENT: string;
            PROGRAM: string;
            FILE: string;
            LINK: string;
            MEDIA: string;
            MEETING: string;
            PERFORMANCE: string;
            QUESTION: string;
            SIMULATION: string;
            ALERT: string;
            ARTICLE: string;
            BINARY: string;
            BOOKMARK: string;
            COLLECTION: string;
            COMMENT: string;
            DEVICE: string;
            EVENT: string;
            GAME: string;
            GROUP: string;
            ISSUE: string;
            JOB: string;
            NOTE: string;
            OFFER: string;
            PAGE: string;
            PERSON: string;
            PROCESS: string;
            PRODUCT: string;
            REVIEW: string;
            SERVICE: string;
            COLLABORATION: string;
            E_BOOK: string;
            FACE_TO_FACE_DISCUSSION: string;
            INSTANT_RESPONSE_SYSTEM: string;
            LEARNING_PLAN: string;
            MESSAGE: string;
            ONLINE_DISCUSSION: string;
            PRINTED_BOOK: string;
            PRINTED_WORKSHEET: string;
            SEARCH_ENGINE: string;
            WEBPAGE: string;
        }>;
        ACTIVITYEXTENSION: Readonly<{
            EMOTION: string;
            PROCEDURE_METADATA: string;
            STEP_METADATA: string;
            COA_ID: string;
            RESOURCE_URL: string;
            TARGET_AUDIENCE: string;
            TARGET_RATING: string;
            EXTENDED_INTERACTION_TYPE: string;
            INTERACTION_ID_NUMBER: string;
            INSTANCE: string;
            TYPE_OF_QUIZ: string;
            DIFFICULTY: string;
            AROUSAL: string;
            VALENCE: string;
            ALIGNMENT: string;
            ANCHOR_TEXT: string;
            BLOOMS_LEVEL: string;
            BY_WHOM: string;
            CHAPTER: string;
            COLUMN: string;
            FEEDBACK: string;
            HIGHLIGHTEDSTRING: string;
            PASS_SCORE: string;
            ROW: string;
            SECTION: string;
            SUPPLEMENTAL_INFO: string;
            TIME_LIMIT: string;
            TOTAL_ITEMS: string;
            TOTAL_PAGES: string;
            TOTAL_SCORE: string;
            TYPE: string;
        }>;
        CONTEXTEXTENSION: Readonly<{
            OPEN_BADGE_CLASS: string;
            CAMERA_ACTIVATED: string;
            HAND_RAISED: string;
            MICRO_ACTIVATED: string;
            SCREEN_SHARED: string;
            CC_SUBTITLE_ENABLED: string;
            CC_SUBTITLE_LANG: string;
            COMPLETION_THRESHOLD: string;
            FRAME_RATE: string;
            FULL_SCREEN: string;
            LENGTH: string;
            QUALITY: string;
            SCREEN_SIZE: string;
            SESSION_ID: string;
            SPEED: string;
            TRACK: string;
            USER_AGENT: string;
            VIDEO_PLAYBACK_SIZE: string;
            VOLUME: string;
            ASSESSMENT_TYPE: string;
            ATTEMPT_ID: string;
            BROWSER_INFORMATION: string;
            CMI_INTERACTION_WEIGHTING: string;
            COLLECTION_TYPE: string;
            COLOR: string;
            CONDITION_TYPE: string;
            CONDITION_VALUE: string;
            DATA_URI: string;
            DATE: string;
            DATETIME: string;
            DROP_DOWN: string;
            ENDING_POSITION: string;
            FEEDBACK: string;
            GEO_JSON: string;
            INVITEE: string;
            IP_ADDRESS: string;
            IRL: string;
            ISBN: string;
            JWS_CERTIFICATE_LOCATION: string;
            LATITUDE: string;
            LOCATION: string;
            LONGITUDE: string;
            MEASUREMENT: string;
            MONETARY_VALUE: string;
            OBSERVER: string;
            PLANNED_DURATION: string;
            PLANNED_START_TIME: string;
            POSITION: string;
            POWERED_BY: string;
            PRIVATE_AREA: string;
            PUBLISHED: string;
            PURPOSE: string;
            REFERRER: string;
            REFLECTION: string;
            SEVERITY: string;
            SHARE_MEDIUM: string;
            STARTING_POINT: string;
            STARTING_POSITION: string;
            TAGS: string;
            TARGET: string;
            TOPIC: string;
            TRAINING_PROVIDER: string;
            TWEET: string;
            UPDATED: string;
            MEDIA_CATEGORY: string;
            ELEMENT_NOMENCLATURE: string;
            ELEMENT_REF_DES: string;
            S1000D_DMC: string;
            S1000D_SNS: string;
            SIMULATION_MODE: string;
            LAUNCH_MODE: string;
            HIGHLIGHTED_STRING: string;
            PAGE_INDEX: string;
            PDF_ANNOTATION_HIGHLIGHT_COLOUR: string;
            PDF_RECTANGLE_MAP: string;
            TRANSFORMER_VERSION: string;
            INSTRUCTOR: string;
            COURSE_ID_NUMBER: string;
            FEEDBACK_TARGET: string;
            HULL_APPLICABILITY: string;
            HULL_CONFIGURATION: string;
            LAUNCH_LOCATION: string;
            LEARNING_OBJECTIVE: string;
            NAVY_ENLISTED_CLASSIFICATION: string;
            REFERRER_LOCATION: string;
            SCHOOL_CENTER: string;
            TECH_DOC_ID: string;
            TECH_DOC_PROCEDURE_ID: string;
            TECH_DOC_PROCEDURE_TITLE: string;
            CONFIDENCE: string;
            DEP: string;
            DUE_DATE: string;
            EVIDENCE: string;
            EXPIRATION: string;
            PERMANENT_CHANGE_OF_STATION: string;
            REASON: string;
            RESTRICTION_REASON: string;
            UNIT_IDENTIFICATION_CODE: string;
            ENDING_DATE: string;
            ROLE: string;
            STARTING_DATE: string;
            FEDERATED_SESSION_ID: string;
            CLASSROOM_SUBJECT: string;
            LEARNING_TOOL: string;
            PARTICIPATION_MODE: string;
            ACTION: string;
            DOMAIN: string;
            FOCUS: string;
            GRADE: string;
            SKILL: string;
            SUBDOMAIN: string;
            CATEGORY: string;
            INTERACTIVITY_LEVEL: string;
            KSA: string;
            ACADEMIC_TERM: string;
            ACADEMIC_YEAR: string;
            CITATION_INFO: string;
            COUNT: string;
            COURSE_CODE: string;
            DOI: string;
            ISSN: string;
            LAUNCH_PARAMETERS: string;
            LAUNCH_URL: string;
            MASTERY_SCORE: string;
            MOVE_ON: string;
            LEARNER: string;
            SCHOOL: string;
            MENTIONEDAGENT: string;
        }>;
        RESULTEXTENSION: Readonly<{
            OPEN_BADGE_ASSERTION: string;
            PLAYED_SEGMENTS: string;
            PROGRESS: string;
            TIME: string;
            TIME_FROM: string;
            TIME_TO: string;
            ACTIONSPER_MINUTE: string;
            CLASSIFICATION: string;
            DURATION: string;
            ENDING_POINT: string;
            QUALITY_RATING: string;
            TETRIS_LINES: string;
            VALID_UNTIL: string;
            HEALTH: string;
            POSITION: string;
            SPEED_FROM: string;
            SPEED_TO: string;
            RESPONSE_EXPLANATION: string;
            RESPONSE_TYPE: string;
            RECOMMENDATION_ORDER: string;
            ACCURACY_RATE: string;
            PROGRESS_RATE: string;
            SATISFACTION_SCORE: string;
            COMMENT_TEXT: string;
            STAR_RATING: string;
            REASON: string;
            RUBRICS: string;
            STARTING_POINT: string;
        }>;
    }>;
    STATEMENT_BUILDER_IDS: Readonly<{
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
    /**
     * The underlying tracker instance
     * @type {xAPITrackerAssetOAuth2|xAPITrackerAssetOAuth1|xAPITrackerAsset}
     */
    tracker: xAPITrackerAssetOAuth2 | xAPITrackerAssetOAuth1 | xAPITrackerAsset;
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
    trackerSettings: {
        generateSettingsFromURLParams: boolean;
        oauth_type: string;
        batch_mode: boolean;
        batch_endpoint: string;
        batch_length: number;
        batch_timeout: any;
        actor_homePage: string;
        actor_name: string;
        backup_mode: boolean;
        backup_endpoint: string;
        backup_type: string;
        default_uri: string;
        max_retry_delay: any;
        debug: boolean;
        parent_activity_id: string;
        parent_activity_type: string;
    };
    /**
     * @typedef {Object} oauth1
     * @property {string} username
     * @property {string} password
     */
    oauth1: {
        username: string;
        password: string;
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
    oauth2: {
        token_endpoint: string;
        client_id: string;
        grant_type: string;
        scope: string;
        state: string;
        code_challenge_method: string;
        username: string;
        password: string;
        login_hint: string;
    };
    /**
     *
     * @returns {Promise<void>}
     */
    login(): Promise<void>;
    start(): void;
    Started: boolean;
    stop(): void;
    started: boolean;
    logout(): void;
    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Flush options
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    flush({ withBackup }?: {
        withBackup?: boolean;
    }): Promise<void>;
    /**
     * Generates an xAPI tracker instance from URL parameters
     */
    generateXAPITrackerFromURLParams(): void;
    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId: string, objectType: string, objectId: string): StatementBuilder;
    /**
     * Creates a new statement builder from an xAPI statement
     * @param {Object} statement - The xAPI statement to create the builder from
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    fromXAPI(statement: any): StatementBuilder;
}
/**
 * SCORM-specific tracker extending JSTracker
 */
export class JSScormTracker extends JSTracker {
    SCORMPROFILE: Readonly<{
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
    /**
     * list of scorm instances
     */
    scormInstances: {};
    /**
     * Creates a new SCORM tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - SCORM type
     * @returns {ScormTracker} New SCORM tracker instance
     */
    scorm(id: string, type?: string): ScormTracker;
}
/**
 * SCORM-specific tracker extending JSTracker
 */
export class LRSTracker extends JSTracker {
    /**
     * Creates a new statement builder from an xAPI statement
     * @param {Object} statement - The xAPI statement to create the builder from
     * @returns {LRSStatementBuilder} A new StatementBuilder instance
     */
    fromXAPI(statement: any): LRSStatementBuilder;
    /**
     * Get the underlying LRS client for direct API calls
     * @returns {Object} The LRS client instance
     */
    getLRSClient(): any;
    /**
     * Gets a statement by its ID
     * @param {string} statementId - The ID of the statement to fetch
     * @returns {Promise} A promise that resolves with the fetched statement
     */
    getStatementById(statementId: string): Promise<any>;
    /**
     * Gets statements based on a query
     * @param {Object} query - The query to filter statements
     * @returns {Promise} A promise that resolves with the fetched statements
     */
    getStatementByQuery(query: any): Promise<any>;
    /**
     * Gets more statements using a "more" URL from a previous query result
     * @param {string} moreUrl - The URL to fetch more statements
     * @returns {Promise} A promise that resolves with the fetched statements
     */
    getMoreStatements(moreUrl: string): Promise<any>;
}
/**
 * Serious Game Tracker extending JSTracker with game-specific functionality
 */
export class SeriousGameTracker extends JSTracker {
    /**
     * Accessible type constants
     */
    SERIOUSGAMEPROFILE: Readonly<{
        CATEGORYID: "https://w3id.org/xapi/seriousgames/v1.0";
        VERBS: {
            ACCESSED: string;
            PRESSED: string;
            RELEASED: string;
            UNLOCKED: string;
            USED: string;
        };
        ACTIVITYTYPES: {
            AREA: string;
            CONTROLLER: string;
            CUTSCENE: string;
            DIALOG_TREE: string;
            ENEMY: string;
            ITEM: string;
            KEYBOARD: string;
            LEVEL: string;
            MENU: string;
            MOUSE: string;
            NON_PLAYER_CHARACTER: string;
            QUEST: string;
            SCREEN: string;
            SERIOUS_GAME: string;
            TOUCHSCREEN: string;
            ZONE: string;
        };
        ACTIVITYEXTENSION: {};
        CONTEXTEXTENSION: {};
        RESULTEXTENSION: {
            HEALTH: string;
            POSITION: string;
            PROGRESS: string;
        };
    }>;
    /**
     * SCORM tracker instance
     * @type {ScormTracker}
     */
    scormTracker: ScormTracker;
    /**
     * list of instances
     */
    instances: {
        completable: {};
        gameObject: {};
        alternative: {};
        accessible: {};
    };
    parent_activity_id: string;
    /**
     * Marks the game as started
     * @returns {StatementBuilder} Promise that resolves when the start is recorded
     */
    initialized(): StatementBuilder;
    /**
     * Marks the game as paused
     * @returns {StatementBuilder} Promise that resolves when the pause is recorded
     */
    pause(): StatementBuilder;
    /**
     * Marks the game as resumed
     * @returns {StatementBuilder} Promise that resolves when the resume is recorded
     */
    resumed(): StatementBuilder;
    /**
     * Marks the game as finished
     * @returns {StatementBuilder} Promise that resolves when the finish is recorded
     */
    terminated(): StatementBuilder;
    /**
     * Creates a game object tracker instance
     * @param {string} id - Game object ID
     * @param {string} type - Game object type
     * @returns {GameObjectTracker} New GameObjectTracker instance
     */
    gameObject(id: string, type?: string): GameObjectTracker;
    /**
     * Creates a completable tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - Completable type
     * @returns {CompletableTracker} New CompletableTracker instance
     */
    completable(id: string, type?: string): CompletableTracker;
    /**
     * Creates an alternative tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - Alternative type
     * @returns {AlternativeTracker} New AlternativeTracker instance
     */
    alternative(id: string, type?: string): AlternativeTracker;
    /**
     * Creates an accessible tracker instance
     * @param {string} id - Activity ID
     * @param {string} type - Accessible type
     * @returns {AccessibleTracker} New AccessibleTracker instance
     */
    accessible(id: string, type?: string): AccessibleTracker;
}
import xAPITrackerAssetOAuth2 from './Auth/OAuth2.js';
import xAPITrackerAssetOAuth1 from './Auth/OAuth1.js';
import xAPITrackerAsset from './xAPITrackerAsset.js';
import StatementBuilder from './HighLevel/StatementBuilder/StatementBuilder.js';
import { ScormTracker } from './HighLevel/Scorm/SCORM.js';
import LRSStatementBuilder from './HighLevel/StatementBuilder/LRSStatementBuilder.js';
import { GameObjectTracker } from './HighLevel/SeriousGames/GameObject.js';
import { CompletableTracker } from './HighLevel/Scorm/Completable.js';
import { AlternativeTracker } from './HighLevel/SeriousGames/Alternative.js';
import { AccessibleTracker } from './HighLevel/SeriousGames/Accessible.js';
