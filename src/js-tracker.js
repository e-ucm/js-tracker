import xAPITrackerAsset from './xAPITrackerAsset.js';
import xAPITrackerAssetOAuth1 from './Auth/OAuth1.js';
import xAPITrackerAssetOAuth2 from './Auth/OAuth2.js';
import { AccessibleTracker, ACCESSIBLETYPE } from './HighLevel/Accessible.js';
import { CompletableTracker, COMPLETABLETYPE } from './HighLevel/Completable.js';
import { AlternativeTracker, ALTERNATIVETYPE } from './HighLevel/Alternative.js';
import { GameObjectTracker, GAMEOBJECTTYPE } from './HighLevel/GameObject.js';
import { ScormTracker, SCORMTYPE } from './HighLevel/SCORM.js';
import { StatementBuilder } from './HighLevel/StatementBuilder.js';
import ms from "ms";

/**
 * Main JavaScript Tracker class for xAPI tracking functionality
 */
export class JSTracker {
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
     */
    trackerSettings={
        generateSettingsFromURLParams:false,
        oauth_type:"OAuth0",
        batch_mode:true,
        batch_endpoint:"http://myurl.com/endpoint",
        batch_length:100,
        batch_timeout:ms("30sec"),
        actor_homePage:"http://myhomepage.com",
        actor_name:"my_default_actor",
        backup_mode:false,
        backup_endpoint:"http://myurl.com/backup-endpoint",
        backup_type:"XAPI",
        default_uri:"mydefaulturi",
        max_retry_delay:ms("2min"),
        debug:false
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
        let username, password, auth_token;
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
            auth_token = urlParams.get('auth_token');

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
                batchTimeout = ms(batch_timeout_param);
            }
            if(max_retry_delay_param) {
                maxRetryDelay = ms(max_retry_delay_param);
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
    }

    logout() {
        super.logout();
        this.scormInstances={};
    }

    /**
     * Creates a new SCORM tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - SCORM type
     * @returns {ScormTracker} New SCORM tracker instance
     */
    scorm(id, type=SCORMTYPE.SCO) {
        var scorm;
        if(!this.scormInstances[type]) {
            this.scormInstances[type]={};
        }
        if(!this.scormInstances[type][id]) {
            scorm =new ScormTracker(this.tracker, id, type);;
            this.scormInstances[type][id]=scorm;
        } else {
            scorm=this.scormInstances[type][id];
        }
        return scorm;
    }
}


/**
 * Serious Game Tracker extending JSTracker with game-specific functionality
 */
export class SeriousGameTracker extends JSTracker {
    /**
     * Accessible type constants
     */
    ACCESSIBLETYPE = ACCESSIBLETYPE;

    /**
     * Completable type constants
     */
    COMPLETABLETYPE = COMPLETABLETYPE;

    /**
     * Alternative type constants
     */
    ALTERNATIVETYPE = ALTERNATIVETYPE;

    /**
     * Game object type constants
     */
    GAMEOBJECTTYPE = GAMEOBJECTTYPE;

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
        this.trackerSettings.activityId="";
    }

    async login() {
        this.scormTracker = new ScormTracker(this.tracker, this.trackerSettings.activityId, SCORMTYPE.SCO);
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
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId, objectType, objectId) {
        return this.tracker.trace(verbId, objectType, objectId);
    }
    
    
    /**
     * Creates an accessible tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Accessible type
     * @returns {AccessibleTracker} New AccessibleTracker instance
     */
    accessible(id, type=ACCESSIBLETYPE.ACCESSIBLE) {
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

    /**
     * Creates a game object tracker instance
     * @param {string} id - Game object ID
     * @param {number} type - Game object type
     * @returns {GameObjectTracker} New GameObjectTracker instance
     */
    gameObject(id, type=GAMEOBJECTTYPE.GAMEOBJECT) {
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
     * @param {number} type - Completable type
     * @returns {CompletableTracker} New CompletableTracker instance
     */
    completable(id, type=COMPLETABLETYPE.COMPLETABLE) {
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
     * @param {number} type - Alternative type
     * @returns {AlternativeTracker} New AlternativeTracker instance
     */
    alternative(id, type=ALTERNATIVETYPE.ALTERNATIVE) {
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
}