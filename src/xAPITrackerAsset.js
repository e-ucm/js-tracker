import XAPI from "@xapi/xapi";
import ActorStatement from "./HighLevel/Statement/ActorStatement.js";
import ContextStatement from "./HighLevel/Statement/ContextStatement.js";
import Statement from "./HighLevel/Statement/Statement.js";
import axios from 'axios';
import ms from 'ms';
import { StatementBuilder } from "./HighLevel/StatementBuilder.js";

export default class xAPITrackerAsset {
    //XAPI PARAMETERS
    xapi;
    endpoint;
    auth_token;
    online;
    //STATEMENTS PARAMETERS
    statementsToSend;
    sendingInProgress;
    offset;
    //BACKUP PARAMETERS
    backup;
    backup_endpoint;
    backup_type;
    backupRequestParameters;
    //ACTOR PARAMETERS
    actor;
    actor_homePage;
    actor_name;
    context;
    //DEFAULT_URI PARAMETERS
    default_uri;
    //DEBUG PARAMETERS
    debug;
    //BATCH AND RETRY PARAMETERS
    batchlength;
    batchtimeout;
    retryDelay;
    maxRetryDelay;
    timer;

    constructor(endpoint, backup_endpoint, backup_type, actor_homePage, actor_name, auth_token, default_uri, debug, batchLength, batchTimeout, maxRetryDelay) {
        this.default_uri=default_uri;
        this.debug=debug;
        this.online=false;
        this.endpoint = endpoint;
        if(backup_endpoint) {
            this.backup = true;
            if(backup_type == null) {
                backup_type="CSV";
            }
            this.backup_type = backup_type;
            this.backup_endpoint = backup_endpoint;
        }
        this.batchlength = parseInt(batchLength) || 100; // Default batch length (100 statements)
        this.batchtimeout = batchTimeout ? ms(batchTimeout) : ms("30sec"); // Default timeout in milliseconds (30 seconds)
        this.offset = 0; // Tracks the starting index of the next batch

        this.retryDelay = null;
        this.maxRetryDelay = maxRetryDelay ? ms(maxRetryDelay) : ms("2min"); // Maximum retry delay (120 seconds)
        this.statementsToSend=[];
        this.timer = null;
        this.xapi=null;
        this.auth_token = auth_token;
        this.actor_homePage = actor_homePage;
        this.actor_name = actor_name;
        this.actor=new ActorStatement(this.actor_name, this.actor_name, this.actor_homePage);
        this.context = new ContextStatement();
        this.updateAuth();
    }

    logout() {
        this.auth_token = null;
        this.onOffline();
    }

    // Event handler: When the client goes offline
    onOffline() {
        this.online = false;
        if (this.debug) console.warn("XAPI Tracker for Serious Games went offline");
    }

    // Event handler: When the client comes online
    async onOnline() {
        this.online = true;
        if (this.debug) console.info("XAPI Tracker for Serious Games back Online");
    }

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

