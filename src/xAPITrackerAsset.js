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
    xapi=null;

    /**
     * Settings of XAPI Tracker Asset
     */
    settings={
        batch_mode:true,
        batch_endpoint:null,
        batch_length:100,
        batch_timeout:ms("30sec"),
        actor_homePage:null,
        actor_name:null,
        backup_mode:false,
        backup_endpoint:null,
        backup_type:"XAPI",
        default_uri:null,
        max_retry_delay:ms("2min"),
        debug:false
    };

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
     * Context statement object
     * @type {ContextStatement}
     */
    context;

    // BATCH AND RETRY PARAMETERS
    /**
     * Current retry delay in milliseconds
     * @type {number|null}
     */
    retryDelay;

    /**
     * Timer reference for batch processing
     * @type {NodeJS.Timeout|null}
     */
    timer = null;

    /**
     * Creates an instance of xAPITrackerAsset
     */
    constructor() {
        this.onOffline();
    }

    /**
     * Logs out the current session by clearing the authentication token
     */
    logout() {
         if(this.online) {
            this.auth_token = null;
            this.onOffline();
         }
    }

    /**
     * Event handler called when the client goes offline
     */
    onOffline() {
        this.online = false;
        this.offset = 0;
        this.statementsToSend = [];
        this.timer = null;
        this.actor = null;
        this.context = null;
        if (this.settings.debug) console.warn("XAPI Tracker for Serious Games went offline");
    }

    /**
     * Event handler called when the client comes online
     * @returns {Promise<void>}
     */
    async onOnline() {
        this.online = true;
        if (this.settings.debug) console.info("XAPI Tracker for Serious Games back Online");
    }

    /**
     * Updates the authentication configuration
     */
    login() {
        if(!this.online) {
            this.actor = new ActorStatement(this.settings.actor_name, this.settings.actor_homePage);
            this.context = new ContextStatement();
            if(this.auth_token != null) {
                this.xapi = new XAPI({
                    endpoint: this.settings.batch_endpoint,
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
    }

    /**
     * Sends a batch of statements to the xAPI endpoint
     * @returns {Promise<void>}
     */
    async sendBatch() {
        if (!this.online) return;
        if (this.offset >= this.statementsToSend.length) return;

        const end = Math.min(this.offset + this.settings.batch_length, this.statementsToSend.length);
        const batch = this.statementsToSend.slice(this.offset, end);
        const statements = batch.map(statement => statement.toXAPI());

        try {
            if(!this.sendingInProgress) {
                this.sendingInProgress = true;
                const result = await this.xapi.sendStatements({statements: statements});
                this.sendingInProgress = false;
                if (this.settings.debug) {
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
                this.retryDelay = this.settings.batch_timeout;
            }
            this.retryDelay = Math.min(this.retryDelay * 2, this.settings.max_retry_delay);
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
        this.login();
    }

    /**
     * Starts the timer for batch processing
     */
    startTimer() {
        if (this.timer) return;
        let timeout = this.retryDelay ? this.retryDelay : this.settings.batch_timeout;

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
        const statement = new Statement(this.actor, verbId, objectId, objectType, this.context, this.settings.default_uri);
        return new StatementBuilder(this, statement);
    }

    /**
     * Sends statements to the backup endpoint
     * @returns {Promise<void>}
     */
    async sendBackup() {
        if (this.online && this.settings.backup_endpoint && this.settings.backup_endpoint.trim()) {
            let contentType;
            let statements;

            switch (this.settings.backup_type) {
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
                url: this.settings.backup_endpoint,
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
        if(this.settings.debug) {
            console.debug(statement.toXAPI());
            console.debug(statement.toCSV());
        }

        this.statementsToSend.push(statement);

        if (this.online && this.statementsToSend.length >= this.offset + this.settings.batch_length) {
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