import XAPI from "@xapi/xapi";
import ActorStatement from "./HighLevel/Statement/ActorStatement.js";
import ContextStatement from "./HighLevel/Statement/ContextStatement.js";
import Statement from "./HighLevel/Statement/Statement.js";
import axios from 'axios';
import ms from 'ms';
import { StatementBuilder } from "./HighLevel/StatementBuilder.js";

/**
 * XAPI Tracker Asset Class
 * Handles xAPI tracking with batch processing, retry logic, and backup capabilities
 */
export default class xAPITrackerAsset {
    // XAPI PARAMETERS

    /**
     * XAPI Tracker instance
     * @type {XAPI|null}
     */
    xapi = null;

    /**
     * Primary xAPI endpoint URL
     * @type {string}
     */
    endpoint;

    /**
     * Authentication token for xAPI requests
     * @type {string|null}
     */
    auth_token = null;

    /**
     * Current online status
     * @type {boolean}
     */
    online = false;

    // STATEMENTS PARAMETERS

    /**
     * Queue of statements to be sent
     * @type {Array<Statement>}
     */
    statementsToSend = [];

    /**
     * Flag indicating if sending is currently in progress
     * @type {boolean}
     */
    sendingInProgress = false;

    /**
     * Current offset in the statements queue
     * @type {number}
     */
    offset = 0;

    // BACKUP PARAMETERS

    /**
     * Whether backup is enabled
     * @type {boolean}
     */
    backup = false;

    /**
     * Backup endpoint URL
     * @type {string|null}
     */
    backup_endpoint = null;

    /**
     * Backup type (XAPI or CSV)
     * @type {string|null}
     */
    backup_type = null;

    /**
     * Additional parameters for backup requests
     * @type {Object|null}
     */
    backupRequestParameters = null;

    // ACTOR PARAMETERS

    /**
     * Actor statement object
     * @type {ActorStatement}
     */
    actor;

    /**
     * Actor's homepage URL
     * @type {string}
     */
    actor_homePage;

    /**
     * Actor's name
     * @type {string}
     */
    actor_name;

    /**
     * Context statement object
     * @type {ContextStatement}
     */
    context;

    // DEFAULT_URI PARAMETERS

    /**
     * Default URI for statements
     * @type {string}
     */
    default_uri;

    // DEBUG PARAMETERS

    /**
     * Debug mode flag
     * @type {boolean}
     */
    debug;

    // BATCH AND RETRY PARAMETERS

    /**
     * Number of statements to send in each batch
     * @type {number}
     */
    batchlength;

    /**
     * Timeout between batch sends in milliseconds
     * @type {number}
     */
    batchtimeout;

    /**
     * Current retry delay in milliseconds
     * @type {number|null}
     */
    retryDelay = null;

    /**
     * Maximum retry delay in milliseconds
     * @type {number}
     */
    maxRetryDelay;

    /**
     * Timer reference for batch processing
     * @type {NodeJS.Timeout|null}
     */
    timer = null;

