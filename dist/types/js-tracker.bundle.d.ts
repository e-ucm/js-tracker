export type StatementBuilder = any;
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
}
/**
 * Serious Game Tracker extending JSTracker with game-specific functionality
 */
export class SeriousGameTracker extends JSTracker {
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
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId: string, objectType: string, objectId: string): StatementBuilder;
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
     * Constructor of Scorm Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the Scorm object
     * @param {number} type the type of the Scorm object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the Scorm object
     * @type {string}
     */
    ScormId: string;
    /**
     * the type of the Scorm object
     * @type {number}
     */
    Type: number;
    /**
     * the Tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * is initialized
     * @type {boolean}
     */
    IsInitialized: boolean;
    /**
     * the list of types possible for the Scorm object
     * @type {Array}
     */
    ScormType: any[];
    /**
     * Initialized Time
     * @type {Date}
     */
    InitializedTime: Date;
    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized(): StatementBuilder;
    /**
     * Send Suspended statement
     * @returns {StatementBuilder}
     */
    suspended(): StatementBuilder;
    /**
     * Send Resumed statement
     * @returns {StatementBuilder}
     */
    resumed(): StatementBuilder;
    /**
     * Send Terminated statement
     * @returns {StatementBuilder}
     */
    terminated(): StatementBuilder;
    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    passed(): StatementBuilder;
    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    failed(): StatementBuilder;
    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    scored(score: number): StatementBuilder;
    /**
     * Send Completed statement
     * @param {boolean} success the success status of the Scorm object
     * @param {boolean} completion the completion status of the Scorm object
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    completed(success: boolean, completion: boolean, score: number): StatementBuilder;
}
/**
 * A specialized tracker asset that implements OAuth2 authentication.
 * Extends the base xAPITrackerAsset with OAuth2 capabilities.
 */
declare class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
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
    oauth2Settings: {
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
     * Instance of OAuth2Protocol handling authentication
     * @type {OAuth2Protocol|null}
     */
    oauth2: OAuth2Protocol | null;
    /**
     * Logs out the current session by invalidating the token.
     *
     * @returns {Promise<void>}
     */
    logout(): Promise<void>;
    #private;
}
/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
declare class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    /**
    * @typedef {Object} oauth1Settings
    * @property {string} username
    * @property {string} password
    */
    oauth1Settings: {
        username: string;
        password: string;
    };
}
/**
 * @typedef {import('./HighLevel/StatementBuilder.js').StatementBuilder} StatementBuilder
 */
/**
 * XAPI Tracker Asset Class
 * Handles xAPI tracking with batch processing, retry logic, and backup capabilities
 */
declare class xAPITrackerAsset {
    /**
     * XAPI Tracker instance
     * @type {XAPI|null}
     */
    xapi: XAPI | null;
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
     */
    settings: {
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
    };
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
     * Current connected status
     * @type {boolean}
     */
    connected: boolean;
    /**
     * Current started status
     * @type {boolean}
     */
    started: boolean;
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
     * Context statement object
     * @type {ContextStatement}
     */
    context: ContextStatement;
    /**
     * Current retry delay in milliseconds
     * @type {number|null}
     */
    retryDelay: number | null;
    /**
     * Timer reference for batch processing
     * @type {NodeJS.Timeout|null}
     */
    timer: NodeJS.Timeout | null;
    /**
     * Logs out the current session by clearing the authentication token
     */
    logout(): void;
    start(): void;
    stop(): void;
    /**
     * Updates the authentication configuration
     *
     */
    login(): Promise<void>;
    /**
     * Refreshes the authentication token
     * @returns {Promise<void>}
     */
    refreshAuth(): Promise<void>;
    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId: string, objectType: string, objectId: string): ms;
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
    #private;
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
    AccessibleId: string;
    /**
     * the type of the accessible object
     * @type {number}
     */
    Type: number;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * the list of types possible for the accessible object
     * @type {Array}
     */
    AccessibleType: any[];
    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    accessed(): StatementBuilder;
    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    skipped(): StatementBuilder;
}
/**
 * Game Object Tracker
 */
