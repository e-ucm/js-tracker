export = xAPITrackerAssetOAuth2;
declare class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    constructor(endpoint: any, backupEndpoint: any, backupType: any, actor_homePage: any, actor_name: any, config: any, defaultUri: any, debug: any, batchLength: any, batchTimeout: any, maxRetryDelay: any);
    oauth2Config: any;
    oauth2: any;
    getToken(): Promise<any>;
    initAuth(): Promise<void>;
    logout(): Promise<void>;
}
import xAPITrackerAsset = require("../xAPITrackerAsset.js");
