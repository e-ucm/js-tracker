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
     * @property {string|null} parent_activity_id
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
        parent_activity_id: any;
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
}
/**
 * SCORM-specific tracker extending JSTracker
 */
export class JSScormTracker extends JSTracker {
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
    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId: string, objectType: string, objectId: string): StatementBuilder;
}
/**
 * SCORM-specific tracker extending JSTracker
 */
export class MyTracker extends JSTracker {
    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId: string, objectType: string, objectId: string): StatementBuilder;
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
    trace(verbId: string, objectType: string, objectId: string, context?: import("./HighLevel/Statement/ContextStatement.js").default): StatementBuilder;
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
import xAPITrackerAssetOAuth2 from './Auth/OAuth2.js';
import xAPITrackerAssetOAuth1 from './Auth/OAuth1.js';
import xAPITrackerAsset from './xAPITrackerAsset.js';
import { ScormTracker } from './HighLevel/SCORM.js';
import StatementBuilder from './HighLevel/StatementBuilder.js';
import { AccessibleTracker } from './HighLevel/Accessible.js';
import { GameObjectTracker } from './HighLevel/GameObject.js';
import { CompletableTracker } from './HighLevel/Completable.js';
import { AlternativeTracker } from './HighLevel/Alternative.js';
