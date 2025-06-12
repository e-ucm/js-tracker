import XAPI from '@xapi/xapi';
import { v4 } from 'uuid';
import axios from 'axios';
import ms from 'ms';

class ActorStatement {
    constructor(token, accountName, homepage) {
        this.token = token;
        this.accountName = accountName;
        this.homepage = homepage;
    }
    token;
    accountName;
    homepage;
    
    toXAPI() {
        return {
            account: {
                name: this.accountName,
                homePage: this.homepage
            }
        };
    }
    
    toCSV() {
        return this.accountName.replaceAll(',', '\\,') ;
    }
}

class ContextStatement {
    constructor(categoryId="seriousgame", registrationId=null) {
        if(registrationId != null) {
            this.registration=v4();
        } else {
            this.registration=v4();
        }
        this.categoryId=this.categoryIDs[categoryId];
        this.category=categoryId;
    }
    registration;

    categoryIDs = {
        seriousgame : 'https://w3id.org/xapi/seriousgame',
        scorm: 'https://w3id.org/xapi/scorm'
    };
    
    toXAPI() {
        return {
            registration: this.registration,
            contextActivities: { 
                category:[{
                    id: this.categoryId,
                    definition: {
                        type : "http://adlnet.gov/expapi/activities/profile"
                    }
                }]
            }
        };
    }

    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }
}

class VerbStatement {
    constructor(verbId) {
        this.verbId = this.verbIds[verbId];
        this.verbDisplay = verbId;
    }
    verbIds = {
        //Completable Verbs
        initialized: 'http://adlnet.gov/expapi/verbs/initialized',
        progressed: 'http://adlnet.gov/expapi/verbs/progressed',
        completed: 'http://adlnet.gov/expapi/verbs/completed',
        //Accessible Verbs
        accessed: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
        skipped: 'http://id.tincanapi.com/verb/skipped',
        //Alternative Verbs
        selected: 'https://w3id.org/xapi/adb/verbs/selected',
        unlocked: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
        //GameObject Verbs
        interacted: 'http://adlnet.gov/expapi/verbs/interacted',
        used: 'https://w3id.org/xapi/seriousgames/verbs/used',

        //SCORM Verbs
        responded: 'http://adlnet.gov/expapi/verbs/responded',
        resumed: 'http://adlnet.gov/expapi/verbs/resumed',
        suspended: 'http://adlnet.gov/expapi/verbs/suspended',
        terminated: 'http://adlnet.gov/expapi/verbs/resumed',
        passed: 'http://adlnet.gov/expapi/verbs/passed',
        failed: 'http://adlnet.gov/expapi/verbs/failed',
        scored: 'http://adlnet.gov/expapi/verbs/scored',
    };
    verbId;
    verbDisplay;

    toXAPI() {
        var verb = {};
        if(this.verbId) {
            verb.id = this.verbId;
        }
        
        if(this.verbDisplay) {
            verb.display = { "en": this.verbDisplay };
        }
        return verb;
    }

    toCSV() {
        return this.verbId;
    }
}