declare class GameObjectTracker {
    /**
     * Constructor of Game Object tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Game Object object
     * @param {number} type the Type of the Game Object object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the Game Object object
     * @Type {string}
     */
    GameobjectId: string;
    /**
     * the Type of the Game Object object
     * @Type {number}
     */
    Type: number;
    Tracker: xAPITrackerAsset;
    /**
     * the Trackerof the Game Object object
     * @Type {xAPITrackerAsset}
     */
    tracker: any;
    /**
     * the list of types possible for the Game Object object
     * @Type {Array}
     */
    GameObjectType: string[];
    /**
     * Send Interacted statement
     * @returns {StatementBuilder}
     */
    interacted(): StatementBuilder;
    /**
     * Send Used statement
     * @returns {StatementBuilder}
     */
    used(): StatementBuilder;
}
/**
 * Completable Tracker
 */
declare class CompletableTracker {
    /**
     * Constructor of completable Tracker
     * @param {xAPITrackerAsset} tracker the Tracker
     * @param {string} id the id of the completable object
     * @param {number} type the Type of the completable object
     */
    constructor(tracker: xAPITrackerAsset, id: string, type?: number);
    /**
     * the id of the completable object
     * @Type {string}
     */
    CompletableId: string;
    /**
     * the Type of the completable object
     * @Type {number}
     */
    Type: number;
    /**
     * the Tracker of the completable object
     * @Type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * is initialized
     * @Type {boolean}
     */
    IsInitialized: boolean;
    /**
     * the list of Types possible for the completable object
     * @Type {Array}
     */
    CompletableType: string[];
    /**
     * Initialized Time
     * @Type {Date}
     */
    InitializedTime: any;
    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    initialized(): StatementBuilder;
    initializedTime: Date;
    /**
     * Send Progressed statement
     * @param {number} progress the progress of the completable object
     * @returns {StatementBuilder}
     */
    progressed(progress: number): StatementBuilder;
    /**
     * Send Completed statement
     * @param {boolean} success the success status of the completable object
     * @param {boolean} completion the completion status of the completable object
     * @param {number} score the score of the completable object
     * @returns {StatementBuilder}
     */
    completed(success: boolean, completion: boolean, score: number): StatementBuilder;
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
    AlternativeId: string;
    /**
     * the type of the alternative object
     * @type {number}
     */
    Type: number;
    /**
     * the tracker of the alternative object
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
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
    selected(optionId: string): StatementBuilder;
    /**
     * Send unlocked statement
     * @param {string} optionId the optionId of the Unlocked statement
     * @returns {StatementBuilder}
     */
    unlocked(optionId: string): StatementBuilder;
}
/**
 * A class that implements OAuth 2.0 protocol for authentication and token management.
 * Supports various grant types including password and refresh_token flows.
 */
declare class OAuth2Protocol {
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
    constructor(config: {
        token_endpoint: string;
        grant_type: string;
        client_id: string;
        scope?: string;
        state?: string;
        code_challenge_method?: string;
        username?: string;
        password?: string;
        login_hint?: string;
    });
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
     * @typedef {Object|null} token
     * @property {string} access_token
     * @property {string} refresh_token
     */
    token: any;
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
  
     * @returns {Promise<void>}
     * @throws {Error} If required configuration values are missing or grant type is unsupported
     */
    getToken(): Promise<void>;
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
     * Logs out the current session by invalidating the refresh token.
     *
     * @returns {Promise<void>}
     * @throws {Error} If the logout request fails
     */
    logout(): Promise<void>;
    #private;
}
import XAPI from '@XAPI/XAPI';
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
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    addContextExtension(key: string, value: any): void;
    /**
     * Set result extension as Object key/values of the statement
     * @param {Object} extensions extensions list
     */
    addContextExtensions(extensions: any): void;
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
     * Extensions of the Context
     *
     * @type {Object}
     */
    extensions: any;
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
    setExtensions(ext: any): void;
    setExtension(key: any, value: any): void;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
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
