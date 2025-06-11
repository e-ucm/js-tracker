import xAPITrackerAsset from './xAPITrackerAsset.js';
import xAPITrackerAssetOAuth1 from './Auth/OAuth1.js';
import xAPITrackerAssetOAuth2 from './Auth/OAuth2.js';
import { AccessibleTracker, ACCESSIBLETYPE } from './HighLevel/Accessible.js';
import { CompletableTracker, COMPLETABLETYPE } from './HighLevel/Completable.js';
import { AlternativeTracker, ALTERNATIVETYPE } from './HighLevel/Alternative.js';
import { GameObjectTracker, GAMEOBJECTTYPE } from './HighLevel/GameObject.js';
import { ScormTracker, SCORMTYPE  } from './HighLevel/SCORM.js';

class JSTracker {
    static ACCESSIBLETYPE=ACCESSIBLETYPE;
    static COMPLETABLETYPE=COMPLETABLETYPE;
    static ALTERNATIVETYPE=ALTERNATIVETYPE;
    static GAMEOBJECTTYPE=GAMEOBJECTTYPE;
    static SCORMTYPE=SCORMTYPE;

    tracker;
    accessibleTracker;
    completableTracker;
    alternativeTracker;
    gameObjectTracker;
    scormTracker;

    constructor(result_uri=null, backup_uri=null, backup_type=null, actor_homepage=null, actor_username=null, auth_token=null,  default_uri=null, debug=null) {
        this.tracker=new xAPITrackerAsset(result_uri, backup_uri, backup_type, actor_homepage, actor_username, auth_token,  default_uri, debug);
        this.accessibleTracker=new AccessibleTracker(this.tracker);
        this.completableTracker=new CompletableTracker(this.tracker);
        this.alternativeTracker=new AlternativeTracker(this.tracker);
        this.gameObjectTracker=new GameObjectTracker(this.tracker);
        this.scormTracker=new ScormTracker(this.tracker);
    }

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
            debug=urlParams.get('debug');
            // BATCH
            batchLength=urlParams.get('batch_length');
            batchTimeout=urlParams.get('batch_timeout');
            maxRetryDelay=urlParams.get('max_retry_delay');
            if(debug !== null && debug == "true") {
                debug = Boolean(debug);
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
            this.tracker=new xAPITrackerAssetOAuth2(result_uri, backup_uri, backup_type, actor_homepage, actor_username, xAPIConfig,  default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        } else if(username && password) {
            this.tracker=new xAPITrackerAssetOAuth1(result_uri, backup_uri, backup_type, actor_homepage, actor_username, username, password, default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        } else {
            this.tracker=new xAPITrackerAsset(result_uri, backup_uri, backup_type, actor_homepage, actor_username, auth_token,  default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        }
        this.accessibleTracker=new AccessibleTracker(this.tracker);
        this.completableTracker=new CompletableTracker(this.tracker);
        this.alternativeTracker=new AlternativeTracker(this.tracker);
        this.gameObjectTracker=new GameObjectTracker(this.tracker);
        this.scormTracker=new ScormTracker(this.tracker);
    }
}

export default JSTracker;