class ObjectStatement {
    constructor(id, type, name = null, description = null) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
    }
    
    typeIds = {
        // Completable
        game: 'https://w3id.org/xapi/seriousgames/activity-types/serious-game' ,
        session: 'https://w3id.org/xapi/seriousgames/activity-types/session',
        level: 'https://w3id.org/xapi/seriousgames/activity-types/level',
        quest: 'https://w3id.org/xapi/seriousgames/activity-types/quest',
        stage: 'https://w3id.org/xapi/seriousgames/activity-types/stage',
        combat: 'https://w3id.org/xapi/seriousgames/activity-types/combat',
        storynode: 'https://w3id.org/xapi/seriousgames/activity-types/story-node',
        race: 'https://w3id.org/xapi/seriousgames/activity-types/race',
        completable: 'https://w3id.org/xapi/seriousgames/activity-types/completable',
    
        // Acceesible
        screen: 'https://w3id.org/xapi/seriousgames/activity-types/screen' ,
        area: 'https://w3id.org/xapi/seriousgames/activity-types/area',
        zone: 'https://w3id.org/xapi/seriousgames/activity-types/zone',
        cutscene: 'https://w3id.org/xapi/seriousgames/activity-types/cutscene',
        accessible: 'https://w3id.org/xapi/seriousgames/activity-types/accessible',
    
        // Alternative
        question: 'http://adlnet.gov/expapi/activities/question' ,
        menu: 'https://w3id.org/xapi/seriousgames/activity-types/menu',
        dialog: 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree',
        path: 'https://w3id.org/xapi/seriousgames/activity-types/path',
        arena: 'https://w3id.org/xapi/seriousgames/activity-types/arena',
        alternative: 'https://w3id.org/xapi/seriousgames/activity-types/alternative',
    
        // GameObject
        enemy: 'https://w3id.org/xapi/seriousgames/activity-types/enemy' ,
        npc: 'https://w3id.org/xapi/seriousgames/activity-types/non-player-character',
        item: 'https://w3id.org/xapi/seriousgames/activity-types/item',
        gameobject: 'https://w3id.org/xapi/seriousgames/activity-types/game-object',

        // SCORM
        course: 'http://adlnet.gov/expapi/activities/course',
        module: 'http://adlnet.gov/expapi/activities/module',
        SCO: 'http://adlnet.gov/expapi/activities/lesson',
        assessment: 'http://adlnet.gov/expapi/activities/assessment',
        interaction: 'http://adlnet.gov/expapi/activities/interaction',
        cmi_interaction: "http://adlnet.gov/expapi/activities/cmi.interaction",
        objective: 'http://adlnet.gov/expapi/activities/objective',
        attempt: 'http://adlnet.gov/expapi/activities/attempt',
        profile: 'http://adlnet.gov/expapi/activities/profile'
    };

    ExtensionIDs = {
      extended_interaction_type: "https://w3id.org/xapi/netc-assessment/extensions/activity/extended-interaction-type",
    };

    id;
    type;
    name;
    description;

    toXAPI() {
        var object= {};
        if(this.id) {
            object.id = this.id;
        }
        object.definition={};
        if(this.name) {
            object.definition.name = { "en-US": this.name };
        }
        if(this.description) {
            object.definition.description = { "en-US": this.description };
        }
        if(this.type) {
            object.definition.type = this.typeIds[this.type];
        }
        return object;
    }

    toCSV() {
        return this.typeIds[this.type].replaceAll(',','\\,') + ',' + this.id.replaceAll(',', '\\,');
    }
}

class ResultStatements {
    constructor(defautURI) {
        this.defautURI = defautURI;
        this.parent = null;
        this.Score = null;
        this.Success = null;
        this.Completion = null;
        this.Response = null;
        this.Duration = null;
        this.Extensions = {};
    }

    isEmpty() {
        return (this.parent == null) && (this.Score == null) && (this.Duration == null) && (this.Success == null) && (this.Completion == null) && (this.Response == null) && (Object.keys(this.Extensions).length == 0);
    }

    ExtensionIDs = {
        health: 'https://w3id.org/xapi/seriousgames/extensions/health',
        position: 'https://w3id.org/xapi/seriousgames/extensions/position',
        progress: 'https://w3id.org/xapi/seriousgames/extensions/progress',
        interactionID: 'https://w3id.org/xapi/netc-assessment/extensions/activity/id-number',
        response_explanation: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-explanation',
        response_type: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-type',
    };

    setExtensions(extensions) {
        this.Extensions = {};
        for (var key in extensions) {
            setExtension(key,extensions[key]);
        }
    }

    setExtension(key, value) {
        switch (key.toLowerCase()) {
            case 'success': { this.Success = value; break; }
            case 'completion': { this.Completion = value; break; }
            case 'response': { this.Response = value; break; }
            case 'score': { this.Score = value; break; }
            case 'duration': { this.Duration = value; break; }
            default: { this.Extensions[key] = value; break; }
        }
    }

    setAsUri(id) {
        if(this.isUri(id)) {
            return id;
        } else {
            return `${this.defautURI}://${id}`;
        }
    }
    
    isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    setScoreValue(key, value) {
        if(! this.Score) {
            this.Score = {};
        }
        this.Score[key] = Number(value);
    }

