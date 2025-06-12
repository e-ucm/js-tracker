export = xAPITrackerAssetOAuth2;
declare class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    oauth2Config: any;
    oauth2: any;
    getToken(): Promise<any>;
    initAuth(): Promise<void>;
    logout(): Promise<void>;
}
import xAPITrackerAsset = require("../xAPITrackerAsset.js");
