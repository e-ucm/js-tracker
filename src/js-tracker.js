import xAPITrackerAsset from './xAPITrackerAsset.js';
import xAPITrackerAssetOAuth1 from './Auth/OAuth1.js';
import xAPITrackerAssetOAuth2 from './Auth/OAuth2.js';
import { AccessibleTracker, ACCESSIBLETYPE } from './HighLevel/Accessible.js';
import { CompletableTracker, COMPLETABLETYPE } from './HighLevel/Completable.js';
import { AlternativeTracker, ALTERNATIVETYPE } from './HighLevel/Alternative.js';
import { GameObjectTracker, GAMEOBJECTTYPE } from './HighLevel/GameObject.js';
import { ScormTracker, SCORMTYPE } from './HighLevel/SCORM.js';
import { StatementBuilder } from './HighLevel/StatementBuilder.js';

/**
 * Main JavaScript Tracker class for xAPI tracking functionality
 */
export class JSTracker {
    /**
     * The underlying tracker instance
     * @type {xAPITrackerAsset|xAPITrackerAssetOAuth1|xAPITrackerAssetOAuth2}
     */
    tracker;

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
    constructor({
        result_uri = null,
        backup_uri = null,
        backup_type = null,
        actor_homePage = null,
        actor_name = null,
        auth_token = null,
        default_uri = null,
        debug = null
    } = {}) {
        this.tracker = new xAPITrackerAsset({
            endpoint:result_uri,
            backup_endpoint:backup_uri,
            backup_type:backup_type,
            actor_homePage:actor_homePage,
            actor_name:actor_name,
            auth_token:auth_token,
            default_uri:default_uri,
            debug:debug
        });
    }

    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Flush options
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    flush({ withBackup = false } = {}) {
        return this.tracker.flush({ withBackup: withBackup });
    }

    /**
     * Generates an xAPI tracker instance from URL parameters
     * @param {Object} [config] - Configuration options
     * @param {string} [config.default_uri] - Default URI for statements
     */
    generateXAPITrackerFromURLParams({ default_uri = null } = {}) {
        const xAPIConfig = {};
        const urlParams = new URLSearchParams(window.location.search);
        let result_uri, backup_uri, backup_type, actor_name, actor_homePage, strDebug, debug;
        let username, password, auth_token;
        let batchLength, batchTimeout, maxRetryDelay;

        if (urlParams.size > 0) {
            // RESULT URI
            result_uri = urlParams.get('result_uri');

            // BACKUP URI
            backup_uri = urlParams.get('backup_uri');
            backup_type = urlParams.get('backup_type');

            // ACTOR DATA
            actor_homePage = urlParams.get('actor_homePage');
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
            auth_token = urlParams.get('auth_token');

            // DEBUG
            strDebug = urlParams.get('debug');

            // BATCH
            batchLength = parseInt(urlParams.get('batch_length'));
            batchTimeout = parseInt(urlParams.get('batch_timeout'));
            maxRetryDelay = parseInt(urlParams.get('max_retry_delay'));

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
            this.tracker = new xAPITrackerAssetOAuth2({
                endpoint:result_uri,
                backup_endpoint:backup_uri,
                backup_type:backup_type,
                actor_homePage:actor_homePage,
                actor_name:actor_name,
                config:xAPIConfig,
                default_uri:default_uri,
                debug:debug,
                batchLength:batchLength,
                batchTimeout:batchTimeout,
                maxRetryDelay:maxRetryDelay
            });
        } else if (username && password) {
            this.tracker = new xAPITrackerAssetOAuth1({
                endpoint:result_uri,
                backup_endpoint:backup_uri,
                backup_type:backup_type,
                actor_homePage:actor_homePage,
                actor_name:actor_name,
                username:username,
                password:password,
                default_uri:default_uri,
                debug:debug,
                batchLength:batchLength,
                batchTimeout:batchTimeout,
                maxRetryDelay:maxRetryDelay
            });
        } else {
            this.tracker = new xAPITrackerAsset({
                endpoint:result_uri,
                backup_endpoint:backup_uri,
                backup_type:backup_type,
                actor_homePage:actor_homePage,
                actor_name:actor_name,
                auth_token:auth_token,
                default_uri:default_uri,
                debug:debug,
                batchLength:batchLength,
                batchTimeout:batchTimeout,
                maxRetryDelay:maxRetryDelay
            });
        }
    }
}

