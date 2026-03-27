/**
 * A class that implements OAuth 2.0 protocol for authentication and token management.
 * Supports various grant types including password and refresh_token flows.
 */
export default class OAuth2Protocol {
    /**
     * Creates an instance of OAuth2Protocol.
     * Initializes error messages and default property values.
     * @param {Object} config - Configuration object containing OAuth2 parameters
     * @param {string} config.token_endpoint - The token endpoint URL
     * @param {string} config.grant_type - The grant type (password, refresh_token, etc.)
     * @param {string} config.client_id - The client ID
     * @param {string} [config.scope] - Optional scope
     * @param {string} [config.state] - Optional state
     * @param {string} [config.code_challenge_method] - Optional PKCE code challenge method
     * @param {string} [config.username] - Username for password grant type
     * @param {string} [config.password] - Password for password grant type
     * @param {string} [config.login_hint] - Login hint for password grant type
     */
    constructor(config: {
        token_endpoint: string;
        grant_type: string;
        client_id: string;
        scope?: string;
        state?: string;
        code_challenge_method?: string;
        username?: string;
        password?: string;
        login_hint?: string;
    });
    /**
     * Error message template for missing required fields.
     * @type {string}
     */
    fieldMissingMessage: string;
    /**
     * Error message template for unsupported grant types.
     * @type {string}
     */
    unsupportedGrantTypeMessage: string;
    /**
     * Error message template for unsupported PKCE methods.
     * @type {string}
     */
    unsupportedCodeChallengeMethodMessage: string;
    /**
     * The authorization endpoint URL.
     * @type {string|null}
     */
    authEndpoint: string | null;
    /**
     * The token endpoint URL.
     * @type {string|null}
     */
    tokenEndpoint: string | null;
    /**
     * The OAuth2 grant type being used.
     * @type {string|null}
     */
    grantType: string | null;
    /**
     * The username for authentication.
     * @type {string|null}
     */
    username: string | null;
    /**
     * The password for authentication.
     * @type {string|null}
     */
    password: string | null;
    /**
     * The client identifier.
     * @type {string|null}
     */
    clientId: string | null;
    /**
     * The requested scope of access.
     * @type {string|null}
     */
    scope: string | null;
    /**
     * The state parameter for CSRF protection.
     * @type {string|null}
     */
    state: string | null;
    /**
     * The login hint for authentication.
     * @type {string|null}
     */
    login_hint: string | null;
    /**
     * The PKCE code challenge method.
     * @type {string|null}
     */
    codeChallengeMethod: string | null;
    /**
     * The current authentication token.
     * @typedef {Object|null} token
     * @property {string} access_token
     * @property {string} refresh_token
     */
    token: any;
    /**
     * Flag indicating if a token refresh is currently in progress.
     * @type {boolean}
     */
    tokenRefreshInProgress: boolean;
    /**
     * Callback function for token updates.
     * @type {Function|null}
     */
    onAuthorizationInfoUpdate: Function | null;
    /**
     * Initializes the OAuth2 protocol with the provided configuration.
     *
  
     * @returns {Promise<void>}
     * @throws {Error} If required configuration values are missing or grant type is unsupported
     */
    getToken(): Promise<void>;
    /**
     * Refreshes the current access token using the refresh token.
     *
     * @returns {Promise<string>} The new access token
     */
    refreshToken(): Promise<string>;
    /**
     * Checks if the current token has expired.
     *
     * @returns {boolean} True if the token has expired, false otherwise
     */
    hasTokenExpired(): boolean;
    /**
     * Logs out the current session by invalidating the refresh token.
     *
     * @returns {Promise<void>}
     * @throws {Error} If the logout request fails
     */
    logout(): Promise<void>;
    #private;
}
