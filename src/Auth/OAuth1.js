const xAPITrackerAsset = require("../xAPITrackerAsset.js");
const XAPI = require("@xapi/xapi").default;

class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
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

module.exports = xAPITrackerAssetOAuth1;