    toXAPI() {
        var ret = {};

        if (this.Success !== null) {
            ret.success = (this.Success) ? true : false;
        }

        if (this.Completion !== null) {
            ret.completion = (this.Completion) ? true : false;
        }

        if (this.Response) {
            ret.response = this.Response.toString();
        }

        if (this.Score !== null) {
            ret.score = this.Score;
        }

        if (this.Duration !== null) {
            ret.duration = this.Duration;
        }


        if (this.Extensions !== null && obsize(this.Extensions) > 0) {
            ret.extensions = this.Extensions;

            for (var key in this.Extensions) {
                if (this.ExtensionIDs.hasOwnProperty(key)) {
                    this.Extensions[this.ExtensionIDs[key]] = this.Extensions[key];
                    delete this.Extensions[key];
                } else {
                    var newuri= this.setAsUri(key);
                    this.Extensions[newuri] = this.Extensions[key];
                    if(newuri !== key) {
                        delete this.Extensions[key];
                    }
                }
            }
        }

        return ret;
    }
    
    toCSV() {
        var success = (this.Success !== null) ? ',success,' + this.Success.toString() : '';
        var completion = (this.Completion !== null) ? ',completion,' + this.Completion.toString() : '';
        var response = (this.Response) ? ',response,' + this.Response.replaceAll(',', '\\,') : '';
        var score = '';

        if (exists(this.Score)) {
            if (exists(this.Score.raw)) {
                score += ',score,' + this.Score.raw;
            }

            if (exists(this.Score.min)) {
                score += ',score_min,' + this.Score.min;
            }

            if (exists(this.Score.max)) {
                score += ',score_max,' + this.Score.max;
            }

            if (exists(this.Score.scaled)) {
                score += ',score_scaled,' + this.Score.scaled;
            }
        }

        var result = success + completion + response + score;

        if (this.Extensions !== null && obsize(this.Extensions) > 0) {
            for (var key in this.Extensions) {
                result += ',' + key.replaceAll(',', '\\,') + ',';
                if (this.Extensions[key] !== null) {
                    if (typeof this.Extensions[key] === 'number') {
                        result += this.Extensions[key];
                    } else if (typeof this.Extensions[key] === 'string') {
                        result += this.Extensions[key].replaceAll(',', '\\,');
                    } else if (typeof this.Extensions[key] === 'object') {
                        if (ismap(this.Extensions[key])) {
                            var smap = '';

                            for (var k in this.Extensions[key]) {
                                if (typeof this.Extensions[key][k] === 'number') {
                                    smap += k + '=' + this.Extensions[key][k] + '-';
                                } else {
                                    smap += k + '=' + this.Extensions[key][k].replaceAll(',', '\\,') + '-';
                                }
                            }

                            result += smap.slice(0,-1);
                        }
                    } else {
                        result += this.Extensions[key];
                    }
                }
            }
        }

        return result;
    }
}

var obsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

var ismap = function(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            return false;
        }
    }
    return true;
};

var exists = function(value) {
    return !(typeof value === 'undefined' || value === null);
};

class Statement {
    constructor(actor, verbId, objectId, objectType, context, defautURI) {
        this.id = v4();
        this.actor = actor;
        this.verb = new VerbStatement(verbId);
        this.defautURI = defautURI;
        this.object = new ObjectStatement(this.setAsUri(objectId), objectType);
        this.timestamp = new Date();
        this.context = context;
        this.version = "1.0.3";
        this.result = new ResultStatements(this.defautURI);
    }
    
    actor;
    verb;
    object;
    timestamp;
    context;
    result;

    setAsUri(id) {
        if(this.isUri(id)) {
            return id;
        } else {
            return `${this.defautURI}://${id}`;
        }
    }
    
    isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    setScore(raw, min, max, scaled) {
        if (raw) {
            this.setScoreRaw(raw);
        }

        if (min) {
            this.setScoreMin(min);
        }

        if (max) {
            this.setScoreMax(max);
        }

        if (scaled) {
            this.setScoreScaled(scaled);
        }
    }

    setScoreRaw(raw) {
        this.result.setScoreValue('raw', raw);
    }

    setScoreMin(min) {
        this.result.setScoreValue('min', min);
    }

    setScoreMax(max) {
        this.result.setScoreValue('max', max);
    }

