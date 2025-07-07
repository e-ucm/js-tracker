/**
 * SCORM-specific tracker extending JSTracker
 */
export class JSScormTracker extends JSTracker {
    /**
     * SCORM type constants
     * @type {Object}
     */
    SCORMTYPE: any;
    /**
     * list of scorm instances
     */
    scormInstances: {};
    /**
     * Creates a new SCORM tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - SCORM type
     * @returns {ScormTracker} New SCORM tracker instance
     */
    scorm(id: string, type?: number): ScormTracker;
}
/**
 * Main JavaScript Tracker class for xAPI tracking functionality
 */
export class JSTracker {
    /**
     * Creates a new JSTracker instance
     * @param {Object} [config] - Configuration options
     * @param {string} [config.result_uri] - Primary xAPI endpoint URI
     * @param {string} [config.backup_uri] - Backup endpoint URI
     * @param {string} [config.backup_type] - Type of backup (XAPI or CSV)
     * @param {string} [config.actor_homePage] - Actor's homepage URL
     * @param {string} [config.actor_name] - Actor's username
     * @param {string} [config.auth_token] - Authentication token
     * @param {string} [config.default_uri] - Default URI for statements
     * @param {boolean} [config.debug] - Debug mode flag
     */
    constructor({ result_uri, backup_uri, backup_type, actor_homePage, actor_name, auth_token, default_uri, debug }?: {
        result_uri?: string;
        backup_uri?: string;
        backup_type?: string;
        actor_homePage?: string;
        actor_name?: string;
        auth_token?: string;
        default_uri?: string;
        debug?: boolean;
    });
    /**
     * The underlying tracker instance
     * @type {xAPITrackerAsset|xAPITrackerAssetOAuth1|xAPITrackerAssetOAuth2}
     */
    tracker: xAPITrackerAsset | xAPITrackerAssetOAuth1 | xAPITrackerAssetOAuth2;
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
     * @param {Object} [config] - Configuration options
     * @param {string} [config.default_uri] - Default URI for statements
     */
    generateXAPITrackerFromURLParams({ default_uri }?: {
        default_uri?: string;
    }): void;
}
/**
 * Serious Game Tracker extending JSTracker with game-specific functionality
 */