    /**
     * Creates an instance of xAPITrackerAsset
     * @param {object} opts options for the xapi Tracker asset
     * @param {string} opts.endpoint - Primary xAPI endpoint URL (required)
     * @param {string} opts.actor_homePage - Home page URL of the actor (required)
     * @param {string} opts.actor_name - Name of the actor (required)
     * @param {string} opts.default_uri - Default URI for statements (required)
     * 
     * @param {string} [opts.backup_endpoint=null] - Backup endpoint URL (optional)
     * @param {string} [opts.backup_type='XAPI'] - Type of backup (XAPI or CSV) (optional)
     * @param {string} [opts.auth_token=null] - Authentication token (optional)
     * @param {boolean} [opts.debug=false] - Debug mode flag (optional)
     * @param {number} [opts.batchLength=null] - Number of statements per batch (optional)
     * @param {number} [opts.batchTimeout=null] - Timeout between batches (optional)
     * @param {number} [opts.maxRetryDelay=null] - Maximum retry delay (optional)
     */
    constructor({endpoint, actor_homePage, actor_name, default_uri=null, backup_endpoint=null, backup_type="XAPI", auth_token=null, debug=false, batchLength=null, batchTimeout=null, maxRetryDelay=null}) {
        this.default_uri = default_uri;
        this.debug = debug;
        this.online = false;
        this.endpoint = endpoint;

        if(backup_endpoint) {
            this.backup = true;
            this.backup_type = backup_type;
            this.backup_endpoint = backup_endpoint;
        }

        this.batchlength = batchLength || 100;
        this.batchtimeout = batchTimeout ? ms(batchTimeout) : ms("30sec");
        this.offset = 0;
        this.maxRetryDelay = maxRetryDelay ? ms(maxRetryDelay) : ms("2min");
        this.statementsToSend = [];
        this.timer = null;
        this.auth_token = auth_token;
        this.actor_homePage = actor_homePage;
        this.actor_name = actor_name;
        this.actor = new ActorStatement(this.actor_name, this.actor_homePage);
        this.context = new ContextStatement();
        this.updateAuth();
    }

    /**
     * Logs out the current session by clearing the authentication token
     */
    logout() {
        this.auth_token = null;
        this.onOffline();
    }

    /**
     * Event handler called when the client goes offline
     */
    onOffline() {
        this.online = false;
        if (this.debug) console.warn("XAPI Tracker for Serious Games went offline");
    }

    /**
     * Event handler called when the client comes online
     * @returns {Promise<void>}
     */
    async onOnline() {
        this.online = true;
        if (this.debug) console.info("XAPI Tracker for Serious Games back Online");
    }

    /**
     * Updates the authentication configuration
     */
    updateAuth() {
        if(this.auth_token != null) {
            this.xapi = new XAPI({
                endpoint: this.endpoint,
                auth: this.auth_token
            });
            if(this.xapi != null) {
                this.onOnline();
            } else {
                this.onOffline();
            }
        } else {
            this.onOffline();
        }
    }

    /**
     * Sends a batch of statements to the xAPI endpoint
     * @returns {Promise<void>}
     */
    async sendBatch() {
        if (!this.online) return;
        if (this.offset >= this.statementsToSend.length) return;

        const end = Math.min(this.offset + this.batchlength, this.statementsToSend.length);
        const batch = this.statementsToSend.slice(this.offset, end);
        const statements = batch.map(statement => statement.toXAPI());

        try {
            if(!this.sendingInProgress) {
                this.sendingInProgress = true;
                const result = await this.xapi.sendStatements({statements: statements});
                this.sendingInProgress = false;
                if (this.debug) {
                    console.debug("Batch sent successfully:", result);
                }
                this.offset += batch.length;
                this.retryDelay = null;
            }
        } catch (error) {
            console.error("Error sending batch:", error.response);
            const status = error.response.status;
            const errorMessage = error.response.data.message || error.message;

            switch (status) {
                case 401: // Unauthorized
                case 403: // Forbidden
                    console.error(`${status === 401 ? 'Unauthorized' : 'Forbidden'}: ${errorMessage}`);
                    this.onOffline();
                    await this.refreshAuth();
                    this.sendingInProgress = false;
                    await this.sendBatch();
                    break;
                default:
                    console.error(`[TRACKER: Batch Processor] Batch upload returned status ${status} with message: ${errorMessage}`);
                    this.sendingInProgress = false;
                    this.onOffline();
                    break;
            }

            if(this.retryDelay == null) {
                this.retryDelay = this.batchtimeout;
            }
            this.retryDelay = Math.min(this.retryDelay * 2, this.maxRetryDelay);
            this.timer = null;
        }

        if (this.offset < this.statementsToSend.length) {
            this.startTimer();
        }
    }

    /**
     * Refreshes the authentication token
     * @returns {Promise<void>}
     */
    async refreshAuth() {
        this.updateAuth();
    }

