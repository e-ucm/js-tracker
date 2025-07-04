import xAPITrackerAsset from "../xAPITrackerAsset.js";
//import OAuth2Keycloak from "./OAuth2Keycloak.js";
import OAuth2Protocol from "./OAuth2Protocol.js";

export default class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    oauth2Config;
    oauth2;
    constructor(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, config, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay) {
        // Call the parent constructor without the token (since we don't have it yet)
        super(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, null, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay);

        this.oauth2Config=config;
        this.oauth2=null;
        // Fetch token after object construction
        this.initAuth();
        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

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

    async initAuth() {
        const oAuth2Token = await this.getToken();
        if(oAuth2Token !== null) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    async refreshAuth() {
        const oAuth2Token = await this.oauth2.refreshToken();
        if(oAuth2Token) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    // Assuming this method updates the auth in the super class
    updateAuth() {
        // Update the authorization or reinitialize xAPITrackerAsset with the token
        super.updateAuth();
    }

    // Assuming this method updates the auth in the super class
    async logout() {
        await this.oauth2.logout();
        // logout
        super.logout();
    }

}