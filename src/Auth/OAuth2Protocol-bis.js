import axios from 'axios';
import crypto from 'crypto';
import express from 'express';
import open from 'open';
import PkceGenerator from './PkceGenerator.js';

export default class OAuth2Protocol {
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
    this.login_hint=null;
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
        this.login_hint = this.getRequiredValue(config, 'login_hint');
        this.token = await this.doResourceOwnedPasswordCredentialsFlow(
          this.tokenEndpoint,
          this.clientId,
          this.username,
          this.password,
          this.scope,
          this.state,
          this.login_hint
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
      const pkceGenerator = new PkceGenerator();
      var pkce  = await pkceGenerator.generatePkceChallenge();
      codeVerifier=pkce.codeVerifier;
      codeChallenge=pkce.codeChallenge;
      console.log('Code Verifier:', codeVerifier);
      console.log('Code Challenge:', codeChallenge);
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

  async doResourceOwnedPasswordCredentialsFlow(tokenUrl, clientId, username, password, scope, state, login_hint) {
    const form = {
      username,
      password,
      scope,
      state,
      login_hint
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

  listenForCallback() {
    // You need to handle redirect/callback logic here.
    // For example, listening on a local server or using a deep-linking URL.
    if (typeof window !== 'undefined' && window.location) {
      return 'http://localhost:3000/callback';  // Example redirect URL
    } else {
      return 'http://localhost:3000/callback';  // Example redirect URL
    }
  }

  appendParamsToExistingQueryString(url, params) {
    const query = new URLSearchParams(params);
    return `${url}${query.toString()}`;
  }


  // A function to handle the authorization callback
  async handleCallback() {
    // Check if the current URL is the callback URL
    const currentUrl = window.location.href;
    const callbackUrl = this.listenForCallback(); // Replace with your actual callback URL

    if (currentUrl.startsWith(callbackUrl)) {
        // Extract the authorization code from the URL
        const params = new URLSearchParams(window.location.search);
        const authCode = params.get('code'); // Assuming the code is passed as a query parameter

        // Handle the authorization code
        if (authCode) {
            console.log("Authorization code received:", authCode);
            // Perform further actions with the auth code, e.g., exchange for access token
        } else {
            const error = params.get('error');
            if (error) {
                console.error("Authorization error:", error);
            }
        }

        // Optionally, clean up the URL (remove query parameters)
        window.history.replaceState({}, document.title, window.location.pathname);
        const form = {
          code: authCode,
          redirect_uri: redirectUrl
        };
    
        if (codeVerifier) {
          form.code_verifier = codeVerifier;
        }
    
        return await this.doTokenRequest(tokenUrl, clientId, "authorization_code", form);
    }
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
            // Define a listener that will handle the authorization code
            const listener = {
                registerListener: function(callback) {
                    this.callback = callback;
                },
                notify: function(data) {
                    if (this.callback) {
                        this.callback(data);
                    }
                }
            };

            // Register a listener to handle the authorization response
            listener.registerListener(authCode => {
                console.log("Authorization code received:", authCode);
                authorizeResponse = authCode; // Store the authorization code
            });

            // Browser-based redirect
            window.location.href = url;
            // This needs to handle the actual authorization callback flow.
            // Set up a listener for the callback after redirection
            return new Promise((resolve, reject) => {
              // Function to check the URL for authorization response
              const checkForAuthCode = () => {
                  // Check if the current URL has the authorization code
                  const params = new URLSearchParams(window.location.search);
                  const authCode = params.get('code'); // Assuming the code is passed as a query parameter

                  if (authCode) {
                      // Clean up any listeners if necessary
                      // You can also redirect the user to the original page if needed
                      window.history.replaceState({}, document.title, window.location.pathname);

                      // Resolve with the authorization code
                      resolve(authCode);
                  } else {
                      // Optional: handle error cases or timeouts
                      const error = params.get('error');
                      if (error) {
                          reject(new Error(`Authorization error: ${error}`));
                      }
                  }
              };

              // Polling or using a more sophisticated method to check for the authorization code
              const interval = setInterval(() => {
                  checkForAuthCode();
                  // Optionally clear the interval after a certain amount of time or after a successful response
              }, 1000);

              // Optional: set a timeout to stop checking after a certain period
              setTimeout(() => {
                  clearInterval(interval);
                  reject(new Error("Authorization timeout"));
              }, 30000); // 30 seconds timeout, for example
          });
        } else {
            // Node.js environment: Manual handling (use `open` npm package to open in browser)
            //const express = require('express');
            const app = express();
            const PORT = 3000;
            
            // Route to handle the callback
            app.get('/callback', (req, res) => {
                // Assuming the authorization code is passed as a query parameter
                const { code, error } = req.query;
            
                if (error) {
                    console.error("Error during authorization:", error);
                    res.send('Authorization failed.'); // Handle authorization failure
                } else {
                    // Handle the successful authorization response
                    authorizeResponse = code; // Capture the authorization code
                    res.send('Authorization successful! You can close this tab now.'); // Response to the user
                }
            });
            // Start the server
            app.listen(3000, () => {
              console.log(`Server is running at http://localhost:${PORT}`);
            });
            const open = await import('open'); // Use dynamic import here
            await open.default(url); // Access the `default` export for ES modules
            // Polling to wait for the authorization response
            while (authorizeResponse === null) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Wait for a while
            }
        return authorizeResponse;
    }
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
