import xAPITrackerAsset from "../xAPITrackerAsset.js";
import OAuth2Protocol from "./OAuth2Protocol.js";

/**
 * A specialized tracker asset that implements OAuth2 authentication.
 * Extends the base xAPITrackerAsset with OAuth2 capabilities.
 */
export default class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {

    /**
     * @typedef {Object} OAuth2Settings
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
    oauth2Settings = {
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
                await this.Logout();
            }
        });
    }

    async Login() {
        if(!this.online) {
            // Fetch token after object construction
            await this.initAuth();
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
            return super.Login();
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
            super.Login();
        }
    }

    /**
     * Logs out the current session by invalidating the token.
     *
     * @returns {Promise<void>}
     */
    async Logout() {
        await this.oauth2.Logout();
        // logout
        super.Logout();
    }
}
