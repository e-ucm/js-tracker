import xAPITrackerAsset from './xAPITrackerAsset.js';
import xAPITrackerAssetOAuth1 from './Auth/OAuth1.js';
import xAPITrackerAssetOAuth2 from './Auth/OAuth2.js';
import { AccessibleTracker } from './HighLevel/SeriousGames/Accessible.js';
import { CompletableTracker } from './HighLevel/Scorm/Completable.js';
import { AlternativeTracker } from './HighLevel/SeriousGames/Alternative.js';
import { GameObjectTracker } from './HighLevel/SeriousGames/GameObject.js';
import { ScormTracker } from './HighLevel/Scorm/SCORM.js';
import StatementBuilder from './HighLevel/StatementBuilder/StatementBuilder.js';
import * as ms from "ms";
import LRSStatementBuilder from './HighLevel/StatementBuilder/LRSStatementBuilder.js';
import { ALL } from './HighLevel/Statement/Ids/Profiles/Generated/All.js';
import { SERIOUSGAMESPROFILE } from './HighLevel/Statement/Ids/Profiles/Generated/SeriousGamesProfile.js';
import { SCORMPROFILE } from './HighLevel/Statement/Ids/Profiles/Generated/ScormProfile.js';
import { STATEMENT } from './HighLevel/Statement/Ids/Statements.js';
const msFn = ms.default || ms;

const TRACKER_CONFIG_MESSAGE_TYPE = 'js-tracker-config';
const TRACKER_READY_MESSAGE_TYPE = 'js-tracker-ready';
let trackerConfigMessageListenerInitialized = false;
let pendingTrackerConfigResolvers = [];
let latestTrackerConfigFromMessage = null;

function resolvePendingTrackerConfig(config) {
    if (pendingTrackerConfigResolvers.length === 0) {
        return;
    }

    const resolvers = pendingTrackerConfigResolvers.slice();
    pendingTrackerConfigResolvers = [];
    resolvers.forEach((resolver) => resolver(config));
}

function initTrackerConfigMessageListener() {
    if (trackerConfigMessageListenerInitialized || typeof window === 'undefined') {
        return;
    }

    trackerConfigMessageListenerInitialized = true;
    window.addEventListener('message', (event) => {
        if (!event || !event.data || event.data.type !== TRACKER_CONFIG_MESSAGE_TYPE) {
            return;
        }

        latestTrackerConfigFromMessage = event.data.payload || {};
        resolvePendingTrackerConfig(latestTrackerConfigFromMessage);
    });
}

function requestTrackerConfigFromParent() {
    if (typeof window === 'undefined' || !window.parent || window.parent === window) {
        return;
    }

    try {
        window.parent.postMessage({ type: TRACKER_READY_MESSAGE_TYPE }, '*');
    } catch (error) {
        console.warn('Could not request tracker config from parent window', error);
    }
}

function waitForTrackerConfigFromMessage(timeoutMs) {
    return new Promise((resolve) => {
        if (latestTrackerConfigFromMessage) {
            resolve(latestTrackerConfigFromMessage);
            return;
        }

        let timeoutId = null;
        const resolver = (config) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            resolve(config);
        };

        pendingTrackerConfigResolvers.push(resolver);
        requestTrackerConfigFromParent();

        timeoutId = setTimeout(() => {
            pendingTrackerConfigResolvers = pendingTrackerConfigResolvers.filter((fn) => fn !== resolver);
            resolve(null);
        }, timeoutMs);
    });
}

/**
 * Main JavaScript Tracker class for xAPI tracking functionality
 */
