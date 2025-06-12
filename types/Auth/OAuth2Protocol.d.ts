export = OAuth2Protocol;
declare class OAuth2Protocol {
    fieldMissingMessage: string;
    unsupportedGrantTypeMessage: string;
    unsupportedCodeChallengeMethodMessage: string;
    authEndpoint: any;
    tokenEndpoint: any;
    grantType: any;
    username: any;
    password: any;
    clientId: any;
    scope: any;
    state: any;
    login_hint: any;
    codeChallengeMethod: string;
    token: any;
    tokenRefreshInProgress: boolean;
    onAuthorizationInfoUpdate: any;
    init(config: any): Promise<void>;
    getRequiredValue(config: any, key: any): any;
    doResourceOwnedPasswordCredentialsFlow(tokenUrl: any, clientId: any, username: any, password: any, scope: any, state: any, login_hint: any): Promise<any>;
    doTokenRequest(tokenUrl: any, clientId: any, grantType: any, otherParams: any): Promise<any>;
    doRefreshToken(tokenUrl: any, clientId: any, refreshToken: any): Promise<any>;
    refreshToken(): Promise<any>;
    hasTokenExpired(): boolean;
    updateParamsForAuth(request: any): Promise<void>;
    registerAuthInfoUpdate(callback: any): void;
    logout(): Promise<void>;
}
