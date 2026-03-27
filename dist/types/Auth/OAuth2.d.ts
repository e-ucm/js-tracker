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
    oauth2Settings: {
        token_endpoint: string;
        client_id: string;
        grant_type: string;
        scope: string;
        state: string;
        code_challenge_method: string;
        username: string;
        password: string;
        login_hint: string;
    };
    /**
     * Instance of OAuth2Protocol handling authentication
     * @type {OAuth2Protocol|null}
     */
    oauth2: OAuth2Protocol | null;
    /**
     * Logs out the current session by invalidating the token.
     *
     * @returns {Promise<void>}
     */
    logout(): Promise<void>;
    #private;
}
import xAPITrackerAsset from "../xAPITrackerAsset.js";
import OAuth2Protocol from "./OAuth2Protocol.js";
