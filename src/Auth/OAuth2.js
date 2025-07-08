import xAPITrackerAsset from "../xAPITrackerAsset.js";
import OAuth2Protocol from "./OAuth2Protocol.js";

/**
 * A specialized tracker asset that implements OAuth2 authentication.
 * Extends the base xAPITrackerAsset with OAuth2 capabilities.
 */
export default class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    /**
     * Configuration object for OAuth2 authentication
     * @param {Object} config - Configuration object containing OAuth2 parameters
     * @param {string} config.token_endpoint - The token endpoint URL
     * @param {string} config.grant_type - The grant type (password, refresh_token, etc.)
     * @param {string} config.client_id - The client ID
     * @param {string} [config.scope] - Optional scope
     * @param {string} [config.state] - Optional state
     * @param {string} [config.code_challenge_method] - Optional PKCE code challenge method
     * @param {string} [config.username] - Username for password grant type
     * @param {string} [config.password] - Password for password grant type
     * @param {string} [config.refresh_token] - Refresh token for refresh_token grant type
     * @param {string} [config.login_hint] - Login hint for password grant type
     */
    oauth2Settings={
        token_endpoint:"",
        grant_type:"",
        client_id:"",
        scope:"",
        state:"",
        code_challenge_method:"",
        username:"",
        password:"",
        refreshToken:"",
        login_hint:""
    };

    /**
     * Instance of OAuth2Protocol handling authentication
     * @type {OAuth2Protocol|null}
     */
    oauth2 = null;

    /**
     * Creates an instance of xAPITrackerAssetOAuth2.

     */
    constructor() {
        super();
        this.oauth2 = null;
        window.addEventListener('beforeunload', async () => {
            if (this.auth_token) {
                await this.logout();
            }
        });
    }

    async login() {
        if(!this.online) {
            // Fetch token after object construction
            this.initAuth();
            // Update the authorization or reinitialize xAPITrackerAsset with the token
            super.login();
        }
    }

    /**
     * Retrieves an OAuth2 access token.
     *
     * @returns {Promise<string|null>} The access token or null if failed
     */
    async getToken() {
        try {
            this.oauth2 = new OAuth2Protocol();
            await this.oauth2.init(this.oauth2Settings);
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
            super.login();
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
            super.login();
        }
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