export class SeriousGameTracker extends JSTracker {
    /**
     * Creates a new SeriousGameTracker instance
     * @param {Object} [config] - Configuration options
     * @param {string} [config.result_uri] - Primary xAPI endpoint URI
     * @param {string} [config.backup_uri] - Backup endpoint URI
     * @param {string} [config.activityId] - Activity ID
     * @param {string} [config.backup_type] - Type of backup (XAPI or CSV)
     * @param {string} [config.actor_homePage] - Actor's homepage URL
     * @param {string} [config.actor_name] - Actor's username
     * @param {string} [config.auth_token] - Authentication token
     * @param {string} [config.default_uri] - Default URI for statements
     * @param {boolean} [config.debug] - Debug mode flag
     */
    constructor({ result_uri, backup_uri, activityId, backup_type, actor_homePage, actor_name, auth_token, default_uri, debug }?: {
        result_uri?: string;
        backup_uri?: string;
        activityId?: string;
        backup_type?: string;
        actor_homePage?: string;
        actor_name?: string;
        auth_token?: string;
        default_uri?: string;
        debug?: boolean;
    });
    /**
     * Accessible type constants
     */
    ACCESSIBLETYPE: Readonly<{
        SCREEN: 0;
        AREA: 1;
        ZONE: 2;
        CUTSCENE: 3;
        ACCESSIBLE: 4;
    }>;
    /**
     * Completable type constants
     */
    COMPLETABLETYPE: Readonly<{
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
    /**
     * Alternative type constants
     */
    ALTERNATIVETYPE: Readonly<{
        QUESTION: 0;
        MENU: 1;
        DIALOG: 2;
        PATH: 3;
        ARENA: 4;
        ALTERNATIVE: 5;
    }>;
    /**
     * Game object type constants
     */
    GAMEOBJECTTYPE: Readonly<{
        ENEMY: 0;
        NPC: 1;
        ITEM: 2;
        GAMEOBJECT: 3;
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
    /**
     * Marks the game as started
     * @returns {StatementBuilder} Promise that resolves when the start is recorded
     */
    start(): StatementBuilder;
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
    finish(): StatementBuilder;
    /**
     * Creates an accessible tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Accessible type
     * @returns {AccessibleTracker} New AccessibleTracker instance
     */
    accessible(id: string, type?: number): AccessibleTracker;
    /**
     * Creates a game object tracker instance
     * @param {string} id - Game object ID
     * @param {number} type - Game object type
     * @returns {GameObjectTracker} New GameObjectTracker instance
     */
    gameObject(id: string, type?: number): GameObjectTracker;
    /**
     * Creates a completable tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Completable type
     * @returns {CompletableTracker} New CompletableTracker instance
     */
    completable(id: string, type?: number): CompletableTracker;
    /**
     * Creates an alternative tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Alternative type
     * @returns {AlternativeTracker} New AlternativeTracker instance
     */
    alternative(id: string, type?: number): AlternativeTracker;
}
/**
 * Scorm Tracker
 */
declare class ScormTracker {
    /**
     * Constructor of Scorm tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Scorm object
     * @param {number} type the type of the Scorm object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    scormId: string;
    /**
     * the type of the Scorm object
     * @type {number}
     */
    type: number;
    /**
     * the tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    /**
     * the id of the Scorm object
     * @type {string}
     */
    accessibleId: string;
    /**
     * the list of types possible for the Scorm object
     * @type {Array}
     */
    ScormType: any[];
    /**
     * is initialized
     * @type {boolean}
     */
    initialized: boolean;
    /**
     * Initialized Time
     * @type {Date}
     */
    initializedTime: Date;
    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    Initialized(): StatementBuilder;
    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    Suspended(): StatementBuilder;
    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    Resumed(): StatementBuilder;
    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    Terminated(): StatementBuilder;
    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    Passed(): StatementBuilder;
    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    Failed(): StatementBuilder;
    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    Scored(score: number): StatementBuilder;
    /**
     * Send Completed statement
     * @param {boolean} success the success status of the Scorm object
     * @param {boolean} completion the completion status of the Scorm object
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    Completed(success: boolean, completion: boolean, score: number): StatementBuilder;
}
/**
 * XAPI Tracker Asset Class
 * Handles xAPI tracking with batch processing, retry logic, and backup capabilities
 */
declare class xAPITrackerAsset {
    /**
     * Creates an instance of xAPITrackerAsset
     * @param {object} opts options for the xapi Tracker asset
     * @param {string} opts.endpoint - Primary xAPI endpoint URL (required)
     * @param {string} opts.actor_homePage - Home page URL of the actor (required)
     * @param {string} opts.actor_name - Name of the actor (required)
     * @param {string} opts.default_uri - Default URI for statements (required)
     *
     * @param {string} [opts.backup_endpoint=null] - Backup endpoint URL (optional)
     * @param {string} [opts.backup_type='XAPI'] - Type of backup (XAPI or CSV) (optional)
     * @param {string} [opts.auth_token=null] - Authentication token (optional)
     * @param {boolean} [opts.debug=false] - Debug mode flag (optional)
     * @param {number} [opts.batchLength=null] - Number of statements per batch (optional)
     * @param {number} [opts.batchTimeout=null] - Timeout between batches (optional)
     * @param {number} [opts.maxRetryDelay=null] - Maximum retry delay (optional)
     */
    constructor({ endpoint, actor_homePage, actor_name, default_uri, backup_endpoint, backup_type, auth_token, debug, batchLength, batchTimeout, maxRetryDelay }: {
        endpoint: string;
        actor_homePage: string;
        actor_name: string;
        default_uri: string;
        backup_endpoint?: string;
        backup_type?: string;
        auth_token?: string;
        debug?: boolean;
        batchLength?: number;
        batchTimeout?: number;
        maxRetryDelay?: number;
    });
    /**
     * XAPI Tracker instance
     * @type {XAPI|null}
     */
    xapi: XAPI | null;
    /**
     * Primary xAPI endpoint URL
     * @type {string}
     */
    endpoint: string;
    /**
     * Authentication token for xAPI requests
     * @type {string|null}
     */
    auth_token: string | null;
    /**
     * Current online status
     * @type {boolean}
     */
    online: boolean;
    /**
     * Queue of statements to be sent
     * @type {Array<Statement>}
     */
    statementsToSend: Array<Statement>;
    /**
     * Flag indicating if sending is currently in progress
     * @type {boolean}
     */
    sendingInProgress: boolean;
    /**
     * Current offset in the statements queue
     * @type {number}
     */
    offset: number;
    /**
     * Whether backup is enabled
     * @type {boolean}
     */
    backup: boolean;
    /**
     * Backup endpoint URL
     * @type {string|null}
     */
    backup_endpoint: string | null;
    /**
     * Backup type (XAPI or CSV)
     * @type {string|null}
     */
    backup_type: string | null;
    /**
     * Additional parameters for backup requests
     * @type {Object|null}
     */
    backupRequestParameters: any | null;
    /**
     * Actor statement object
     * @type {ActorStatement}
     */
    actor: ActorStatement;
    /**
     * Actor's homepage URL
     * @type {string}
     */
    actor_homePage: string;
    /**
     * Actor's name
     * @type {string}
     */
    actor_name: string;
    /**
     * Context statement object
     * @type {ContextStatement}
     */
    context: ContextStatement;
    /**
     * Default URI for statements
     * @type {string}
     */
    default_uri: string;
    /**
     * Debug mode flag
     * @type {boolean}
     */
    debug: boolean;
    /**
     * Number of statements to send in each batch
     * @type {number}
     */
    batchlength: number;
    /**
     * Timeout between batch sends in milliseconds
     * @type {number}
     */
    batchtimeout: number;
    /**
     * Current retry delay in milliseconds
     * @type {number|null}
     */
    retryDelay: number | null;
    /**
     * Maximum retry delay in milliseconds
     * @type {number}
     */
    maxRetryDelay: number;
    /**
     * Timer reference for batch processing
     * @type {NodeJS.Timeout|null}
     */
    timer: NodeJS.Timeout | null;
    /**
     * Logs out the current session by clearing the authentication token
     */
    logout(): void;
    /**
     * Event handler called when the client goes offline
     */
    onOffline(): void;
    /**
     * Event handler called when the client comes online
     * @returns {Promise<void>}
     */
    onOnline(): Promise<void>;
    /**
     * Updates the authentication configuration
     */
    updateAuth(): void;
    /**
     * Sends a batch of statements to the xAPI endpoint
     * @returns {Promise<void>}
     */
    sendBatch(): Promise<void>;
    /**
     * Refreshes the authentication token
     * @returns {Promise<void>}
     */
    refreshAuth(): Promise<void>;
    /**
     * Starts the timer for batch processing
     */
    startTimer(): void;
    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    Trace(verbId: string, objectType: string, objectId: string): StatementBuilder;
    /**
     * Sends statements to the backup endpoint
     * @returns {Promise<void>}
     */
    sendBackup(): Promise<void>;
    /**
     * Adds a statement to the queue and starts processing if needed
     * @param {Statement} statement - The statement to enqueue
     * @returns {Promise<void>}
     */
    enqueue(statement: Statement): Promise<void>;
    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Options object
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    flush({ withBackup }?: {
        withBackup?: boolean;
    }): Promise<void>;
}
/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
declare class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    /**
     * Creates an instance of xAPITrackerAssetOAuth1.
     * @param {object} opts options for the xapi Tracker asset
     * @param {string} opts.endpoint - Primary API endpoint (required)
     * @param {string} opts.actor_homePage - Home page URL of the actor (required)
     * @param {string} opts.actor_name - Name of the actor (required)
     * @param {string} opts.username - Username for authentication (required)
     * @param {string} opts.password - Password for authentication (required)
     * @param {string} opts.default_uri - Default URI for requests (required)
     *
     * @param {string} [opts.backup_endpoint=null] - Backup API endpoint (optional)
     * @param {string} [opts.backup_type='XAPI'] - Type of backup endpoint (optional)
     * @param {boolean} [opts.debug=false] - Debug mode flag (optional)
     * @param {number} [opts.batchLength=null] - Batch length for requests (optional)
     * @param {number} [opts.batchTimeout=null] - Batch timeout in milliseconds (optional)
     * @param {number} [opts.maxRetryDelay=null] - Maximum retry delay in milliseconds (optional)
     */
    constructor({ endpoint, actor_homePage, actor_name, default_uri, username, password, backup_endpoint, backup_type, debug, batchLength, batchTimeout, maxRetryDelay }: {
        endpoint: string;
        actor_homePage: string;
        actor_name: string;
        username: string;
        password: string;
        default_uri: string;
        backup_endpoint?: string;
        backup_type?: string;
        debug?: boolean;
        batchLength?: number;
        batchTimeout?: number;
        maxRetryDelay?: number;
    });
}
/**
 * A specialized tracker asset that implements OAuth2 authentication.
 * Extends the base xAPITrackerAsset with OAuth2 capabilities.
 */
declare class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    /**
     * Creates an instance of xAPITrackerAssetOAuth2.
     * @param {object} opts options for the xapi Tracker asset
     * @param {string} opts.endpoint - Primary API endpoint (required)
     * @param {string} opts.actor_homePage - Home page URL of the actor (required)
     * @param {string} opts.actor_name - Name of the actor (required)
     * @param {Object} opts.config - OAuth2 configuration (required)
     * @param {string} opts.default_uri - Default URI for requests (required)
     *
     * @param {string} [opts.backup_endpoint=null] - Backup API endpoint (optional)
     * @param {string} [opts.backup_type='XAPI'] - Type of backup endpoint (optional)
     * @param {boolean} [opts.debug=false] - Debug mode flag (optional)
     * @param {number} [opts.batchLength=null] - Batch length for requests (optional)
     * @param {number} [opts.batchTimeout=null] - Batch timeout in milliseconds (optional)
     * @param {number} [opts.maxRetryDelay=null] - Maximum retry delay in milliseconds (optional)
     */
    constructor({ endpoint, actor_homePage, actor_name, config, default_uri, backup_endpoint, backup_type, debug, batchLength, batchTimeout, maxRetryDelay }: {
        endpoint: string;
        actor_homePage: string;
        actor_name: string;
        config: any;
        default_uri: string;
        backup_endpoint?: string;
        backup_type?: string;
        debug?: boolean;
        batchLength?: number;
        batchTimeout?: number;
        maxRetryDelay?: number;
    });
    /**
     * Configuration object for OAuth2 authentication
     * @type {Object}
     */
    oauth2Config: any;
    /**
     * Instance of OAuth2Protocol handling authentication
     * @type {OAuth2Protocol|null}
     */
    oauth2: OAuth2Protocol | null;
    /**
     * Retrieves an OAuth2 access token.
     *
     * @returns {Promise<string|null>} The access token or null if failed
     */
    getToken(): Promise<string | null>;
    /**
     * Initializes authentication by obtaining and setting the OAuth2 token.
     *
     * @returns {Promise<void>}
     */
    initAuth(): Promise<void>;
    /**
     * Logs out the current session by invalidating the token.
     *
     * @returns {Promise<void>}
     */
    logout(): Promise<void>;
}
/**
 * Statement Builder Class
 */
declare class StatementBuilder {
    /**
     * @param  {xAPITrackerAsset} xapiClient  any client that has a `.sendStatement(statement)` → Promise
     * @param  {Statement} initial     a partial Statement (actor, verb, object…)
     */
    constructor(xapiClient: xAPITrackerAsset, initial: Statement);
    /**
     * XAPI Client
     * @type {xAPITrackerAsset}
     */
    client: xAPITrackerAsset;
    /**
     * Statement
     * @type {Statement}
     */
    statement: Statement;
    /**
     * Promise
     * @type {Promise<void>}
     */
    _promise: Promise<void>;
    /**
     * Set success to statemement
     * @param {boolean} success
     * @returns {this} Returns the current instance for chaining
     */
    withSuccess(success: boolean): this;
    /**
     * Sets score-related properties
     * @param {Partial<{raw: number; min: number; max: number; scaled: number}>} score - Score configuration
     * @returns {this} Returns the current instance for chaining
     */
    withScore(score: Partial<{
        raw: number;
        min: number;
        max: number;
        scaled: number;
    }>): this;
    /**
     * Set raw score to statemement
     * @param {number} raw the raw score value
     * @returns {this} Returns the current instance for chaining
     */
    withScoreRaw(raw: number): this;
    /**
     * Set min score to statemement
     * @param {number} min the min score value
     * @returns {this} Returns the current instance for chaining
     */
    withScoreMin(min: number): this;
    /**
     * Set max score to statemement
     * @param {number} max the max score value
     * @returns {this} Returns the current instance for chaining
     */
    withScoreMax(max: number): this;
    /**
     * Set scaled score to statemement
     * @param {number} scaled the scaled score value
     * @returns {this} Returns the current instance for chaining
     */
    withScoreScaled(scaled: number): this;
    /**
     * Set completion status to statement
     * @param {boolean} value completion status of statement
     * @returns {this} Returns the current instance for chaining
     */
    withCompletion(value: boolean): this;
    /**
     * Set duration to statement
     * @param {Date} init init date of statement
     * @param {Date} end end date of statement
     * @returns {this} Returns the current instance for chaining
     */
    withDuration(init: Date, end: Date): this;
    /**
     * Set response to statement
     * @param {string} value response of statement
     * @returns {this} Returns the current instance for chaining
     */
    withResponse(value: string): this;
    /**
     * Set progress to statement
     * @param {number} value progress of statement
     * @returns {this} Returns the current instance for chaining
     */
    withProgress(value: number): this;
    /**
     * Add result extension to statement
     * @param {string} key key of the result extension
     * @param {*} value value of the result extension
     * @returns {this} Returns the current instance for chaining
     */
    withResultExtension(key: string, value: any): this;
    /**
       * Set result extensions as Object key/values list of the statement
       * @param {Object} extensions extensions list
       */
    withResultExtensions(extensions?: any): this;
    /**
     * let me run any function on the statement
     * fn can either mutate `stmt` in‐place, or return a brand new statement
     * Applies a function to the statement
     * @param {(statement: Statement) => Statement} fn - Function to apply to statement
     * @returns {this} Returns the current instance for chaining
     */
    apply(fn: (statement: Statement) => Statement): this;
    /**
     *
     * @param {*} onFulfilled
     * @param {*} onRejected
     * @returns {Promise<void>}
     */
    then(onFulfilled: any, onRejected: any): Promise<void>;
    /**
     *
     * @param {*} onRejected
     * @returns {Promise<void>}
     */
    catch(onRejected: any): Promise<void>;
    /**
     *
     * @param {*} onFinally
     * @returns {Promise<void>}
     */
    finally(onFinally: any): Promise<void>;
}
/**
 * Accessible Tracker
 */
declare class AccessibleTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {number} type the type of the accessible object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the accessible object
     * @type {string}
     */
    accessibleId: string;
    /**
     * the type of the accessible object
     * @type {number}
     */
    type: number;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    /**
     * the list of types possible for the accessible object
     * @type {Array}
     */
    AccessibleType: any[];
    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    Accessed(): StatementBuilder;
    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    Skipped(): StatementBuilder;
}
/**
 * Game Object Tracker
 */
