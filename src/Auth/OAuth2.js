import xAPITrackerAsset from "../xAPITrackerAsset.js";
import OAuth2Protocol from "./OAuth2Protocol.js";

export default class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    constructor(endpoint, config, homePage, token, defaultUri) {
        // Call the parent constructor without the token (since we don't have it yet
        super(endpoint, null, homePage, token, defaultUri);

        // Fetch token after object construction
        this.initAuth(endpoint, config, homePage, token, defaultUri);
    }

    async getToken(config) {
        var oauth2 = new OAuth2Protocol();
        await oauth2.init(config);
        return oauth2.token.access_token; // Return the access token
    }

    async initAuth(endpoint, config, homePage, token, defaultUri) {
        const oAuth2Token = await this.getToken(config);
        const auth = "Bearer " + oAuth2Token;
        console.log(auth);
        // Now that we have the token, update the authorization in the super class
        this.updateAuth(endpoint, auth, homePage, token, defaultUri);
    }
    
    // Assuming this method updates the auth in the super class
    updateAuth(endpoint, auth, homePage, token, defaultUri) {
        // Update the authorization or reinitialize xAPITrackerAsset with the token
        super.updateAuth(endpoint, auth, homePage, token, defaultUri);
    }
}