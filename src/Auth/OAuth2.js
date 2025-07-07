import xAPITrackerAsset from "../xAPITrackerAsset.js";
import OAuth2Protocol from "./OAuth2Protocol.js";

/**
 * A specialized tracker asset that implements OAuth2 authentication.
 * Extends the base xAPITrackerAsset with OAuth2 capabilities.
 */
export default class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    /**
     * Configuration object for OAuth2 authentication
     * @type {Object}
     */
    oauth2Config;

    /**
     * Instance of OAuth2Protocol handling authentication
     * @type {OAuth2Protocol|null}
     */
    oauth2 = null;

    /**
     * Creates an instance of xAPITrackerAssetOAuth2.
     *
     * @param {string} endpoint - Primary API endpoint
     * @param {string} backupEndpoint - Backup API endpoint
     * @param {string} backupType - Type of backup endpoint
     * @param {string} actor_homePage - Home page URL of the actor
     * @param {string} actor_name - Name of the actor
     * @param {Object} config - OAuth2 configuration
     * @param {string} defaultUri - Default URI for requests
     * @param {boolean} debug - Debug mode flag
     * @param {number} batchLength - Batch length for requests
     * @param {number} batchTimeout - Batch timeout in milliseconds
     * @param {number} maxRetryDelay - Maximum retry delay in milliseconds
     */
    constructor(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, config, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay) {
        // Call the parent constructor without the token (since we don't have it yet)
        super(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, null, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay);

        this.oauth2Config = config;
        this.oauth2 = null;

        // Fetch token after object construction
        this.initAuth();

        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    /**
     * Retrieves an OAuth2 access token.
     *
     * @returns {Promise<string|null>} The access token or null if failed
     */
    async getToken() {
        try {
            this.oauth2 = new OAuth2Protocol();
            await this.oauth2.init(this.oauth2Config);
            return this.oauth2.token.access_token; // Return the access token
        } catch(e) {
            console.error(e);
            return null;
        }
    }

    /**
     * Initializes authentication by obtaining and setting the OAuth2 token.
     *
     * @returns {Promise<void>}
     */
    async initAuth() {
        const oAuth2Token = await this.getToken();
        if(oAuth2Token !== null) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    /**
     * Refreshes the OAuth2 authentication token.
     *
     * @returns {Promise<void>}
     */
    async refreshAuth() {
        const oAuth2Token = await this.oauth2.refreshToken();
        if(oAuth2Token) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    /**
     * Updates the authentication in the parent class.
     */
    updateAuth() {
        // Update the authorization or reinitialize xAPITrackerAsset with the token
        super.updateAuth();
    }

    /**
     * Logs out the current session by invalidating the token.
     *
     * @returns {Promise<void>}
     */
    async logout() {
        await this.oauth2.logout();
        // logout
        super.logout();
    }
}