    /**
     * Starts the timer for batch processing
     */
    startTimer() {
        if (this.timer) return;
        let timeout = this.retryDelay ? this.retryDelay : this.batchtimeout;

        this.timer = setTimeout(async () => {
            await this.sendBatch();
            this.timer = null;
            if (this.offset < this.statementsToSend.length) {
                this.startTimer();
            }
        }, timeout);
    }

    /**
     * Creates a new statement builder
     * @param {string} verbId - The verb ID for the statement
     * @param {string} objectType - The type of the object
     * @param {string} objectId - The ID of the object
     * @returns {StatementBuilder} A new StatementBuilder instance
     */
    Trace(verbId, objectType, objectId) {
        const statement = new Statement(this.actor, verbId, objectId, objectType, this.context, this.default_uri);
        return new StatementBuilder(this, statement);
    }

    /**
     * Sends statements to the backup endpoint
     * @returns {Promise<void>}
     */
    async sendBackup() {
        if (this.online && this.backup_endpoint && this.backup_endpoint.trim()) {
            let contentType;
            let statements;

            switch (this.backup_type) {
                case 'XAPI':
                    statements = this.statementsToSend.map(statement => JSON.stringify(statement.toXAPI()));
                    contentType = 'application/json';
                    break;
                case 'CSV':
                    statements = this.statementsToSend.map(statement => statement.toCSV());
                    contentType = 'text/csv';
                    break;
                default:
                    return;
            }

            const body = {
                tofile: true,
                result: statements.join('\n'),
                contentType: contentType
            };

            const myRequest = {
                url: this.backup_endpoint,
                method: 'POST',
                headers: {
                    'Authorization': this.auth_token || '',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(body, null, 2)
            };

            if (this.backupRequestParameters) {
                if (this.backupRequestParameters.content_type) {
                    myRequest.headers['Content-Type'] = this.backupRequestParameters.content_type;
                }

                if (this.backupRequestParameters.headers && typeof this.backupRequestParameters.headers === 'object') {
                    Object.entries(this.backupRequestParameters.headers).forEach(([key, value]) => {
                        myRequest.headers[key] = value;
                    });
                }

                if (this.backupRequestParameters.query_parameters && typeof this.backupRequestParameters.query_parameters === 'object') {
                    const queryParams = new URLSearchParams(this.backupRequestParameters.query_parameters).toString();
                    myRequest.url += `?${queryParams}`;
                }
            }

            try {
                const response = await axios(myRequest);
                console.log(response);
            } catch (error) {
                if (error.response) {
                    const status = error.response.status;
                    const errorMessage = error.response.data.message || error.message;

                    switch (status) {
                        case 401: // Unauthorized
                        case 403: // Forbidden
                            this.onOffline();
                            console.error(`${status === 401 ? 'Unauthorized' : 'Forbidden'}: ${errorMessage}`);
                            await this.refreshAuth();
                            await this.sendBackup();
                            break;
                        default:
                            console.error(`[TRACKER: Backup Processor] Backup upload returned status ${status} with message: ${errorMessage}`);
                            break;
                    }
                } else {
                    throw new Error(`Request failed: ${error.message}`);
                }
            }
        }
    }

    /**
     * Adds a statement to the queue and starts processing if needed
     * @param {Statement} statement - The statement to enqueue
     * @returns {Promise<void>}
     */
    async enqueue(statement) {
        if(this.debug) {
            console.debug(statement.toXAPI());
            console.debug(statement.toCSV());
        }

        this.statementsToSend.push(statement);

        if (this.online && this.statementsToSend.length >= this.offset + this.batchlength) {
            await this.sendBatch();
        }

        this.startTimer();
    }

    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Options object
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    async flush({withBackup = false} = {}) {
        if(withBackup) {
            await Promise.all([
                this.sendBatch(),
                this.sendBackup()
            ]);
        } else {
            await this.sendBatch();
        }
    }
}