/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
export default class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    /**
    * @typedef {Object} oauth1Settings
    * @property {string} username
    * @property {string} password
    */
    oauth1Settings: {
        username: string;
        password: string;
    };
}
import xAPITrackerAsset from "../xAPITrackerAsset.js";