declare class GameObjectTracker {
    /**
     * Constructor of Game Object tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Game Object object
     * @param {number} type the type of the Game Object object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the Game Object object
     * @type {string}
     */
    gameobjectId: string;
    /**
     * the type of the Game Object object
     * @type {number}
     */
    type: number;
    /**
     * the tracker of the Game Object object
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    /**
     * the list of types possible for the Game Object object
     * @type {Array}
     */
    GameObjectType: any[];
    /**
     * Send Interacted statement
     * @returns {StatementBuilder}
     */
    Interacted(): StatementBuilder;
    /**
     * Send Used statement
     * @returns {StatementBuilder}
     */
    Used(): StatementBuilder;
}
/**
 * Completable Tracker
 */
declare class CompletableTracker {
    /**
     * Constructor of completable tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the completable object
     * @param {number} type the type of the completable object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the completable object
     * @type {string}
     */
    completableId: string;
    /**
     * the type of the completable object
     * @type {number}
     */
    type: number;
    /**
     * the tracker of the completable object
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    /**
     * the list of types possible for the completable object
     * @type {Array}
     */
    CompletableType: any[];
    /**
     * is initialized
     * @type {boolean}
     */
    initialized: boolean;
    /**
     * Initialized Time
     * @type {Date}
     */
    initializedTime: Date;
    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    Initialized(): StatementBuilder;
    /**
     * Send Progressed statement
     * @param {number} progress the progress of the completable object
     * @returns {StatementBuilder}
     */
    Progressed(progress: number): StatementBuilder;
    /**
     * Send Completed statement
     * @param {boolean} success the success status of the completable object
     * @param {boolean} completion the completion status of the completable object
     * @param {number} score the score of the completable object
     * @returns {StatementBuilder}
     */
    Completed(success: boolean, completion: boolean, score: number): StatementBuilder;
}
/**
 * Accessible Tracker
 */
