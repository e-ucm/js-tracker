import xAPITrackerAsset from "../xAPITrackerAsset.js";
import XAPI from "@xapi/xapi";

/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
export default class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    oauth1settings={
        username:"",
        password:""
    };
    /**
     * Creates an instance of xAPITrackerAssetOAuth1.
     */
    constructor() {
        super();
        this.oauth1settings.username="";
        this.oauth1settings.password="";
        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    async login() {
        this.auth_token=XAPI.toBasicAuth(this.oauth1settings.username, this.oauth1settings.password);
        super.login();
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