export class JSTracker {
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
        auth_token:null,
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
        initTrackerConfigMessageListener();
    }

    /**
     * 
     * @returns {Promise<void>} 
     */
    async login() {
        if(this.trackerSettings.generateSettingsFromURLParams) {
            const messageConfig = await waitForTrackerConfigFromMessage(1500);
            if (messageConfig) {
                this.generateXAPITrackerFromConfig(messageConfig);
            } else {
                this.generateXAPITrackerFromURLParams();
            }
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
        if (this.trackerSettings.auth_token) {
            this.tracker.auth_token = this.trackerSettings.auth_token;
        }
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
        this.trackerSettings.auth_token=null;
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
        const urlParams = new URLSearchParams(window.location.search);
        const config = {
            result_uri: urlParams.get('result_uri'),
            backup_uri: urlParams.get('backup_uri'),
            backup_type: urlParams.get('backup_type'),
            actor_homepage: urlParams.get('actor_homepage'),
            actor_user: urlParams.get('actor_user'),
            sso_token_endpoint: urlParams.get('sso_token_endpoint'),
            sso_client_id: urlParams.get('sso_client_id'),
            sso_login_hint: urlParams.get('sso_login_hint'),
            sso_grant_type: urlParams.get('sso_grant_type'),
            sso_scope: urlParams.get('sso_scope'),
            sso_username: urlParams.get('sso_username'),
            sso_password: urlParams.get('sso_password'),
            username: urlParams.get('username'),
            password: urlParams.get('password'),
            auth_token: urlParams.get('auth_token'),
            debug: urlParams.get('debug'),
            batch_length: urlParams.get('batch_length'),
            batch_timeout: urlParams.get('batch_timeout'),
            max_retry_delay: urlParams.get('max_retry_delay')
        };

        this.generateXAPITrackerFromConfig(config);
    }

    /**
     * Generates an xAPI tracker instance from a plain configuration object
     * @param {Object} config - Tracker configuration values
     */
    generateXAPITrackerFromConfig(config = {}) {
        const xAPIConfig = {};
        let result_uri, backup_uri, backup_type, actor_name, actor_homePage, strDebug, debug;
        let username, password, auth_token;
        let batchLength, batchTimeout, maxRetryDelay;

        if (Object.keys(config).length === 0) {
            result_uri = null;
            backup_type = "XAPI";
            actor_homePage = null;
            actor_name = null;
            debug = false;
        } else {
            result_uri = config.result_uri || null;
            backup_uri = config.backup_uri || null;
            backup_type = config.backup_type || 'XAPI';
            actor_homePage = config.actor_homepage || null;
            actor_name = config.actor_user || null;

            if (config.sso_token_endpoint) {
                xAPIConfig.token_endpoint = config.sso_token_endpoint;
            }
            if (config.sso_client_id) {
                xAPIConfig.client_id = config.sso_client_id;
            }
            if (config.sso_login_hint) {
                xAPIConfig.login_hint = config.sso_login_hint;
            }
            if (config.sso_grant_type) {
                xAPIConfig.grant_type = config.sso_grant_type;
            }
            if (config.sso_scope) {
                xAPIConfig.scope = config.sso_scope;
            }
            if (config.sso_username) {
                xAPIConfig.username = config.sso_username;
            }
            if (config.sso_password) {
                xAPIConfig.password = config.sso_password;
            } else if (config.sso_username) {
                xAPIConfig.password = config.sso_username;
            }

            username = config.username || null;
            password = config.password || null;

            auth_token = config.auth_token || null;
            if (auth_token) {
                xAPIConfig.auth_token = auth_token.startsWith('Bearer ')
                    ? auth_token
                    : `Bearer ${auth_token}`;
            }

            strDebug = config.debug;
            if (config.batch_length) {
                batchLength = parseInt(config.batch_length);
            }
            if (config.batch_timeout) {
                batchTimeout = msFn(config.batch_timeout);
            }
            if (config.max_retry_delay) {
                maxRetryDelay = msFn(config.max_retry_delay);
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
        }

        if (xAPIConfig.auth_token) {
            this.trackerSettings.oauth_type = "OAuth0";
            this.trackerSettings.auth_token = xAPIConfig.auth_token;
        } else if (xAPIConfig.token_endpoint) {
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
export class JSScormTracker extends JSTracker {
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
export class LRSTracker extends JSTracker {
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
export class SeriousGameTracker extends JSTracker {
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