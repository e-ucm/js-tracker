/**
 * A class that implements OAuth 2.0 protocol for authentication and token management.
 * Supports various grant types including password and refresh_token flows.
 */
export default class OAuth2Protocol {
  /**
   * Error message template for missing required fields.
   * @type {string}
   */
  fieldMissingMessage;

  /**
   * Error message template for unsupported grant types.
   * @type {string}
   */
  unsupportedGrantTypeMessage;

  /**
   * Error message template for unsupported PKCE methods.
   * @type {string}
   */
  unsupportedCodeChallengeMethodMessage;

  /**
   * The authorization endpoint URL.
   * @type {string|null}
   */
  authEndpoint = null;

  /**
   * The token endpoint URL.
   * @type {string|null}
   */
  tokenEndpoint = null;

  /**
   * The OAuth2 grant type being used.
   * @type {string|null}
   */
  grantType = null;

  /**
   * The username for authentication.
   * @type {string|null}
   */
  username = null;

  /**
   * The password for authentication.
   * @type {string|null}
   */
  password = null;

  /**
   * The client identifier.
   * @type {string|null}
   */
  clientId = null;

  /**
   * The requested scope of access.
   * @type {string|null}
   */
  scope = null;

  /**
   * The state parameter for CSRF protection.
   * @type {string|null}
   */
  state = null;

  /**
   * The login hint for authentication.
   * @type {string|null}
   */
  login_hint = null;

  /**
   * The PKCE code challenge method.
   * @type {string|null}
   */
  codeChallengeMethod = null;

  /**
   * The current authentication token.
   * @typedef {Object|null} token
   * @property {string} access_token
   * @property {string} refresh_token
   */
  token=null;

  /**
   * Flag indicating if a token refresh is currently in progress.
   * @type {boolean}
   */
  tokenRefreshInProgress = false;

  /**
   * Callback function for token updates.
   * @type {Function|null}
   */
  onAuthorizationInfoUpdate = null;

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
  constructor(config) {
    this.fieldMissingMessage = 'Field "{0}" required for "OAuth 2.0" authentication is missing!';
    this.unsupportedGrantTypeMessage = 'Grant type "{0}" not supported. Please use either "code" type or "password" type.';
    this.unsupportedCodeChallengeMethodMessage = 'Code challenge (PKCE) method "{0}" not supported. Please use "S256" method or disable it.';
    this.tokenEndpoint = this.#getRequiredValue(config, 'token_endpoint');
    this.grantType = this.#getRequiredValue(config, 'grant_type').toLowerCase();
    this.clientId = this.#getRequiredValue(config, 'client_id');
    this.scope = config.scope || null;
    this.state = config.state || null;

    // Parse PKCE
    if (config.code_challenge_method) {
      const codeChallengeMethodString = config.code_challenge_method.toUpperCase();
      if (codeChallengeMethodString === 'S256') {
        this.codeChallengeMethod = 'S256';
      } else {
        throw new Error(this.unsupportedCodeChallengeMethodMessage.replace('{0}', codeChallengeMethodString));
      }
    }

    switch (this.grantType) {
      case "password":
        this.username = this.#getRequiredValue(config, 'username');
        this.password = this.#getRequiredValue(config, 'password');
        this.login_hint = this.#getRequiredValue(config, 'login_hint');
      default:
        throw new Error(this.unsupportedGrantTypeMessage.replace('{0}', this.grantType));
    }
  }

  /**
   * Initializes the OAuth2 protocol with the provided configuration.
   *

   * @returns {Promise<void>}
   * @throws {Error} If required configuration values are missing or grant type is unsupported
   */
  async getToken() {
    console.log("[OAuth2] Starting");
    switch (this.grantType) {
      case "refresh_token":
        this.token = await this.#doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
      case "password":
        this.token = await this.#doResourceOwnedPasswordCredentialsFlow(
          this.tokenEndpoint,
          this.clientId,
          this.username,
          this.password,
          this.login_hint,
          this.scope,
          this.state,
        );
        break;
      default:
        throw new Error(this.unsupportedGrantTypeMessage.replace('{0}', this.grantType));
    }

