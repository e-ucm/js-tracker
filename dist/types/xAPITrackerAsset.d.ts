/**
 * XAPI Tracker Asset Class
 * Handles xAPI tracking with batch processing, retry logic, and backup capabilities
 */
export default class xAPITrackerAsset {
    /**
     * XAPI Tracker instance
     * @type {XAPI|null}
     */
    xapi: XAPI | null;
    /**
     * Settings of XAPI Tracker Asset
     * @typedef {Object} settings
     * @property {boolean} batch_mode
     * @property {string} batch_endpoint
     * @property {number} batch_length
     * @property {number} batch_timeout
     * @property {string} platform
     * @property {string} actor_name
     * @property {boolean} backup_mode
     * @property {string} backup_endpoint
     * @property {string} backup_type
     * @property {string} default_uri
     * @property {number} max_retry_delay
     * @property {boolean} debug
     * @property {string} parent_activity_id
     * @property {string} registration_id
    * @property {string} parent_activity_type
     */
    settings: {
        batch_mode: boolean;
        batch_endpoint: string;
        batch_length: number;
        batch_timeout: any;
        platform: string;
        actor_name: string;
        backup_mode: boolean;
        backup_endpoint: string;
        backup_type: string;
        default_uri: string;
        max_retry_delay: any;
        debug: boolean;
        parent_activity_id: string;
        registration_id: string;
        parent_activity_type: "http://adlnet.gov/expapi/activities/lesson";
    };
    /**
     * Authentication token for xAPI requests
     * @type {string|null}
     */
    auth_token: string | null;
    /**
     * Current online status
     * @type {boolean}
     */
    online: boolean;
    /**
     * Current connected status
     * @type {boolean}
     */
    connected: boolean;
    /**
     * Current started status
     * @type {boolean}
     */
    started: boolean;
    /**
     * Queue of statements to be sent
     * @type {Array<Statement>}
     */
    statementsToSend: Array<Statement>;
    /**
     * Flag indicating if sending is currently in progress
     * @type {boolean}
     */
    sendingInProgress: boolean;
    /**
     * Current offset in the statements queue
     * @type {number}
     */
    offset: number;
    /**
     * Additional parameters for backup requests
     * @type {Object|null}
     */
    backupRequestParameters: any | null;
    /**
     * Actor statement object
     * @type {ActorStatement}
     */
    actor: ActorStatement;
    /**
     * Context statement object
     * @type {ContextStatement}
     */
    context: ContextStatement;
    /**
     * Context statement without parent object
     * @type {ContextStatement}
     */
    context_without_parent: ContextStatement;
    /**
     * Current retry delay in milliseconds
     * @type {number|null}
     */
    retryDelay: number | null;
    /**
     * Timer reference for batch processing
     * @type {NodeJS.Timeout|null}
     */
    timer: NodeJS.Timeout | null;
    /**
     * Logs out the current session by clearing the authentication token
     */
    logout(): void;
    start(): void;
    stop(): void;
    /**
     * Updates the authentication configuration
     *
     */
    login(): Promise<void>;
    rethrow: boolean;
    /**
     * Refreshes the authentication token
     * @returns {Promise<void>}
     */
    refreshAuth(): Promise<void>;
    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    trace(verbId: string, objectType: string, objectId: string, context?: ContextStatement, lrs?: boolean): StatementBuilder;
    /**
     * Creates a StatementBuilder from an existing xAPI statement object
     * @overload
     * @param {Object} statement - The statement to send
     * @param {true} lrs - Whether to create an LRSStatementBuilder
     * @return {LRSStatementBuilder} A new LRSStatementBuilder instance
     */
    fromXAPI(statement: any, lrs: true): LRSStatementBuilder;
    /**
     * @overload
     * @param {Object} statement - The statement to send
     * @param {false} [lrs] - Whether to create a regular StatementBuilder
     * @return {StatementBuilder} A new StatementBuilder instance
     */
    fromXAPI(statement: any, lrs?: false): StatementBuilder;
    /**
     * Adds a statement to the queue and starts processing if needed
     * @param {Statement} statement - The statement to enqueue
     * @returns {Promise<void>}
     */
    enqueue(statement: Statement): Promise<void>;
    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Options object
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    flush({ withBackup }?: {
        withBackup?: boolean;
    }): Promise<void>;
    /**
     * Gets the XAPI client
     * @returns {XAPI} The XAPI client
     */
    getXAPIClient(): XAPI;
    #private;
}
import XAPI from "@xapi/xapi";
import Statement from "./HighLevel/Statement/Statement.js";
import ActorStatement from "./HighLevel/Statement/ActorStatement.js";
import ContextStatement from "./HighLevel/Statement/ContextStatement.js";
import StatementBuilder from "./HighLevel/StatementBuilder/StatementBuilder.js";
import LRSStatementBuilder from "./HighLevel/StatementBuilder/LRSStatementBuilder.js";