declare class AlternativeTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {number} type the type of the accessible object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the alternative object
     * @type {string}
     */
    alternativeId: string;
    /**
     * the type of the alternative object
     * @type {number}
     */
    type: number;
    /**
     * the tracker of the alternative object
     * @type {xAPITrackerAsset}
     */
    tracker: xAPITrackerAsset;
    /**
     * the list of types possible for the alternative object
     * @type {Array}
     */
    AlternativeType: any[];
    /**
     * Send selected statement
     * @param {string} optionId the optionId of the selected statement
     * @returns {StatementBuilder}
     */
    Selected(optionId: string): StatementBuilder;
    /**
     * Send unlocked statement
     * @param {string} optionId the optionId of the Unlocked statement
     * @returns {StatementBuilder}
     */
    Unlocked(optionId: string): StatementBuilder;
}
import XAPI from '@xapi/xapi';
/**
* Statement class
*/
declare class Statement {
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {string} verbId verb id of the statement
     * @param {string} objectId object id of the statement
     * @param {string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor: ActorStatement, verbId: string, objectId: string, objectType: string, context: ContextStatement, defaultURI: string);
    /**
     * Id of the statement
     * @type {string}
     */
    id: string;
    /**
     * Actor of the statement
     * @type {ActorStatement}
     */
    actor: ActorStatement;
    /**
     * Verb of the statement
     * @type {VerbStatement}
     */
    verb: VerbStatement;
    /**
     * default URI of the statement
     * @type {string}
     */
    defaultURI: string;
    /**
     * Object of the statement
     * @type {ObjectStatement}
     */
    object: ObjectStatement;
    /**
     * Timestamp of the statement
     * @type {Date}
     */
    timestamp: Date;
    /**
     * Context of the statement
     * @type {ContextStatement}
     */
    context: ContextStatement;
    /**
     * Version of the statement
     * @type {string}
     */
    version: string;
    /**
     * Result of the statement
     * @type {ResultStatement}
     */
    result: ResultStatement;
    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns {String}
     */
    setAsUri(id: string): string;
    /**
     * Check if the string is an URI
     * @param {string} id
     * @returns {boolean}
     */
    isUri(id: string): boolean;
    /**
     * Set the score of the statement
     * @param {number} raw the raw score
     * @param {number} min the min score
     * @param {number} max the max score
     * @param {number} scaled the scaled score
     */
    setScore(raw: number, min: number, max: number, scaled: number): void;
    /**
     * Set the raw score of the statement
     * @param {number} raw the raw score
     */
    setScoreRaw(raw: number): void;
    /**
     * Set the min score of the statement
     * @param {number} min the min score
     */
    setScoreMin(min: number): void;
    /**
     * Set the max score of the statement
     * @param {number} max the max score
     */
    setScoreMax(max: number): void;
    /**
     * Set the scaled score of the statement
     * @param {number} scaled the scaled score
     */
    setScoreScaled(scaled: number): void;
    /**
     * Set completion status of the statement
     * @param {boolean} value the completion status
     */
    setCompletion(value: boolean): void;
    /**
     * Set success status of the statement
     * @param {boolean} value the success status
     */
    setSuccess(value: boolean): void;
    /**
     * Set duration of the statement
     * @param {Date} init init date of statement
     * @param {Date} end end date of statement
     */
    setDuration(init: Date, end: Date): void;
    /**
     * Set response of the statement
     * @param {string} value the response
     */
    setResponse(value: string): void;
    /**
     * Set progress status of the statement
     * @param {number} value the progress status
     */
    setProgress(value: number): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {string} value the value of the extension
     */
    setVar(key: string, value: string): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    addResultExtension(key: string, value: any): void;
    /**
     * Set result extension as Object key/values of the statement
     * @param {Object} extensions extensions list
     */
    addResultExtensions(extensions: any): void;
    /**
     * Convert to xAPI format
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * Convert to CSV format
     *
     * @returns {String}
     */
    toCSV(): string;
}
/**
 * Actor Class of a Statement
 */