    if (this.token) {
      console.log("[OAuth2] Token obtained: " + this.token.access_token);
    }
  }

  /**
   * Retrieves a required value from the configuration object.
   *
   * @param {Object} config - The configuration object
   * @param {string} key - The key of the required value
   * @returns {*} The value associated with the key
   * @throws {Error} If the required value is missing
   */
  #getRequiredValue(config, key) {
    if (!config[key]) {
      throw new Error(this.fieldMissingMessage.replace('{0}', key));
    }
    return config[key];
  }

  /**
   * Performs the Resource Owner Password Credentials flow.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} username - The username
   * @param {string} password - The password
   * @param {string} [scope] - Optional scope
   * @param {string} [state] - Optional state
   * @param {string} login_hint - The login hint
   * @returns {Promise<Object>} The token response
   */
  async #doResourceOwnedPasswordCredentialsFlow(tokenUrl, clientId, username, password, login_hint, scope, state) {
    const form = {
      username,
      password,
      login_hint
    };
    if(scope) {
      form.scope = scope;
    }
    if(state) {
      form.state = state;
    }
    return await this.#doTokenRequest(tokenUrl, clientId, "password", form);
  }

  /**
   * Makes a token request to the OAuth2 token endpoint.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} grantType - The grant type
   * @param {Object} otherParams - Additional parameters to include in the request
   * @returns {Promise<Object>} The token response
   * @throws {Error} If the token request fails
   */
  async #doTokenRequest(tokenUrl, clientId, grantType, otherParams) {
    const form = {
      grant_type: grantType,
      client_id: clientId,
      ...otherParams
    };

    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Error during token request');
      } else {
        throw error;
      }
    }
  }

  /**
   * Performs a refresh token request.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} refreshToken - The refresh token
   * @returns {Promise<Object>} The new token response
   */
  async #doRefreshToken(tokenUrl, clientId, refreshToken) {
    return await this.#doTokenRequest(tokenUrl, clientId, "refresh_token", { refresh_token: refreshToken });
  }

  /**
   * Refreshes the current access token using the refresh token.
   *
   * @returns {Promise<string>} The new access token
   */
  async refreshToken() {
    if(this.tokenRefreshInProgress == false) {
      try {
        this.tokenRefreshInProgress = true;
        this.token = await this.#doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
        this.tokenRefreshInProgress = false;
        return this.token.access_token;
      } catch(error) {
        this.tokenRefreshInProgress = false;
        console.error(error);
      }
    } else {
      while(this.tokenRefreshInProgress == true) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  /**
   * Checks if the current token has expired.
   *
   * @returns {boolean} True if the token has expired, false otherwise
   */
  hasTokenExpired() {
    let expiredTime = new Date(this.token.requestTime.getTime() + this.token.expires_in*1000);
    let now = new Date();
    if(expiredTime > now) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Updates the request with the current authorization token.
   * Refreshes the token if it has expired.
   *
   * @param {Object} request - The request object to update
   * @returns {Promise<void>}
   */
  async #updateParamsForAuth(request) {
    if (this.hasTokenExpired()) {
      this.token = await this.#doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
      if (this.onAuthorizationInfoUpdate) {
        this.onAuthorizationInfoUpdate(this.token);
      }
    }

    request.headers = {
      ...request.headers,
      'Authorization': `${this.token.token_type.charAt(0).toUpperCase() + this.token.token_type.slice(1)} ${this.token.access_token}`
    };
  }

  /**
   * Registers a callback function to be called when authorization information is updated.
   *
   * @param {Function} callback - The callback function to register
   */
  #registerAuthInfoUpdate(callback) {
    if (callback) {
      this.onAuthorizationInfoUpdate = callback;
      if (this.token) {
        callback(this.token);
      }
    }
  }

  /**
   * Logs out the current session by invalidating the refresh token.
   *
   * @returns {Promise<void>}
   * @throws {Error} If the logout request fails
   */
  async logout() {
    const form = {
      grant_type: "refresh_token",
      client_id: this.clientId,
      refresh_token: this.token.refresh_token
    };

    try {
      const response = await fetch(this.tokenEndpoint.replace("/token", "/logout"), {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      const data = await response.json();
      console.log(data);
      console.log("[OAuth2] Logged out successfully");
    } catch(error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || '[OAuth2] Error during logout');
      } else {
        throw error;
      }
    }
  }
}