export = xAPITrackerAsset;
declare class xAPITrackerAsset {
    /**
     * @param {string} endpoint
     * @param {string} backup_endpoint
     * @param {string} backup_type
     * @param {string} actor_homePage
     * @param {string} actor_name
     * @param {string} auth_token
     * @param {string}  default_uri
     * @param {boolean} debug
     * @param {string} batchLength
     * @param {string} batchTimeout
     * @param {string} maxRetryDelay
     *
     */
    constructor(endpoint: string, backup_endpoint: string, backup_type: string, actor_homePage: string, actor_name: string, auth_token: string, default_uri: string, debug: boolean, batchLength: string, batchTimeout: string, maxRetryDelay: string);
    xapi: any;
    /**
     * @type {string}
     */
    endpoint: string;
    /**
     * @type {string}
     */
    auth_token: string;
    /**
     * @type {boolean}
     */
    online: boolean;
    /**
     * @type {Array}
     */
    statementsToSend: any[];
    /**
     * @type {boolean}
     */
    sendingInProgress: boolean;
    /**
     * @type {number}
     */
    offset: number;
    /**
     * @type {boolean}
     */
    backup: boolean;
    /**
     * @type {string}
     */
    backup_endpoint: string;
    /**
     * @type {string}
     */
    backup_type: string;
    /**
     * @type {{ content_type: string; headers: { [s: string]: any; } | ArrayLike<any>; query_parameters: string | string[][] | Record<string, string> | URLSearchParams; }}
     */
    backupRequestParameters: {
        content_type: string;
        headers: {
            [s: string]: any;
        } | ArrayLike<any>;
        query_parameters: string | string[][] | Record<string, string> | URLSearchParams;
    };
    /**
     * @type {ActorStatement}
     */
    actor: ActorStatement;
    /**
     * @type {string}
     */
    actor_homePage: string;
    /**
     * @type {string}
     */
    actor_name: string;
    /**
     * @type {ContextStatement}
     */
    context: ContextStatement;
    /**
     * @type {string}
     */
    default_uri: string;
    /**
     * @type {boolean}
     */
    debug: boolean;
    /**
     * @type {number}
     */
    batchlength: number;
    /**
     * @type {number}
     */
    batchtimeout: number;
    /**
     * @type {number}
     */
    retryDelay: number;
    /**
     * @type {number}
     */
    maxRetryDelay: number;
    /**
     * @type {NodeJS.Timeout}
     */
    timer: NodeJS.Timeout;
    logout(): void;
    onOffline(): void;
    onOnline(): Promise<void>;
    updateAuth(): void;
    sendBatch(): Promise<void>;
    refreshAuth(): Promise<void>;
    startTimer(): void;
    /**
     * @param {string} verbId
     * @param {string} objectType
     * @param {string} objectId
     * @returns {Statement}
     */
    Trace(verbId: string, objectType: string, objectId: string): Statement;
    sendBackup(): Promise<void>;
    /**
     * @param {Statement} statement
     */
    enqueue(statement: Statement): Promise<void>;
}
import ActorStatement = require("./HighLevel/Statement/ActorStatement.js");
import ContextStatement = require("./HighLevel/Statement/ContextStatement.js");
import Statement = require("./HighLevel/Statement/Statement.js");