/**
 * SCORM-specific tracker extending JSTracker
 */
export class JSScormTracker extends JSTracker {
    /**
     * SCORM type constants
     * @type {Object}
     */
    SCORMTYPE = SCORMTYPE;
    
    /**
     * Creates a new SCORM tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - SCORM type
     * @returns {ScormTracker} New SCORM tracker instance
     */
    scorm(id, type=SCORMTYPE.SCO) {
        return new ScormTracker(this.tracker, id, type);
    }
}

/**
 * Serious Game Tracker extending JSTracker with game-specific functionality
 */
export class SeriousGameTracker extends JSTracker {
    /**
     * Accessible type constants
     * @type {Object}
     */
    ACCESSIBLETYPE = ACCESSIBLETYPE;

    /**
     * Completable type constants
     * @type {Object}
     */
    COMPLETABLETYPE = COMPLETABLETYPE;

    /**
     * Alternative type constants
     * @type {Object}
     */
    ALTERNATIVETYPE = ALTERNATIVETYPE;

    /**
     * Game object type constants
     * @type {Object}
     */
    GAMEOBJECTTYPE = GAMEOBJECTTYPE;

    /**
     * SCORM tracker instance
     * @type {ScormTracker}
     */
    scormTracker;

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
    constructor({
        result_uri = null,
        backup_uri = null,
        activityId = null,
        backup_type = null,
        actor_homePage = null,
        actor_name = null,
        auth_token = null,
        default_uri = null,
        debug = null
    } = {}) {
        super({
            result_uri: result_uri,
            backup_uri: backup_uri,
            backup_type: backup_type,
            actor_homePage: actor_homePage,
            actor_name: actor_name,
            auth_token: auth_token,
            default_uri: default_uri,
            debug: debug
        });
        this.scormTracker = new ScormTracker(this.tracker, activityId, SCORMTYPE.SCO);
    }

    /**
     * Marks the game as started
     * @returns {StatementBuilder} Promise that resolves when the start is recorded
     */
    start() {
        return this.scormTracker.Initialized();
    }

    /**
     * Marks the game as paused
     * @returns {StatementBuilder} Promise that resolves when the pause is recorded
     */
    pause() {
        return this.scormTracker.Suspended();
    }

    /**
     * Marks the game as resumed
     * @returns {StatementBuilder} Promise that resolves when the resume is recorded
     */
    resumed() {
        return this.scormTracker.Resumed();
    }

    /**
     * Marks the game as finished
     * @returns {StatementBuilder} Promise that resolves when the finish is recorded
     */
    finish() {
        return this.scormTracker.Terminated();
    }

    /**
     * Creates an accessible tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Accessible type
     * @returns {AccessibleTracker} New AccessibleTracker instance
     */
    accesible(id, type=ACCESSIBLETYPE.ACCESSIBLE) {
        return new AccessibleTracker(this.tracker, id, type);
    }

    /**
     * Creates a game object tracker instance
     * @param {string} id - Game object ID
     * @param {number} type - Game object type
     * @returns {GameObjectTracker} New GameObjectTracker instance
     */
    gameObject(id, type=GAMEOBJECTTYPE.GAMEOBJECT) {
        return new GameObjectTracker(this.tracker, id, type);
    }

    /**
     * Creates a completable tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Completable type
     * @returns {CompletableTracker} New CompletableTracker instance
     */
    completable(id, type=COMPLETABLETYPE.COMPLETABLE) {
        return new CompletableTracker(this.tracker, id, type);
    }

    /**
     * Creates an alternative tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Alternative type
     * @returns {AlternativeTracker} New AlternativeTracker instance
     */
    alternative(id, type=ALTERNATIVETYPE.ALTERNATIVE) {
        return new AlternativeTracker(this.tracker, id, type);
    }
}