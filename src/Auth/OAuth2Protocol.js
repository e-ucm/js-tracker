var axios = require('axios');

class OAuth2Protocol {
  constructor() {
    this.fieldMissingMessage = 'Field "{0}" required for "OAuth 2.0" authentication is missing!';
    this.unsupportedGrantTypeMessage = 'Grant type "{0}" not supported. Please use either "code" type or "password" type.';
    this.unsupportedCodeChallengeMethodMessage = 'Code challenge (PKCE) method "{0}" not supported. Please use "S256" method or disable it.';

    this.authEndpoint = null;
    this.tokenEndpoint = null;
    this.grantType = null;
    this.username = null;
    this.password = null;
    this.clientId = null;
    this.scope = null;
    this.state = null;
    this.codeChallengeMethod = null;
    this.token = null;

    this.onAuthorizationInfoUpdate = null;
  }

  async init(config) {
    console.log("[OAuth2] Starting");
    this.tokenEndpoint = this.getRequiredValue(config, 'token_endpoint');
    this.grantType = this.getRequiredValue(config, 'grant_type').toLowerCase();
    this.clientId = this.getRequiredValue(config, 'client_id');

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
      case "refresh_token":
        const refreshToken = this.getRequiredValue(config, 'refresh_token');
        this.token = await this.doRefreshToken(this.tokenEndpoint, this.clientId, refreshToken);
        break;
      case "code":
        this.authEndpoint = this.getRequiredValue(config, 'auth_endpoint');
        this.token = await this.doAccessCodeFlow(
          this.authEndpoint,
          this.tokenEndpoint,
          this.clientId,
          this.codeChallengeMethod,
          this.scope,
          this.state
        );
        break;
      case "password":
        this.username = this.getRequiredValue(config, 'username');
        this.password = this.getRequiredValue(config, 'password');
        this.token = await this.doResourceOwnedPasswordCredentialsFlow(
          this.tokenEndpoint,
          this.clientId,
          this.username,
          this.password,
          this.scope,
          this.state
        );
        break;
      default:
        throw new Error(this.unsupportedGrantTypeMessage.replace('{0}', this.grantType));
    }