declare class ActorStatement {
    /**
     * Actor constructor
     * @param {string} accountName account name
     * @param {string} homepage account homepage
     */
    constructor(accountName: string, homepage: string);
    /**
     * Account name
     * @type {string}
     */
    accountName: string;
    /**
     * Account homePage
     * @type {string}
     */
    homepage: string;
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
/**
 * The Context Class of a Statement
 */
declare class ContextStatement {
    /**
     * Constructor of the ContextStatement class
     *
     * @param {*} categoryId category Id of context
     * @param {*} registrationId registration id of context
     */
    constructor(categoryId?: any, registrationId?: any);
    /**
     * Registration Id of the Context
     *
     * @type {string}
     */
    registration: string;
    categoryId: any;
    category: any;
    /**
     * The category IDs list
     */
    categoryIDs: {
        seriousgame: string;
        scorm: string;
    };
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
/**
 * A class that implements OAuth 2.0 protocol for authentication and token management.
 * Supports various grant types including password and refresh_token flows.
 */
declare class OAuth2Protocol {
    /**
     * Error message template for missing required fields.
     * @type {string}
     */
    fieldMissingMessage: string;
    /**
     * Error message template for unsupported grant types.
     * @type {string}
     */
    unsupportedGrantTypeMessage: string;
    /**
     * Error message template for unsupported PKCE methods.
     * @type {string}
     */
    unsupportedCodeChallengeMethodMessage: string;
    /**
     * The authorization endpoint URL.
     * @type {string|null}
     */
    authEndpoint: string | null;
    /**
     * The token endpoint URL.
     * @type {string|null}
     */
    tokenEndpoint: string | null;
    /**
     * The OAuth2 grant type being used.
     * @type {string|null}
     */
    grantType: string | null;
    /**
     * The username for authentication.
     * @type {string|null}
     */
    username: string | null;
    /**
     * The password for authentication.
     * @type {string|null}
     */
    password: string | null;
    /**
     * The client identifier.
     * @type {string|null}
     */
    clientId: string | null;
    /**
     * The requested scope of access.
     * @type {string|null}
     */
    scope: string | null;
    /**
     * The state parameter for CSRF protection.
     * @type {string|null}
     */
    state: string | null;
    /**
     * The login hint for authentication.
     * @type {string|null}
     */
    login_hint: string | null;
    /**
     * The PKCE code challenge method.
     * @type {string|null}
     */
    codeChallengeMethod: string | null;
    /**
     * The current authentication token.
     * @type {Object|null}
     */
    token: any | null;
    /**
     * Flag indicating if a token refresh is currently in progress.
     * @type {boolean}
     */
    tokenRefreshInProgress: boolean;
    /**
     * Callback function for token updates.
     * @type {Function|null}
     */
    onAuthorizationInfoUpdate: Function | null;
    /**
     * Initializes the OAuth2 protocol with the provided configuration.
     *
     * @param {Object} config - Configuration object containing OAuth2 parameters
     * @param {string} config.token_endpoint - The token endpoint URL
     * @param {string} config.grant_type - The grant type (password, refresh_token, etc.)
     * @param {string} config.client_id - The client ID
     * @param {string} [config.scope] - Optional scope
     * @param {string} [config.state] - Optional state
     * @param {string} [config.code_challenge_method] - Optional PKCE code challenge method
     * @param {string} [config.username] - Username for password grant type
     * @param {string} [config.password] - Password for password grant type
     * @param {string} [config.refresh_token] - Refresh token for refresh_token grant type
     * @param {string} [config.login_hint] - Login hint for password grant type
     * @returns {Promise<void>}
     * @throws {Error} If required configuration values are missing or grant type is unsupported
     */
    init(config: {
        token_endpoint: string;
        grant_type: string;
        client_id: string;
        scope?: string;
        state?: string;
        code_challenge_method?: string;
        username?: string;
        password?: string;
        refresh_token?: string;
        login_hint?: string;
    }): Promise<void>;
    /**
     * Retrieves a required value from the configuration object.
     *
     * @param {Object} config - The configuration object
     * @param {string} key - The key of the required value
     * @returns {*} The value associated with the key
     * @throws {Error} If the required value is missing
     */
    getRequiredValue(config: any, key: string): any;
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
    doResourceOwnedPasswordCredentialsFlow(tokenUrl: string, clientId: string, username: string, password: string, login_hint: string, scope?: string, state?: string): Promise<any>;
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
    doTokenRequest(tokenUrl: string, clientId: string, grantType: string, otherParams: any): Promise<any>;
    /**
     * Performs a refresh token request.
     *
     * @param {string} tokenUrl - The token endpoint URL
     * @param {string} clientId - The client ID
     * @param {string} refreshToken - The refresh token
     * @returns {Promise<Object>} The new token response
     */
    doRefreshToken(tokenUrl: string, clientId: string, refreshToken: string): Promise<any>;
    /**
     * Refreshes the current access token using the refresh token.
     *
     * @returns {Promise<string>} The new access token
     */
    refreshToken(): Promise<string>;
    /**
     * Checks if the current token has expired.
     *
     * @returns {boolean} True if the token has expired, false otherwise
     */
    hasTokenExpired(): boolean;
    /**
     * Updates the request with the current authorization token.
     * Refreshes the token if it has expired.
     *
     * @param {Object} request - The request object to update
     * @returns {Promise<void>}
     */
    updateParamsForAuth(request: any): Promise<void>;
    /**
     * Registers a callback function to be called when authorization information is updated.
     *
     * @param {Function} callback - The callback function to register
     */
    registerAuthInfoUpdate(callback: Function): void;
    /**
     * Logs out the current session by invalidating the refresh token.
     *
     * @returns {Promise<void>}
     * @throws {Error} If the logout request fails
     */
    logout(): Promise<void>;
}
/**
 * The Verb Class  of a Statement
 */
declare class VerbStatement {
    /**
     * Constructor of VerbStatement class
     *
     * @param {string} verbDisplay The verb display id of the statement
     */
    constructor(verbDisplay: string);
    /**
     * The Verb Id
     * @type {string}
     */
    verbId: string;
    /**
     * The Verb display
     * @type {string}
     */
    verbDisplay: string;
    /**
     * The Verb Ids array
     */
    verbIds: {
        initialized: string;
        progressed: string;
        completed: string;
        accessed: string;
        skipped: string;
        selected: string;
        unlocked: string;
        interacted: string;
        used: string;
        responded: string;
        resumed: string;
        suspended: string;
        terminated: string;
        passed: string;
        failed: string;
        scored: string;
    };
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
/**
 * The Object Class of a Statement
 */
declare class ObjectStatement {
    /**
     * The constructor of the ObjectStatement class
     *
     * @param {string} id the id of the object
     * @param {string} type the type of the object
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id: string, type: string, name?: string, description?: string);
    /**
     * The ID of the Object
     *
     * @type {string}
     */
    id: string;
    /**
     * The type of the Object
     *
     * @type {string}
     */
    type: string;
    /**
     * The name of the Object
     *
     * @type {string}
     */
    name: string;
    /**
     * The description of the Object
     *
     * @type {string}
     */
    description: string;
    /**
     * The Type IDs list for Objects
     */
    typeIds: {
        game: string;
        session: string;
        level: string;
        quest: string;
        stage: string;
        combat: string;
        storynode: string;
        race: string;
        completable: string;
        screen: string;
        area: string;
        zone: string;
        cutscene: string;
        accessible: string;
        question: string;
        menu: string;
        dialog: string;
        path: string;
        arena: string;
        alternative: string;
        enemy: string;
        npc: string;
        item: string;
        gameobject: string;
        course: string;
        module: string;
        SCO: string;
        assessment: string;
        interaction: string;
        cmi_interaction: string;
        objective: string;
        attempt: string;
        profile: string;
    };
    /**
     * The Extensions IDs for Objects
     */
    ExtensionIDs: {
        extended_interaction_type: string;
    };
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
/**
 * The Result Class of a Statement
 */
declare class ResultStatement {
    /**
     * Constructor of the ResultStatement class
     *
     * @param {string} defautURI The default URI for the extensions
     */
    constructor(defautURI: string);
    /**
     * The ID of the Result
     *
     * @type {string}
     */
    defautURI: string;
    /**
     * The Score of the Result
     *
     * @type {Object}
     */
    Score: any;
    /**
     * The success status of the Result
     *
     * @type {boolean}
     */
    Success: boolean;
    /**
     * The Completion status of the Result
     *
     * @type {boolean}
     */
    Completion: boolean;
    /**
     * The response of the Result
     *
     * @type {string}
     */
    Response: string;
    /**
     * The duration of the Result
     *
     * @type {string}
     */
    Duration: string;
    /**
     * The Extensions of the Result
     *
     * @type {Object}
     */
    Extensions: any;
    /**
     * Check if the result is empty or not
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * The possible extensions of a result statement
     */
    ExtensionIDs: {
        health: string;
        position: string;
        progress: string;
        interactionID: string;
        response_explanation: string;
        response_type: string;
    };
    /**
     * The Score Keys for the result
     */
    ScoreKey: string[];
    /**
     * Set extensions from list
     * @param {Object} extensions extension list
     */
    setExtensions(extensions: any): void;
    /**
     * Set result extension for key value
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    setExtension(key: string, value: any): void;
    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns {String}
     */
    setAsUri(id: string): string;
    /**
     * Check if the string is an URI
     * @param {string} id
     * @returns {boolean}
     */
    isUri(id: string): boolean;
    /**
     * Set the score of the statement
     * @param {string} key the key for the score
     * @param {number} value the score
     */
    setScoreValue(key: string, value: number): void;
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
export {};