    async sendBatch() {
        if (!this.online) return; // Skip if offline
        if (this.offset >= this.statementsToSend.length) return; // No statements to send
        
        const end = Math.min(this.offset + this.batchlength, this.statementsToSend.length);
        const batch = this.statementsToSend.slice(this.offset, end);
        const statements = batch.map(statement => statement.toXAPI());

        try {
            if(!this.sendingInProgress) {
                this.sendingInProgress=true;
                const result = await this.xapi.sendStatements({statements: statements });
                this.sendingInProgress=false;
                if (this.debug) {
                    console.debug("Batch sent successfully:", result);
                }
                // Move the offset forward
                this.offset += batch.length;
                // Reset retry delay on success
                this.retryDelay = null;
            }
        } catch (error) {
            console.error("Error sending batch:", error.response);
            const status = error.response.status;
            const errorMessage = error.response.data.message || error.message;
            switch (status) {
                case 401: // Unauthorized
                    console.error(`Unauthorized: ${errorMessage}`);
                    this.onOffline();
                    await this.refreshAuth();
                    this.sendingInProgress=false;
                    // Attempt to send queued statements
                    await this.sendBatch();
                    break;
                case 403: // Forbidden
                    console.error(`Forbidden: ${errorMessage}`);
                    this.onOffline();
                    await this.refreshAuth();
                    this.sendingInProgress=false;
                    // Attempt to send queued statements
                    await this.sendBatch();
                    break;
                default:
                    console.error(`[TRACKER: Batch Processor] Batch upload returned status ${status} with message: ${errorMessage}`);
                    this.sendingInProgress=false;
                    this.onOffline();
                    break;
            }

            if(this.retryDelay == null) {
                this.retryDelay=this.batchtimeout;
            }
            // Retry logic: Increase delay and retry sending
            this.retryDelay = Math.min(this.retryDelay * 2, this.maxRetryDelay); // Exponential backoff with a cap
            this.timer=null; // Reset timer
        }

        // Continue sending if more items are in the queue
        if (this.offset < this.statementsToSend.length) {
            this.startTimer(); // Start a new timer to process the next batch
        }
    }

    async refreshAuth() {
        // Now that we have the token, update the authorization in the super class
        this.updateAuth();
    }

    startTimer() {
        if (this.timer) return; // Timer already running
        let timeout=this.batchtimeout;
        if(this.retryDelay) {
            timeout=this.retryDelay;
        }
        this.timer = setTimeout(async () => {
            await this.sendBatch();
            this.timer = null; // Reset timer
            if (this.offset < this.statementsToSend.length) {
                this.startTimer(); // Restart timer if more statements are queued
            }
        }, timeout);
    }

    Trace(verbId, objectType, objectId) {
        var statement=new Statement(this.actor, verbId, objectId, objectType, this.context, this.default_uri);
        return new StatementBuilder(this, statement);
    }

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
            const body =  {
                tofile: true,
                result: statements.join('\n'),
                contentType: contentType
            };

            // Initialize request object
            const myRequest = {
                url: this.backup_endpoint,
                method: 'POST',
                headers: {
                    'Authorization': this.auth_token || '',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(body, null, 2)
            };

            // Add custom parameters from config file
            if (this.backupRequestParameters) {
                // Content type
                if (this.backupRequestParameters.content_type) {
                    myRequest.headers['Content-Type'] = this.backupRequestParameters.content_type;
                }

                // Request headers
                if (this.backupRequestParameters.headers && typeof this.backupRequestParameters.headers === 'object') {
                    Object.entries(this.backupRequestParameters.headers).forEach(([key, value]) => {
                        myRequest.headers[key] = value;
                    });
                }

                // Request query parameters
                if (this.backupRequestParameters.query_parameters && typeof this.backupRequestParameters.query_parameters === 'object') {
                    const queryParams = new URLSearchParams(this.backupRequestParameters.query_parameters).toString();
                    myRequest.url += `?${queryParams}`;
                }
            }

            try {
                // Perform the HTTP request
                const response = await axios(myRequest);
                console.log(response);
            } catch (error) {
                if (error.response) {
                    const status = error.response.status;
                    const errorMessage = error.response.data.message || error.message;

                    switch (status) {
                        case 401: // Unauthorized
                            this.onOffline();
                            console.error(`Unauthorized: ${errorMessage}`);
                            await this.refreshAuth();
                            await this.sendBackup();
                            break;
                        case 403: // Forbidden
                            this.onOffline();
                            console.error(`Forbidden: ${errorMessage}`);
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
    
    async enqueue(statement) {
        if(this.debug !== null && this.debug) {
            console.debug(statement.toXAPI());
            console.debug(statement.toCSV());
        }
        
        // Add statement to queue
        this.statementsToSend.push(statement);

        // Start sending immediately if online and batch size is reached
        if (this.online && this.statementsToSend.length >= this.offset + this.batchlength) {
            await this.sendBatch();
        }

        // Start the timer for timeout-based sending
        this.startTimer();
    }
}