    if (this.token) {
      console.log("[OAuth2] Token obtained: " + this.token.access_token);
    }
  }

  getRequiredValue(config, key) {
    if (!config[key]) {
      throw new Error(this.fieldMissingMessage.replace('{0}', key));
    }
    return config[key];
  }

  async doAccessCodeFlow(authUrl, tokenUrl, clientId, pkceType, scope, state) {
    let codeVerifier = null, codeChallenge = null;
    if (pkceType === 'S256') {
      // Generate PKCE verifier and challenge
      ({ codeVerifier, codeChallenge } = this.generatePkceChallenge());
    }

    const redirectUrl = this.listenForCallback();

    const authCode = await this.doAuthorizeRequest(
      authUrl,
      clientId,
      scope,
      state,
      redirectUrl,
      pkceType,
      codeChallenge
    );

    const form = {
      code: authCode,
      redirect_uri: redirectUrl
    };

    if (codeVerifier) {
      form.code_verifier = codeVerifier;
    }

    return await this.doTokenRequest(tokenUrl, clientId, "authorization_code", form);
  }

  async doResourceOwnedPasswordCredentialsFlow(tokenUrl, clientId, username, password, scope, state) {
    const form = {
      username,
      password,
      scope,
      state
    };

    return await this.doTokenRequest(tokenUrl, clientId, "password", form);
  }

  async doTokenRequest(tokenUrl, clientId, grantType, otherParams) {
    const form = {
      grant_type: grantType,
      client_id: clientId,
      ...otherParams
    };

    try {
      const response = await axios.post(tokenUrl, new URLSearchParams(form).toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw new Error(error.response.data.error || 'Error during token request');
      } else {
        throw error;
      }
    }
  }

  async doRefreshToken(tokenUrl, clientId, refreshToken) {
    return await this.doTokenRequest(tokenUrl, clientId, "refresh_token", { refresh_token: refreshToken });
  }

  generatePkceChallenge() {
    const codeVerifier = this.generateRandomString(32);
    const codeChallenge = this.base64UrlEncode(this.sha256(codeVerifier));
    return { codeVerifier, codeChallenge };
  }

  generateRandomString(length) {
    let array;

    // Check if window is defined (i.e., running in a browser)
    if (typeof window !== 'undefined' && window.crypto) {
        array = new Uint32Array(length);
        window.crypto.getRandomValues(array);
    } 
    // If running in Node.js, use the crypto module
    else if (typeof require !== 'undefined') {
        const crypto = require('crypto');
        
        // Ensure that 'length' is passed correctly as the size argument
        if (typeof length !== 'number' || length <= 0) {
            throw new Error('Invalid length provided for random string generation');
        }

        // Generate random bytes, then convert them to a hexadecimal string
        array = crypto.randomBytes(length);
    } else {
        throw new Error('No suitable random generator available');
    }

    // Convert array to hexadecimal string
    return Array.from(array, byte => ('0' + byte.toString(16)).substr(-2)).join('');
  }



  sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
  }

  base64UrlEncode(arrayBuffer) {
    const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  listenForCallback() {
    // You need to handle redirect/callback logic here.
    // For example, listening on a local server or using a deep-linking URL.
    return 'http://localhost:3000/callback';  // Example redirect URL
  }

  appendParamsToExistingQueryString(url, params) {
    const query = new URLSearchParams(params);
    return `${url}${query.toString()}`;
  }


  async doAuthorizeRequest(authorizeEndpoint, clientId, scope, state, redirectUrl, pkceType, codeChallenge = null) {
    const parameters = {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUrl,
    };

    if (pkceType !== 'None') {
        parameters.code_challenge = codeChallenge;
        parameters.code_challenge_method = pkceType.toString();
    }

    if (scope) parameters.scope = scope;
    if (state) parameters.state = state;

    let authorizeResponse = null;

    try {
        const url = this.appendParamsToExistingQueryString(`${authorizeEndpoint}?`, parameters);

        // Check if running in Node.js or browser
        if (typeof window !== 'undefined' && window.location) {
            // Browser-based redirect
            AuthUtility.OpenUrl(url);
        } else {
            // Node.js environment: Manual handling (use `open` npm package to open in browser)
            const open = await import('open'); // Use dynamic import here
            await open.default(url); // Access the `default` export for ES modules

            const listener = {
                registerListener: function(callback) {
                    // Code to handle the listener registration
                    this.callback = callback;
                },
                notify: function(data) {
                    if (this.callback) {
                        this.callback(data);
                    }
                }
            };
            // Check if listener is provided and has the registerListener function
            if (listener && typeof listener.registerListener === 'function') {
              listener.registerListener(auth => (authorizeResponse = auth));

              while (authorizeResponse === null) {
                  await new Promise(resolve => setTimeout(resolve, 100));
              }
            } else {
              console.error("Listener object does not have a registerListener method");
            }
        }

        return authorizeResponse;
    } catch (error) {
        // Handle exceptions
        throw error;
    }
}


  async updateParamsForAuth(request) {
    if (this.token.expired) {
      this.token = await this.doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
      if (this.onAuthorizationInfoUpdate) {
        this.onAuthorizationInfoUpdate(this.token);
      }
    }

    request.headers = {
      ...request.headers,
      'Authorization': `${this.token.token_type.charAt(0).toUpperCase() + this.token.token_type.slice(1)} ${this.token.access_token}`
    };
  }

  registerAuthInfoUpdate(callback) {
    if (callback) {
      this.onAuthorizationInfoUpdate = callback;
      if (this.token) {
        callback(this.token);
      }
    }
  }
}

module.exports = OAuth2Protocol;
