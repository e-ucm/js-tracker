import xAPITrackerAsset from "../xAPITrackerAsset.js";
import XAPI from "@xapi/xapi";

/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
export default class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    /**
     * Creates an instance of xAPITrackerAssetOAuth1.
     *
     * @param {string} endpoint - Primary API endpoint
     * @param {string} backupEndpoint - Backup API endpoint
     * @param {string} backupType - Type of backup endpoint
     * @param {string} actor_homePage - Home page URL of the actor
     * @param {string} actor_name - Name of the actor
     * @param {string} username - Username for authentication
     * @param {string} password - Password for authentication
     * @param {string} defaultUri - Default URI for requests
     * @param {boolean} debug - Debug mode flag
     * @param {number} batchLength - Batch length for requests
     * @param {number} batchTimeout - Batch timeout in milliseconds
     * @param {number} maxRetryDelay - Maximum retry delay in milliseconds
     */
    constructor(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, username, password, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay) {
        super(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, XAPI.toBasicAuth(username, password), defaultUri, debug, batchLength, batchTimeout, maxRetryDelay);

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
