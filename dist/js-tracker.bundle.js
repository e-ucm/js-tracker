const xAPITrackerAsset = require('./xAPITrackerAsset.js');
const xAPITrackerAssetOAuth1 = require('./Auth/OAuth1.js');
const xAPITrackerAssetOAuth2 = require('./Auth/OAuth2.js');
const { AccessibleTracker, ACCESSIBLETYPE } = require('./HighLevel/Accessible.js');
const { CompletableTracker, COMPLETABLETYPE } = require('./HighLevel/Completable.js');
const { AlternativeTracker, ALTERNATIVETYPE } = require('./HighLevel/Alternative.js');
const { GameObjectTracker, GAMEOBJECTTYPE } = require('./HighLevel/GameObject.js');
const { ScormTracker, SCORMTYPE  } = require('./HighLevel/ScormTracker.js');

class JSTracker {
    static ACCESSIBLETYPE=ACCESSIBLETYPE;
    static COMPLETABLETYPE=COMPLETABLETYPE;
    static ALTERNATIVETYPE=ALTERNATIVETYPE;
    static GAMEOBJECTTYPE=GAMEOBJECTTYPE;
    static SCORMTYPE=SCORMTYPE;

    /**
     * @type {xAPITrackerAsset}
     */
    Tracker;
    /**
     * @type {AccessibleTracker}
     */
    AccessibleTracker;
    /**
     * @type {CompletableTracker}
     */
    CompletableTracker;
    /**
     * @type {AlternativeTracker}
     */
    AlternativeTracker;
    /**
     * @type {GameObjectTracker}
     */
    GameObjectTracker;
    /**
     * @type {ScormTracker}
     */
    ScormTracker;

    /**
     * @param {string} endpoint
     * @param {string} backup_endpoint
     * @param {string} backup_type
     * @param {string} actor_homePage
     * @param {string} actor_name
     * @param {string} auth_token
     * @param {string}  default_uri
     * @param {boolean} debug
     * @param {string} batchLength
     * @param {string} batchTimeout
     * @param {string} maxRetryDelay
     *
     */
    constructor(endpoint=null, backup_endpoint=null, backup_type=null, actor_homePage=null, actor_name=null, auth_token=null,  default_uri=null, debug=null, batchLength=null, batchTimeout=null, maxRetryDelay=null) {
        this.Tracker=new xAPITrackerAsset(endpoint, backup_endpoint, backup_type, actor_homePage, actor_name, auth_token,  default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        this.AccessibleTracker=new AccessibleTracker(this.Tracker);
        this.CompletableTracker=new CompletableTracker(this.Tracker);
        this.AlternativeTracker=new AlternativeTracker(this.Tracker);
        this.GameObjectTracker=new GameObjectTracker(this.Tracker);
        this.ScormTracker=new ScormTracker(this.Tracker);
    }

    /**
     * @param {string} default_uri
     */
    generateXAPITrackerFromURLParams(default_uri) {
        const xAPIConfig = {};
        const urlParams = new URLSearchParams(window.location.search);
        var result_uri,backup_uri, backup_type, actor_username, actor_homepage, debug, batchLength, batchTimeout, maxRetryDelay;
        var username, password, auth_token;
        if(urlParams.size > 0) {
            //RESULT URI
            result_uri = urlParams.get('result_uri');

            //BACKUP URI
            backup_uri=urlParams.get('backup_uri');
            backup_type=urlParams.get('backup_type');
        
            //ACTOR DATA
            actor_homepage = urlParams.get('actor_homepage');
            actor_username = urlParams.get('actor_user');
            
            //SSO OAUTH 2.0 DATA
            const sso_token_endpoint = urlParams.get('sso_token_endpoint');
            if(sso_token_endpoint) {
                xAPIConfig.token_endpoint=sso_token_endpoint;
            }
            const sso_client_id = urlParams.get('sso_client_id');
            if(sso_client_id) {
                xAPIConfig.client_id=sso_client_id;
            }
            const sso_login_hint = urlParams.get('sso_login_hint');
            if(sso_login_hint) {
                xAPIConfig.login_hint=sso_login_hint;
            }
            const sso_grant_type = urlParams.get('sso_grant_type');
            if(sso_grant_type) {
                xAPIConfig.grant_type=sso_grant_type;
            }
            const sso_scope = urlParams.get('sso_scope');
            if(sso_scope) {
                xAPIConfig.scope=sso_scope;
            }
            const sso_username = urlParams.get('sso_username');
            if(sso_username) {
                xAPIConfig.username=sso_username;
            }
            const sso_password = urlParams.get('sso_password');
            if(sso_password) {
                xAPIConfig.password=sso_password;
            } else {
                if(sso_username) {
                    xAPIConfig.password=sso_username;
                }
            }

            // OAUTH 1.0 DATA 
            username = urlParams.get('username');
            password = urlParams.get('password');
            // OAUTH 0 : VIA AUTHTOKEN DIRECTLY NOT RECOMENDED
            auth_token = urlParams.get('auth_token');
            // DEBUG 
            var stringDebug=urlParams.get('debug');
            // BATCH
            batchLength=urlParams.get('batch_length');
            batchTimeout=urlParams.get('batch_timeout');
            maxRetryDelay=urlParams.get('max_retry_delay');
            if(stringDebug !== null && stringDebug == "true") {
                debug = true;
                console.debug(result_uri);
                console.debug(result_uri);
                console.debug(backup_type);
                console.debug(actor_username);
                console.debug(actor_homepage);
                console.debug(debug);
                console.debug(batchLength);
                console.debug(batchTimeout);
                console.debug(maxRetryDelay);
                //console.debug(xAPIConfig);
            }
        } else {
            result_uri = null;
            result_uri = null;
            backup_type="XAPI";
            actor_homepage= null;
            actor_username= null;
            debug = false;
        }

        if(xAPIConfig.token_endpoint) {
            this.Tracker=new xAPITrackerAssetOAuth2(result_uri, backup_uri, backup_type, actor_homepage, actor_username, xAPIConfig,  default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        } else if(username && password) {
            this.Tracker=new xAPITrackerAssetOAuth1(result_uri, backup_uri, backup_type, actor_homepage, actor_username, username, password, default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        } else {
            this.Tracker=new xAPITrackerAsset(result_uri, backup_uri, backup_type, actor_homepage, actor_username, auth_token,  default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        }
        this.AccessibleTracker=new AccessibleTracker(this.Tracker);
        this.completableTracker=new CompletableTracker(this.Tracker);
        this.AlternativeTracker=new AlternativeTracker(this.Tracker);
        this.GameObjectTracker=new GameObjectTracker(this.Tracker);
        this.ScormTracker=new ScormTracker(this.Tracker);
    }
}

module.exports = JSTracker;