    setScoreScaled(scaled) {
        this.result.setScoreValue('scaled', scaled);
    }

    setCompletion(value) {
        this.addResultExtension('completion', value);
    }

    setSuccess(value) {
        this.addResultExtension('success', value);
    }

    setDuration(diffInSeconds) {
        const seconds = diffInSeconds % 60;
        const minutes = Math.floor(diffInSeconds / 60) % 60;
        const hours = Math.floor(diffInSeconds / 3600) % 24;
        const days = Math.floor(diffInSeconds / 86400);

        // Construct the ISO 8601 duration string
        const isoDuration = `P${days}DT${hours}H${minutes}M${seconds}S`;
        this.addResultExtension('duration', isoDuration);
    }

    setResponse(value) {
        this.addResultExtension('response', value);
    }

    setProgress(value) {
        this.addResultExtension('progress', value);
    }

    setVar(key,value) {
        this.addResultExtension(key,value);
    }

    addResultExtension(key,value) {
        this.result.setExtension(key, value);
    }

    toXAPI() {
        var xapiTrace={};
        if(this.id) {
            xapiTrace.id = this.id;
        }
        if(this.actor) {
            xapiTrace.actor = this.actor.toXAPI();
        }
        if(this.verb) {
            xapiTrace.verb = this.verb.toXAPI();
        }
        if(this.object) {
            xapiTrace.object = this.object.toXAPI();
        }
        if(this.timestamp) {
            xapiTrace.timestamp = this.timestamp.toISOString();
        }
        if(this.context) {
            xapiTrace.context = this.context.toXAPI();
        }
        if(this.version) {
            xapiTrace.version = this.version;
        }
        if(!this.result.isEmpty()) {
            xapiTrace.result = this.result.toXAPI();
        }
        return xapiTrace;
    }

    toCSV() {
        var csv=[];
        csv.push(this.timestamp.toISOString());
        csv.push(this.verb.toCSV());
        csv.push(this.object.toCSV());
        var result='';
        if(!this.result.isEmpty()) {
            result=this.result.toCSV();
        }
        return `${csv.join(",")}${result}`;
    }
}

class xAPITrackerAsset {
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
        onOffline();
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
        return statement;
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

class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    constructor(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, username, password, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay) {
        super(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, XAPI.toBasicAuth(username, password), defaultUri, debug, batchLength, batchTimeout, maxRetryDelay);
        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    async refreshAuth() {
        super.refreshAuth();
    }

    logout() {
        super.logout();
    }
}

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

class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    oauth2Config;
    oauth2;
    constructor(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, config, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay) {
        // Call the parent constructor without the token (since we don't have it yet)
        super(endpoint, backupEndpoint, backupType, actor_homePage, actor_name, null, defaultUri, debug, batchLength, batchTimeout, maxRetryDelay);

        this.oauth2Config=config;
        this.oauth2=null;
        // Fetch token after object construction
        this.initAuth();
        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    async getToken() {
        try {
            this.oauth2 = new OAuth2Protocol();
            await this.oauth2.init(this.oauth2Config);
            return this.oauth2.token.access_token; // Return the access token
        } catch(e) {
            console.error(e);
            return null;
        }
    }

    async initAuth() {
        const oAuth2Token = await this.getToken();
        if(oAuth2Token !== null) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    async refreshAuth() {
        const oAuth2Token = await this.oauth2.refreshToken();
        if(oAuth2Token) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    // Assuming this method updates the auth in the super class
    updateAuth() {
        // Update the authorization or reinitialize xAPITrackerAsset with the token
        super.updateAuth();
    }

    // Assuming this method updates the auth in the super class
    async logout() {
        await this.oauth2.logout();
        // logout
        super.logout();
    }

}

class AccessibleTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    Accessed(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('accessed',this.AccessibleType[type],accessibleId);
        return statement;
    }

    Skipped(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('skipped',this.AccessibleType[type],accessibleId);
        return statement;
    }

    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});

class CompletableTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    Initialized(completableId, type) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('initialized',this.CompletableType[type],completableId);
        return statement;
    }

    Progressed(completableId, type, progress) {
        if (typeof type === 'undefined') {type = 8;}

        var statement = this.tracker.Trace('progressed',this.CompletableType[type],completableId);
        statement.setProgress(progress);
        return statement;
    }

    Completed(completableId, type, success, completion, score) {
        if (typeof type === 'undefined') {type = 8;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('completed',this.CompletableType[type],completableId);
        statement.setSuccess(success);
        statement.setCompletion(completion);
        statement.setScore(score);
        return statement;
    }
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const COMPLETABLETYPE = Object.freeze({
    GAME: 0,
    SESSION: 1,
    LEVEL: 2,
    QUEST: 3,
    STAGE: 4,
    COMBAT: 5,
    STORYNODE: 6,
    RACE: 7,
    COMPLETABLE: 8
});

class AlternativeTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    AlternativeType = ['question', 'menu', 'dialog', 'path', 'arena', 'alternative']

    Selected(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('selected',this.AlternativeType[type],alternativeId);
        statement.setResponse(optionId);
        return statement;
    }

    Unlocked(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}
        
        var statement = this.tracker.Trace('unlocked',this.AlternativeType[type],alternativeId);
        statement.setResponse(optionId);
        return statement;
    }

    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const ALTERNATIVETYPE = Object.freeze({
    QUESTION: 0,
    MENU: 1,
    DIALOG: 2,
    PATH: 3,
    ARENA: 4,
    ALTERNATIVE: 5
});

class GameObjectTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;

    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    Interacted(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('interacted',this.GameObjectType[type],gameobjectId);
        return statement;
    }

    Used(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        var statement = this.tracker.Trace('used',this.GameObjectType[type],gameobjectId);
        return statement;
    }
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});

class ScormTracker {
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    tracker;
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];

    Initialized(scoId) {
        var statement = this.tracker.Trace('initialized', 'SCO', scoId);
        return statement;
    }

    Suspended(scoId) {
        var statement = this.tracker.Trace('suspended', 'SCO', scoId);
        return statement;
    }

    Resumed(scoId) {
        var statement = this.tracker.Trace('resumed', 'SCO', scoId);
        return statement;
    }

    Terminated(scoId) {
        var statement = this.tracker.Trace('terminated', 'SCO', scoId);
        return statement;
    }

    Passed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        var statement = this.tracker.Trace('passed',this.ScormType[type],activityId);
        return statement;
    }

    Failed(activityId, type) {
        if (typeof type === 'undefined') {type = 0;}

        var statement = this.tracker.Trace('failed',this.ScormType[type],activityId);
        return statement;
    }

    Scored(activityId, type, score) {
        if (typeof type === 'undefined') {type = 0;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('scored',this.ScormType[type],activityId);
        statement.setScore(score);
        return statement;
    }

    Completed(activityId, type, success, completion, score) {
        if (typeof type === 'undefined') {type = 0;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        var statement = this.tracker.Trace('completed',this.ScormType[type],activityId);
        statement.setSuccess(success);
        statement.setCompletion(completion);
        statement.setScore(score);
        return statement;
    }
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const SCORMTYPE = Object.freeze({
    SCO: 0,
    COURSE: 1,
    MODULE: 2,
    ASSESSMENT: 3,
    INTERACTION: 4,
    OBJECTIVE: 5,
    ATTEMPT: 6
});

class JSTracker {
    static ACCESSIBLETYPE=ACCESSIBLETYPE;
    static COMPLETABLETYPE=COMPLETABLETYPE;
    static ALTERNATIVETYPE=ALTERNATIVETYPE;
    static GAMEOBJECTTYPE=GAMEOBJECTTYPE;
    static SCORMTYPE=SCORMTYPE;

    tracker;
    accessibleTracker;
    completableTracker;
    alternativeTracker;
    gameObjectTracker;
    scormTracker;

    constructor(result_uri=null, backup_uri=null, backup_type=null, actor_homepage=null, actor_username=null, auth_token=null,  default_uri=null, debug=null) {
        this.tracker=new xAPITrackerAsset(result_uri, backup_uri, backup_type, actor_homepage, actor_username, auth_token,  default_uri, debug);
        this.accessibleTracker=new AccessibleTracker(this.tracker);
        this.completableTracker=new CompletableTracker(this.tracker);
        this.alternativeTracker=new AlternativeTracker(this.tracker);
        this.gameObjectTracker=new GameObjectTracker(this.tracker);
        this.scormTracker=new ScormTracker(this.tracker);
    }

    generateXAPITrackerFromURLParams(default_uri) {
        const xAPIConfig = {};
        const urlParams = new URLSearchParams(window.location.search);
        var result_uri,backup_uri, backup_type, actor_username, actor_homepage, debug, batchLength, batchTimeout, maxRetryDelay;
        var username, password, auth_token;
        if(urlParams.size > 0) {
            //RESULT URI
            result_uri = urlParams.get('result_uri');

            //BACKUP URI
            backup_uri=urlParams.get('backup_uri');
            backup_type=urlParams.get('backup_type');
        
            //ACTOR DATA
            actor_homepage = urlParams.get('actor_homepage');
            actor_username = urlParams.get('actor_user');
            
            //SSO OAUTH 2.0 DATA
            const sso_token_endpoint = urlParams.get('sso_token_endpoint');
            if(sso_token_endpoint) {
                xAPIConfig.token_endpoint=sso_token_endpoint;
            }
            const sso_client_id = urlParams.get('sso_client_id');
            if(sso_client_id) {
                xAPIConfig.client_id=sso_client_id;
            }
            const sso_login_hint = urlParams.get('sso_login_hint');
            if(sso_login_hint) {
                xAPIConfig.login_hint=sso_login_hint;
            }
            const sso_grant_type = urlParams.get('sso_grant_type');
            if(sso_grant_type) {
                xAPIConfig.grant_type=sso_grant_type;
            }
            const sso_scope = urlParams.get('sso_scope');
            if(sso_scope) {
                xAPIConfig.scope=sso_scope;
            }
            const sso_username = urlParams.get('sso_username');
            if(sso_username) {
                xAPIConfig.username=sso_username;
            }
            const sso_password = urlParams.get('sso_password');
            if(sso_password) {
                xAPIConfig.password=sso_password;
            } else {
                if(sso_username) {
                    xAPIConfig.password=sso_username;
                }
            }

            // OAUTH 1.0 DATA 
            username = urlParams.get('username');
            password = urlParams.get('password');
            // OAUTH 0 : VIA AUTHTOKEN DIRECTLY NOT RECOMENDED
            auth_token = urlParams.get('auth_token');
            // DEBUG 
            debug=urlParams.get('debug');
            // BATCH
            batchLength=urlParams.get('batch_length');
            batchTimeout=urlParams.get('batch_timeout');
            maxRetryDelay=urlParams.get('max_retry_delay');
            if(debug !== null && debug == "true") {
                debug = Boolean(debug);
                console.debug(result_uri);
                console.debug(result_uri);
                console.debug(backup_type);
                console.debug(actor_username);
                console.debug(actor_homepage);
                console.debug(debug);
                console.debug(batchLength);
                console.debug(batchTimeout);
                console.debug(maxRetryDelay);
                //console.debug(xAPIConfig);
            }
        } else {
            result_uri = null;
            result_uri = null;
            backup_type="XAPI";
            actor_homepage= null;
            actor_username= null;
            debug = false;
        }

        if(xAPIConfig.token_endpoint) {
            this.tracker=new xAPITrackerAssetOAuth2(result_uri, backup_uri, backup_type, actor_homepage, actor_username, xAPIConfig,  default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        } else if(username && password) {
            this.tracker=new xAPITrackerAssetOAuth1(result_uri, backup_uri, backup_type, actor_homepage, actor_username, username, password, default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        } else {
            this.tracker=new xAPITrackerAsset(result_uri, backup_uri, backup_type, actor_homepage, actor_username, auth_token,  default_uri, debug, batchLength, batchTimeout, maxRetryDelay);
        }
        this.accessibleTracker=new AccessibleTracker(this.tracker);
        this.completableTracker=new CompletableTracker(this.tracker);
        this.alternativeTracker=new AlternativeTracker(this.tracker);
        this.gameObjectTracker=new GameObjectTracker(this.tracker);
        this.scormTracker=new ScormTracker(this.tracker);
    }
}

export { JSTracker as default };
