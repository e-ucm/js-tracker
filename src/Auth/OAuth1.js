import xAPITrackerAsset from "../xAPITrackerAsset.js";
import XAPI from "@xapi/xapi";

export default class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    constructor(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, username, password, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay) {
        super(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, XAPI.toBasicAuth(username, password), defaultUri, debug, batchLength, batchTimeout, maxRetryDelay);
        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    async refreshAuth() {
        super.refreshAuth();
    }

    logout() {
        super.logout();
    }
}