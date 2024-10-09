import xAPITrackerAsset from "../xAPITrackerAsset.js";
import XAPI from "@xapi/xapi";

export default class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    constructor(endpoint, username, password, homePage, token, defaultUri) {
        var auth = XAPI.toBasicAuth(username, password);
        super(endpoint, auth, homePage, token, defaultUri);
    }
}