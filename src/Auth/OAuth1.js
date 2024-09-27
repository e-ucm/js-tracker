const xAPITrackerAsset = require("../xAPITrackerAsset");
var XAPI = require("@xapi/xapi");
class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    constructor(endpoint, username, password, homePage, token) {
        var auth = XAPI.toBasicAuth(username, password);
        super(endpoint, auth, homePage, token);
    }
}

module.exports = xAPITrackerAssetOAuth1;