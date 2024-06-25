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
    this.tokenRefreshInProgress=false;

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

  async doResourceOwnedPasswordCredentialsFlow(tokenUrl, clientId, username, password, scope, state, login_hint) {
    const form = {
      username,
      password,
      login_hint
    };
    if(scope) {
      form.scope=scope;
    }
    if(state) {
      form.state=state;
    }
    return await this.doTokenRequest(tokenUrl, clientId, "password", form);
  }

  async doTokenRequest(tokenUrl, clientId, grantType, otherParams) {
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

  async doRefreshToken(tokenUrl, clientId, refreshToken) {
    return await this.doTokenRequest(tokenUrl, clientId, "refresh_token", { refresh_token: refreshToken });
  }

  async refreshToken() {
    if(this.tokenRefreshInProgress == false) {
      try {
        this.tokenRefreshInProgress=true;
        this.token = await this.doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
        this.tokenRefreshInProgress=false;
        return this.token.access_token;
      } catch(error) {
        this.tokenRefreshInProgress=false;
        console.error(error);
      }
    } else {
      while(this.tokenRefreshInProgress == true) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  hasTokenExpired() {
    let expiredTime = new Date(this.token.requestTime.getTime() + this.token.expires_in*1000);
    let now = new Date();
    if(expiredTime > now) {
      return true;
    } else {
      return false;
    }
  }

  async updateParamsForAuth(request) {
    if (this.hasTokenExpired()) {
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
