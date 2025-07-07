import xAPITrackerAsset from "../xAPITrackerAsset.js";
import XAPI from "@xapi/xapi";

/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
export default class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
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
    constructor({endpoint, actor_homePage, actor_name, default_uri, username, password, backup_endpoint=null, backup_type="XAPI", debug=null, batchLength=null, batchTimeout=null, maxRetryDelay=null}) {
        super({endpoint:endpoint, backup_endpoint:backup_endpoint, backup_type:backup_type, actor_homePage:actor_homePage, actor_name:actor_name, auth_token:XAPI.toBasicAuth(username, password), default_uri:default_uri, debug:debug, batchLength:batchLength, batchTimeout:batchTimeout, maxRetryDelay:maxRetryDelay});

        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
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
