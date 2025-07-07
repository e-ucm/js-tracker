'use strict';

var XAPI = require('@xapi/xapi');
var uuid = require('uuid');
var axios = require('axios');
var ms = require('ms');

/**
 * Actor Class of a Statement
 */
class ActorStatement {
    /**
     * Actor constructor
     * @param {string} accountName account name
     * @param {string} homepage account homepage 
     */
    constructor(accountName, homepage) {
        this.accountName = accountName;
        this.homepage = homepage;
    }

    /**
     * Account name
     * @type {string}
     */
    accountName;

    /**
     * Account homePage
     * @type {string}
     */
    homepage;

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        return {
            account: {
                name: this.accountName,
                homePage: this.homepage
            }
        };
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.accountName.replaceAll(',', '\\,') ;
    }
}

/**
 * The Context Class of a Statement
 */
class ContextStatement {
    /**
     * Constructor of the ContextStatement class
     * 
     * @param {*} categoryId category Id of context
     * @param {*} registrationId registration id of context
     */
    constructor(categoryId="seriousgame", registrationId=null) {
        if(registrationId != null) {
            this.registration=registrationId;
        } else {
            this.registration=uuid.v4();
        }
        this.categoryId=this.categoryIDs[categoryId];
        this.category=categoryId;
    }
    /** 
     * Registration Id of the Context
     * 
     * @type {string}
     */
    registration;

    /**
     * The category IDs list
     */
    categoryIDs = {
        seriousgame : 'https://w3id.org/xapi/seriousgame',
        scorm: 'https://w3id.org/xapi/scorm'
    };
    
    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
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

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }
}

/**
 * The Verb Class  of a Statement
 */
class VerbStatement {
    /**
     * Constructor of VerbStatement class
     * 
     * @param {string} verbDisplay The verb display id of the statement
     */
    constructor(verbDisplay) {
        this.verbId = this.verbIds[verbDisplay];
        this.verbDisplay = verbDisplay;
    }
    
    /**
     * The Verb Ids array
     */
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
    /**
     * The Verb Id 
     * @type {string}
     */
    verbId;

    /**
     * The Verb display 
     * @type {string}
     */
    verbDisplay;

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
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

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.verbId;
    }
}

/**
 * The Object Class of a Statement
 */
class ObjectStatement {
    /**
     * The constructor of the ObjectStatement class
     * 
     * @param {string} id the id of the object
     * @param {string} type the type of the object
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id, type, name = null, description = null) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
    }
    
    /**
     * The Type IDs list for Objects
     */
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

    /**
     * The Extensions IDs for Objects
     */
    ExtensionIDs = {
      extended_interaction_type: "https://w3id.org/xapi/netc-assessment/extensions/activity/extended-interaction-type",
    };

    /**
     * The ID of the Object
     * 
     * @type {string}
     */
    id;
    /**
     * The type of the Object
     * 
     * @type {string}
     */
    type;
    /**
     * The name of the Object
     * 
     * @type {string}
     */
    name;
    /**
     * The description of the Object
     * 
     * @type {string}
     */
    description;

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
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

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.typeIds[this.type].replaceAll(',','\\,') + ',' + this.id.replaceAll(',', '\\,');
    }
}

/**
 * The Result Class of a Statement
 */
class ResultStatement {
    /**
     * Constructor of the ResultStatement class
     * 
     * @param {string} defautURI The default URI for the extensions
     */
    constructor(defautURI) {
        this.defautURI = defautURI;
        this.Score = null;
        this.Success = null;
        this.Completion = null;
        this.Response = null;
        this.Duration = null;
        this.Extensions = {};
    }

    /**
     * The ID of the Result
     * 
     * @type {string}
     */
    defautURI;

    /**
     * The Score of the Result
     * 
     * @type {Object}
     */
    Score;
    /**
     * The success status of the Result
     * 
     * @type {boolean}
     */
    Success;
    /**
     * The Completion status of the Result
     * 
     * @type {boolean}
     */
    Completion;
    /**
     * The response of the Result
     * 
     * @type {string}
     */
    Response;
    /**
     * The duration of the Result
     * 
     * @type {string}
     */
    Duration;
    /**
     * The Extensions of the Result
     * 
     * @type {Object}
     */
    Extensions;

    /**
     * Check if the result is empty or not
     * @returns {boolean}
     */
    isEmpty() {
        return (this.Score == null) && (this.Duration == null) && (this.Success == null) && (this.Completion == null) && (this.Response == null) && (Object.keys(this.Extensions).length == 0);
    }

    /**
     * The possible extensions of a result statement
     */
    ExtensionIDs = {
        health: 'https://w3id.org/xapi/seriousgames/extensions/health',
        position: 'https://w3id.org/xapi/seriousgames/extensions/position',
        progress: 'https://w3id.org/xapi/seriousgames/extensions/progress',
        interactionID: 'https://w3id.org/xapi/netc-assessment/extensions/activity/id-number',
        response_explanation: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-explanation',
        response_type: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-type',
    };

    /**
     * The Score Keys for the result
     */
    ScoreKey = ["raw", "min", "max", "scaled"];

    /**
     * Set extensions from list
     * @param {Object} extensions extension list
     */
    setExtensions(extensions) {
        this.Extensions = {};
        for (var key in extensions) {
            this.setExtension(key,extensions[key]);
        }
    }

    /**
     * Set result extension for key value
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    setExtension(key, value) {
        switch (key.toLowerCase()) {
            case 'success': { this.Success = value; break; }
            case 'completion': { this.Completion = value; break; }
            case 'response': { this.Response = value; break; }
            case 'score': { this.Score = this.setScoreValue("raw", value); break; }
            case 'duration': { this.Duration = value; break; }
            default: { this.Extensions[key] = value; break; }
        }
    }

    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns {String}
     */
    setAsUri(id) {
        if(this.isUri(id)) {
            return id;
        } else {
            return `${this.defautURI}://${id}`;
        }
    }
    
    /**
     * Check if the string is an URI
     * @param {string} id 
     * @returns {boolean}
     */
    isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    /**
     * Set the score of the statement
     * @param {string} key the key for the score 
     * @param {number} value the score 
     */
    setScoreValue(key, value) {
        if(! this.Score) {
            this.Score = {};
        }
        if(this.ScoreKey.includes(key)) {
            this.Score[key] = Number(value);
        }    
    }

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
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
    
    /**
     * convert to CSV
     * 
     * @returns {String}
     */
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

/**
 * Get the size of the object
 * @param {Object} obj the object to get the size
 * @returns {number}
 */
var obsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

/**
 * Check if is map
 * @param {Object} obj the object to check
 * @returns {boolean}
 */
var ismap = function(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            return false;
        }
    }
    return true;
};

/**
 * Check if exist
 * @param {Object} value the object to check
 * @returns {boolean}
 */
var exists = function(value) {
    return !(typeof value === 'undefined' || value === null);
};

/**
* Statement class
*/
class Statement {
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {string} verbId verb id of the statement
     * @param {string} objectId object id of the statement
     * @param {string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor, verbId, objectId, objectType, context, defaultURI) {
        this.id = uuid.v4();
        this.actor = actor;
        this.verb = new VerbStatement(verbId);
        this.defaultURI = defaultURI;
        this.object = new ObjectStatement(this.setAsUri(objectId), objectType);
        this.timestamp = new Date();
        this.context = context;
        this.version = "1.0.3";
        this.result = new ResultStatement(this.defaultURI);
    }
    /**
     * Id of the statement
     * @type {string}
     */
    id;
    /**
     * Version of the statement
     * @type {string}
     */
    version;
    /**
     * default URI of the statement
     * @type {string}
     */
    defaultURI;
    /**
     * Actor of the statement
     * @type {ActorStatement}
     */
    actor;
    /**
     * Verb of the statement
     * @type {VerbStatement}
     */
    verb;
    /**
     * Object of the statement
     * @type {ObjectStatement}
     */
    object;
    /**
     * Timestamp of the statement
     * @type {Date}
     */
    timestamp;
    /**
     * Context of the statement
     * @type {ContextStatement}
     */
    context;
    /**
     * Result of the statement
     * @type {ResultStatement}
     */
    result;

    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns {String}
     */
    setAsUri(id) {
        if(this.isUri(id)) {
            return id;
        } else {
            return `${this.defaultURI}://${id}`;
        }
    }
    
    /**
     * Check if the string is an URI
     * @param {string} id 
     * @returns {boolean}
     */
    isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    /**
     * Set the score of the statement
     * @param {number} raw the raw score
     * @param {number} min the min score
     * @param {number} max the max score
     * @param {number} scaled the scaled score
     */
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

    /**
     * Set the raw score of the statement
     * @param {number} raw the raw score 
     */
    setScoreRaw(raw) {
        this.result.setScoreValue('raw', raw);
    }
    
    /**
     * Set the min score of the statement
     * @param {number} min the min score 
     */
    setScoreMin(min) {
        this.result.setScoreValue('min', min);
    }

    /**
     * Set the max score of the statement
     * @param {number} max the max score 
     */
    setScoreMax(max) {
        this.result.setScoreValue('max', max);
    }

    /**
     * Set the scaled score of the statement
     * @param {number} scaled the scaled score 
     */
    setScoreScaled(scaled) {
        this.result.setScoreValue('scaled', scaled);
    }

    /**
     * Set completion status of the statement
     * @param {boolean} value the completion status
     */
    setCompletion(value) {
        this.addResultExtension('completion', value);
    }

    /**
     * Set success status of the statement
     * @param {boolean} value the success status
     */
    setSuccess(value) {
        this.addResultExtension('success', value);
    }

    /**
     * Set duration of the statement
     * @param {number} diffInSeconds the duration in second
     */
    setDuration(diffInSeconds) {
        const seconds = diffInSeconds % 60;
        const minutes = Math.floor(diffInSeconds / 60) % 60;
        const hours = Math.floor(diffInSeconds / 3600) % 24;
        const days = Math.floor(diffInSeconds / 86400);

        // Construct the ISO 8601 duration string
        const isoDuration = `P${days}DT${hours}H${minutes}M${seconds}S`;
        this.addResultExtension('duration', isoDuration);
    }

    /**
     * Set response of the statement
     * @param {string} value the response
     */
    setResponse(value) {
        this.addResultExtension('response', value);
    }

    /**
     * Set progress status of the statement
     * @param {number} value the progress status
     */
    setProgress(value) {
        this.addResultExtension('progress', value);
    }

    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {string} value the value of the extension
     */
    setVar(key,value) {
        this.addResultExtension(key,value);
    }

    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    addResultExtension(key,value) {
        this.result.setExtension(key, value);
    }

    /**
     * Set result extension as Object key/values of the statement
     * @param {Object} extensions extensions list
     */
    addResultExtensions(extensions) {
        this.result.setExtensions(extensions);
    }

    /**
     * Convert to xAPI format
     * @returns {Object}
     */
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

    /**
     * Convert to CSV format
     * 
     * @returns {String}
     */
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

// ------------------------------------------------------------------
// 1) THE BUILDER


// ------------------------------------------------------------------
/**
 * Statement Builder Class
 */
class StatementBuilder {
  /**
   * XAPI Client 
   * @type {xAPITrackerAsset}
   */
    client;

    /**
     * Statement
     * @type {Statement}
     */
    statement;

    /**
     * Promise
     * @type {Promise<void>}
     */
    _promise;

  /**
   * @param  {xAPITrackerAsset} xapiClient  any client that has a `.sendStatement(statement)` → Promise
   * @param  {Statement} initial     a partial Statement (actor, verb, object…)
   */
  constructor(xapiClient, initial) {
    this.client    = xapiClient;
    this.statement = initial;
    this._promise = Promise
      .resolve()
      .then(() => this.client.enqueue(this.statement));
  }

  // RESULT
  /**
   * Set success to statemement
   * @param {boolean} success 
   * @returns {this} Returns the current instance for chaining
   */
  withSuccess(success) {
    this.statement.setSuccess(success);
    return this;
  }

/**
 * Sets score-related properties
 * @param {Partial<{raw: number; min: number; max: number; scaled: number}>} score - Score configuration
 * @returns {this} Returns the current instance for chaining
 */
  withScore(score) {
    this.statement.setScore(
      score.raw ?? score?.raw, 
      score.min ?? score?.min,
      score.max ?? score?.max,
      score.scaled ?? score?.scaled
    );
    return this;
}
  /**
   * Set raw score to statemement
   * @param {number} raw the raw score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreRaw(raw) {
    this.statement.setScoreRaw(raw);
    return this;
  }
  /**
   * Set min score to statemement
   * @param {number} min the min score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreMin(min) {
    this.statement.setScoreMin(min);
    return this;
  }
  /**
   * Set max score to statemement
   * @param {number} max the max score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreMax(max) {
    this.statement.setScoreMax(max);
    return this;
  }
  /**
   * Set scaled score to statemement
   * @param {number} scaled the scaled score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreScaled(scaled) {
    this.statement.setScoreScaled(scaled);
    return this;
  }

  /**
   * Set completion status to statement
   * @param {boolean} value completion status of statement
   * @returns {this} Returns the current instance for chaining
   */
  withCompletion(value) {
    this.statement.setCompletion(value);
    return this;
  }

  /**
   * Set duration to statement
   * @param {number} diffInSeconds duration in sec of statement
   * @returns {this} Returns the current instance for chaining
   */
  withDuration(diffInSeconds) {
    this.statement.setDuration(diffInSeconds);
    return this;
  }

  /**
   * Set response to statement
   * @param {string} value response of statement
   * @returns {this} Returns the current instance for chaining
   */
  withResponse(value) {
    this.statement.setResponse(value);
    return this;
  }

  /**
   * Set progress to statement
   * @param {number} value progress of statement
   * @returns {this} Returns the current instance for chaining
   */
  withProgress(value) {
    this.statement.setProgress(value);
    return this;
  }

  /**
   * Add result extension to statement
   * @param {string} key key of the result extension
   * @param {*} value value of the result extension
   * @returns {this} Returns the current instance for chaining
   */
  
  withResultExtension(key, value) {
    this.statement.addResultExtension(key, value);
    return this;
  }

  /**
     * Set result extensions as Object key/values list of the statement
     * @param {Object} extensions extensions list
     */
  withResultExtensions(extensions = {}) {
    this.statement.addResultExtensions(extensions);
    return this;
  }

  /**
   * let me run any function on the statement
   * fn can either mutate `stmt` in‐place, or return a brand new statement
   * Applies a function to the statement
   * @param {(statement: Statement) => Statement} fn - Function to apply to statement
   * @returns {this} Returns the current instance for chaining
   */
  apply(fn) {
    const result = fn(this.statement);
    // if your fn returns a new statement, pick that up, otherwise
    // assume it has mutated in place
    if (result instanceof Statement) {
      this.statement = result;
    }
    return this;
  }

  //— make this builder awaitable (thenable) ————————————————————————
  /**
   * 
   * @param {*} onFulfilled
   * @param {*} onRejected 
   * @returns {Promise<void>}
   */
  then(onFulfilled, onRejected) {
    return this._promise.then(onFulfilled, onRejected)
  }

  /**
   * 
   * @param {*} onRejected 
   * @returns {Promise<void>}
   */
  catch(onRejected) {
    return this._promise.catch(onRejected)
  }

  /**
   * 
   * @param {*} onFinally 
   * @returns {Promise<void>}
   */
  finally(onFinally) {
    return this._promise.finally(onFinally)
  }
}

/**
 * XAPI Tracker Asset Class
 * Handles xAPI tracking with batch processing, retry logic, and backup capabilities
 */
class xAPITrackerAsset {
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

/**
 * A specialized tracker asset that implements OAuth1 authentication.
 * Extends the base xAPITrackerAsset with basic authentication capabilities.
 */
class xAPITrackerAssetOAuth1 extends xAPITrackerAsset {
    /**
     * Creates an instance of xAPITrackerAssetOAuth1.
     * @param {object} opts options for the xapi Tracker asset
     * @param {string} opts.endpoint - Primary API endpoint (required)
     * @param {string} opts.actor_homePage - Home page URL of the actor (required)
     * @param {string} opts.actor_name - Name of the actor (required)
     * @param {string} opts.username - Username for authentication (required)
     * @param {string} opts.password - Password for authentication (required)
     * @param {string} opts.default_uri - Default URI for requests (required)
     * 
     * @param {string} [opts.backup_endpoint=null] - Backup API endpoint (optional)
     * @param {string} [opts.backup_type='XAPI'] - Type of backup endpoint (optional)
     * @param {boolean} [opts.debug=false] - Debug mode flag (optional)
     * @param {number} [opts.batchLength=null] - Batch length for requests (optional)
     * @param {number} [opts.batchTimeout=null] - Batch timeout in milliseconds (optional)
     * @param {number} [opts.maxRetryDelay=null] - Maximum retry delay in milliseconds (optional)
     */
    constructor({endpoint, actor_homePage, actor_name, default_uri, username, password, backup_endpoint=null, backup_type="XAPI", debug=null, batchLength=null, batchTimeout=null, maxRetryDelay=null}) {
        super({endpoint:endpoint, backup_endpoint:backup_endpoint, backup_type:backup_type, actor_homePage:actor_homePage, actor_name:actor_name, auth_token:XAPI.toBasicAuth(username, password), default_uri:default_uri, debug:debug, batchLength:batchLength, batchTimeout:batchTimeout, maxRetryDelay:maxRetryDelay});

        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    /**
     * Refreshes the authentication token.
     * Delegates to the parent class implementation.
     *
     * @returns {Promise<void>} A promise that resolves when the refresh is complete
     */
    async refreshAuth() {
        super.refreshAuth();
    }

    /**
     * Logs out the current session.
     * Delegates to the parent class implementation.
     */
    logout() {
        super.logout();
    }
}

/**
 * A class that implements OAuth 2.0 protocol for authentication and token management.
 * Supports various grant types including password and refresh_token flows.
 */
class OAuth2Protocol {
  /**
   * Error message template for missing required fields.
   * @type {string}
   */
  fieldMissingMessage;

  /**
   * Error message template for unsupported grant types.
   * @type {string}
   */
  unsupportedGrantTypeMessage;

  /**
   * Error message template for unsupported PKCE methods.
   * @type {string}
   */
  unsupportedCodeChallengeMethodMessage;

  /**
   * The authorization endpoint URL.
   * @type {string|null}
   */
  authEndpoint = null;

  /**
   * The token endpoint URL.
   * @type {string|null}
   */
  tokenEndpoint = null;

  /**
   * The OAuth2 grant type being used.
   * @type {string|null}
   */
  grantType = null;

  /**
   * The username for authentication.
   * @type {string|null}
   */
  username = null;

  /**
   * The password for authentication.
   * @type {string|null}
   */
  password = null;

  /**
   * The client identifier.
   * @type {string|null}
   */
  clientId = null;

  /**
   * The requested scope of access.
   * @type {string|null}
   */
  scope = null;

  /**
   * The state parameter for CSRF protection.
   * @type {string|null}
   */
  state = null;

  /**
   * The login hint for authentication.
   * @type {string|null}
   */
  login_hint = null;

  /**
   * The PKCE code challenge method.
   * @type {string|null}
   */
  codeChallengeMethod = null;

  /**
   * The current authentication token.
   * @type {Object|null}
   */
  token = null;

  /**
   * Flag indicating if a token refresh is currently in progress.
   * @type {boolean}
   */
  tokenRefreshInProgress = false;

  /**
   * Callback function for token updates.
   * @type {Function|null}
   */
  onAuthorizationInfoUpdate = null;

  /**
   * Creates an instance of OAuth2Protocol.
   * Initializes error messages and default property values.
   */
  constructor() {
    this.fieldMissingMessage = 'Field "{0}" required for "OAuth 2.0" authentication is missing!';
    this.unsupportedGrantTypeMessage = 'Grant type "{0}" not supported. Please use either "code" type or "password" type.';
    this.unsupportedCodeChallengeMethodMessage = 'Code challenge (PKCE) method "{0}" not supported. Please use "S256" method or disable it.';
  }

  /**
   * Initializes the OAuth2 protocol with the provided configuration.
   *
   * @param {Object} config - Configuration object containing OAuth2 parameters
   * @param {string} config.token_endpoint - The token endpoint URL
   * @param {string} config.grant_type - The grant type (password, refresh_token, etc.)
   * @param {string} config.client_id - The client ID
   * @param {string} [config.scope] - Optional scope
   * @param {string} [config.state] - Optional state
   * @param {string} [config.code_challenge_method] - Optional PKCE code challenge method
   * @param {string} [config.username] - Username for password grant type
   * @param {string} [config.password] - Password for password grant type
   * @param {string} [config.refresh_token] - Refresh token for refresh_token grant type
   * @param {string} [config.login_hint] - Login hint for password grant type
   * @returns {Promise<void>}
   * @throws {Error} If required configuration values are missing or grant type is unsupported
   */
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
          this.login_hint,
          this.scope,
          this.state,
        );
        break;
      default:
        throw new Error(this.unsupportedGrantTypeMessage.replace('{0}', this.grantType));
    }

    if (this.token) {
      console.log("[OAuth2] Token obtained: " + this.token.access_token);
    }
  }

  /**
   * Retrieves a required value from the configuration object.
   *
   * @param {Object} config - The configuration object
   * @param {string} key - The key of the required value
   * @returns {*} The value associated with the key
   * @throws {Error} If the required value is missing
   */
  getRequiredValue(config, key) {
    if (!config[key]) {
      throw new Error(this.fieldMissingMessage.replace('{0}', key));
    }
    return config[key];
  }

  /**
   * Performs the Resource Owner Password Credentials flow.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} username - The username
   * @param {string} password - The password
   * @param {string} [scope] - Optional scope
   * @param {string} [state] - Optional state
   * @param {string} login_hint - The login hint
   * @returns {Promise<Object>} The token response
   */
  async doResourceOwnedPasswordCredentialsFlow(tokenUrl, clientId, username, password, login_hint, scope, state) {
    const form = {
      username,
      password,
      login_hint
    };
    if(scope) {
      form.scope = scope;
    }
    if(state) {
      form.state = state;
    }
    return await this.doTokenRequest(tokenUrl, clientId, "password", form);
  }

  /**
   * Makes a token request to the OAuth2 token endpoint.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} grantType - The grant type
   * @param {Object} otherParams - Additional parameters to include in the request
   * @returns {Promise<Object>} The token response
   * @throws {Error} If the token request fails
   */
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

  /**
   * Performs a refresh token request.
   *
   * @param {string} tokenUrl - The token endpoint URL
   * @param {string} clientId - The client ID
   * @param {string} refreshToken - The refresh token
   * @returns {Promise<Object>} The new token response
   */
  async doRefreshToken(tokenUrl, clientId, refreshToken) {
    return await this.doTokenRequest(tokenUrl, clientId, "refresh_token", { refresh_token: refreshToken });
  }

  /**
   * Refreshes the current access token using the refresh token.
   *
   * @returns {Promise<string>} The new access token
   */
  async refreshToken() {
    if(this.tokenRefreshInProgress == false) {
      try {
        this.tokenRefreshInProgress = true;
        this.token = await this.doRefreshToken(this.tokenEndpoint, this.clientId, this.token.refresh_token);
        this.tokenRefreshInProgress = false;
        return this.token.access_token;
      } catch(error) {
        this.tokenRefreshInProgress = false;
        console.error(error);
      }
    } else {
      while(this.tokenRefreshInProgress == true) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  /**
   * Checks if the current token has expired.
   *
   * @returns {boolean} True if the token has expired, false otherwise
   */
  hasTokenExpired() {
    let expiredTime = new Date(this.token.requestTime.getTime() + this.token.expires_in*1000);
    let now = new Date();
    if(expiredTime > now) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Updates the request with the current authorization token.
   * Refreshes the token if it has expired.
   *
   * @param {Object} request - The request object to update
   * @returns {Promise<void>}
   */
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

  /**
   * Registers a callback function to be called when authorization information is updated.
   *
   * @param {Function} callback - The callback function to register
   */
  registerAuthInfoUpdate(callback) {
    if (callback) {
      this.onAuthorizationInfoUpdate = callback;
      if (this.token) {
        callback(this.token);
      }
    }
  }

  /**
   * Logs out the current session by invalidating the refresh token.
   *
   * @returns {Promise<void>}
   * @throws {Error} If the logout request fails
   */
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

/**
 * A specialized tracker asset that implements OAuth2 authentication.
 * Extends the base xAPITrackerAsset with OAuth2 capabilities.
 */
class xAPITrackerAssetOAuth2 extends xAPITrackerAsset {
    /**
     * Configuration object for OAuth2 authentication
     * @type {Object}
     */
    oauth2Config;

    /**
     * Instance of OAuth2Protocol handling authentication
     * @type {OAuth2Protocol|null}
     */
    oauth2 = null;

    /**
     * Creates an instance of xAPITrackerAssetOAuth2.
     * @param {object} opts options for the xapi Tracker asset
     * @param {string} opts.endpoint - Primary API endpoint (required)
     * @param {string} opts.actor_homePage - Home page URL of the actor (required)
     * @param {string} opts.actor_name - Name of the actor (required)
     * @param {Object} opts.config - OAuth2 configuration (required)
     * @param {string} opts.default_uri - Default URI for requests (required)
     * 
     * @param {string} [opts.backup_endpoint=null] - Backup API endpoint (optional)
     * @param {string} [opts.backup_type='XAPI'] - Type of backup endpoint (optional)
     * @param {boolean} [opts.debug=false] - Debug mode flag (optional)
     * @param {number} [opts.batchLength=null] - Batch length for requests (optional)
     * @param {number} [opts.batchTimeout=null] - Batch timeout in milliseconds (optional)
     * @param {number} [opts.maxRetryDelay=null] - Maximum retry delay in milliseconds (optional)
     */
    constructor({endpoint, actor_homePage, actor_name, config,  default_uri, backup_endpoint=null, backup_type='XAPI', debug=false, batchLength=null, batchTimeout=null, maxRetryDelay=null}) {
        // Call the parent constructor without the token (since we don't have it yet)
        super({endpoint:endpoint, backup_endpoint:backup_endpoint, backup_type:backup_type, actor_homePage:actor_homePage, actor_name:actor_name,default_uri:default_uri, debug:debug, batchLength:batchLength, batchTimeout:batchTimeout, maxRetryDelay:maxRetryDelay});

        this.oauth2Config = config;
        this.oauth2 = null;

        // Fetch token after object construction
        this.initAuth();

        window.addEventListener('beforeunload', () => {
            if (this.auth_token) {
                this.logout();
            }
        });
    }

    /**
     * Retrieves an OAuth2 access token.
     *
     * @returns {Promise<string|null>} The access token or null if failed
     */
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

    /**
     * Initializes authentication by obtaining and setting the OAuth2 token.
     *
     * @returns {Promise<void>}
     */
    async initAuth() {
        const oAuth2Token = await this.getToken();
        if(oAuth2Token !== null) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    /**
     * Refreshes the OAuth2 authentication token.
     *
     * @returns {Promise<void>}
     */
    async refreshAuth() {
        const oAuth2Token = await this.oauth2.refreshToken();
        if(oAuth2Token) {
            this.auth_token = "Bearer " + oAuth2Token;
            console.debug(this.auth_token);
            // Now that we have the token, update the authorization in the super class
            this.updateAuth();
        }
    }

    /**
     * Updates the authentication in the parent class.
     */
    updateAuth() {
        // Update the authorization or reinitialize xAPITrackerAsset with the token
        super.updateAuth();
    }

    /**
     * Logs out the current session by invalidating the token.
     *
     * @returns {Promise<void>}
     */
    async logout() {
        await this.oauth2.logout();
        // logout
        super.logout();
    }
}

/**
 * Accessible Tracker
 */
class AccessibleTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {number} type the type of the accessible object
     */
    constructor(tracker, id, type=ACCESSIBLETYPE.ACCESSIBLE) {
        this.accessibleId=id;
        this.type=type;
        this.tracker = tracker;
    }
    /**
     * the id of the accessible object
     * @type {string}
     */
    accessibleId;
    /**
     * the type of the accessible object
     * @type {number}
     */
    type;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the accessible object
     * @type {Array}
     */
    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    Accessed() {
        return this.tracker.Trace('accessed',this.AccessibleType[this.type],this.accessibleId);
    }

    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    Skipped() {
        return this.tracker.Trace('skipped',this.AccessibleType[this.type],this.accessibleId);
    }
}

/**
 * the list of types possible for the accessible object
 */
const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});

/**
 * Completable Tracker
 */
class CompletableTracker {
    /**
     * Constructor of completable tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the completable object
     * @param {number} type the type of the completable object
     */
    constructor(tracker, id, type=COMPLETABLETYPE.COMPLETABLE) {
        this.completableId=id;
        this.type=type;
        this.tracker = tracker;
    }

    /**
     * the id of the completable object
     * @type {string}
     */
    completableId;

    /**
     * the type of the completable object
     * @type {number}
     */
    type;

    /**
     * the tracker of the completable object
     * @type {xAPITrackerAsset}
     */
    tracker;

    /**
     * the list of types possible for the completable object
     * @type {Array}
     */
    CompletableType = ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable'];

    /**
     * is initialized
     * @type {boolean}
     */
    initialized;

    /**
     * Initialized Time
     * @type {Date}
     */
    initializedTime;


    /**
     * Send Initialized statement
     * @returns {StatementBuilder}
     */
    Initialized() {
        var addInitializedTime = true;
        if(this.initializedTime) {
            if (this.tracker.debug) {
                throw new Error("The initialized statement for the specified id has already been sent!");
            } else {
                console.warn("The initialized statement for the specified id has already been sent!");
                addInitializedTime = false;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.initialized=false;
        }
        return this.tracker.Trace('initialized',this.CompletableType[this.type],this.completableId);
    }

    /**
     * Send Progressed statement
     * @param {number} progress the progress of the completable object
     * @returns {StatementBuilder}
     */
    Progressed(progress) {
        return this.tracker.Trace('progressed',this.CompletableType[this.type],this.completableId)
            .withProgress(progress);
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the completable object
     * @param {boolean} completion the completion status of the completable object
     * @param {number} score the score of the completable object
     * @returns {StatementBuilder}
     */
    Completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        if(!this.initialized) {
            if (this.tracker.debug) {
                throw new Error("You need to send a initialized statement before sending an Completed statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Completed statement!");
                return;
            }
        }
        let actualDate=new Date();
        var duration = actualDate.getTime()-this.initializedTime.getTime();
        this.initialized=false;

        return this.tracker.Trace('completed',this.CompletableType[this.type],this.completableId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(duration);
    }
}

/**
 * the list of types possible for the completable object
 */
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

/**
 * Accessible Tracker
 */
class AlternativeTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {number} type the type of the accessible object
     */
    constructor(tracker, id, type=ALTERNATIVETYPE.ALTERNATIVE) {
        this.alternativeId=id;
        this.type=type;
        this.tracker = tracker;
    }
    /**
     * the id of the alternative object
     * @type {string}
     */
    alternativeId;
    /**
     * the type of the alternative object
     * @type {number}
     */
    type;
    /**
     * the tracker of the alternative object
     * @type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the alternative object
     * @type {Array}
     */
    AlternativeType = ['question', 'menu', 'dialog', 'path', 'arena', 'alternative'];

    /**
     * Send selected statement
     * @param {string} optionId the optionId of the selected statement
     * @returns {StatementBuilder}
     */
    Selected(optionId) {        
        return this.tracker.Trace('selected',this.AlternativeType[this.type],this.alternativeId)
            .withResponse(optionId);
    }

    /**
     * Send unlocked statement
     * @param {string} optionId the optionId of the Unlocked statement
     * @returns {StatementBuilder}
     */
    Unlocked(optionId) {
        return this.tracker.Trace('unlocked',this.AlternativeType[this.type],this.alternativeId)
                .withResponse(optionId);
    }
}

/**
 * the list of types possible for the alternative object
 */
const ALTERNATIVETYPE = Object.freeze({
    QUESTION: 0,
    MENU: 1,
    DIALOG: 2,
    PATH: 3,
    ARENA: 4,
    ALTERNATIVE: 5
});

/**
 * Game Object Tracker
 */
class GameObjectTracker {
    /**
     * Constructor of Game Object tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Game Object object
     * @param {number} type the type of the Game Object object
     */
    constructor(tracker,id, type=GAMEOBJECTTYPE.GAMEOBJECT) {
        this.gameobjectId=id;
        this.type=type;
        this.tracker = tracker;
    }
    /**
     * the id of the Game Object object
     * @type {string}
     */
    gameobjectId;
    /**
     * the type of the Game Object object
     * @type {number}
     */
    type;
    /**
     * the tracker of the Game Object object
     * @type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the Game Object object
     * @type {Array}
     */
    GameObjectType = ['enemy', 'npc', 'item', 'gameobject'];

    /**
     * Send Interacted statement
     * @returns {StatementBuilder}
     */
    Interacted() {
        return this.tracker.Trace('interacted',this.GameObjectType[this.type],this.gameobjectId);
    }
    
    /**
     * Send Used statement
     * @returns {StatementBuilder}
     */
    Used() {
        return this.tracker.Trace('used',this.GameObjectType[this.type],this.gameobjectId);
    }
}

/**
 * the list of types possible for the gameobject object
 */
const GAMEOBJECTTYPE = Object.freeze({
    ENEMY: 0,
    NPC: 1,
    ITEM: 2,
    GAMEOBJECT: 3,
});

/**
 * Scorm Tracker
 */
class ScormTracker {
    /**
     * Constructor of Scorm tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the Scorm object
     * @param {number} type the type of the Scorm object
     */
    constructor(tracker, id, type=SCORMTYPE.SCO) {
        this.scormId=id;
        this.type=type;
        this.tracker = tracker;
    }
    /**
     * the id of the Scorm object
     * @type {string}
     */
    accessibleId;
    /**
     * the type of the Scorm object
     * @type {number}
     */
    type;
    /**
     * the tracker of the Scorm object
     * @type {xAPITrackerAsset}
     */
    tracker;
    /**
     * the list of types possible for the Scorm object
     * @type {Array}
     */
    ScormType = ['SCO', 'course', 'module', 'assessment', 'interaction', 'objective', 'attempt'];

    /**
     * is initialized
     * @type {boolean}
     */
    initialized;

    /**
     * Initialized Time
     * @type {Date}
     */
    initializedTime;

    /**
     * Send Initialized statement
     * @returns {StatementBuilder|null}
     */
    Initialized() {
        var addInitializedTime = true;
        if(this.initialized) {
            if (this.tracker.debug) {
                throw new Error("The initialized statement for the specified id has already been sent!");
            } else {
                console.warn("The initialized statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.initialized=false;
        }
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot initialize an object for a type different that SCO.");
        }
        return this.tracker.Trace('initialized', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Suspended statement
     * @returns {StatementBuilder|null}
     */
    Suspended() {
        if(!this.initialized) {
            if (this.tracker.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        var duration = actualDate.getTime()-this.initializedTime.getTime();
        this.initialized=false;
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot suspend an object for a type different that SCO.");
        }
        return this.tracker.Trace('suspended', this.ScormType[this.type], this.scormId)
                .withDuration(duration);
    }

    /**
     * Send Resumed statement
     * @returns {StatementBuilder|null}
     */
    Resumed() {
        var addInitializedTime = true;
        if(this.initialized) {
            if (this.tracker.debug) {
                throw new Error("The Resumed statement for the specified id has already been sent!");
            } else {
                console.warn("The Resumed statement for the specified id has already been sent!");
                addInitializedTime = false;
                return;
            }
        }
        if (addInitializedTime) {
            this.initializedTime = new Date();
            this.initialized=false;
        }
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot resume an object for a type different that SCO.");
        }
        return this.tracker.Trace('resumed', this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Terminated statement
     * @returns {StatementBuilder|null}
     */
    Terminated() {
        if(!this.initialized) {
            if (this.tracker.debug) {
                throw new Error("You need to send a initialized statement before sending an Terminated statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an Terminated statement!");
                return;
            }
        }
        let actualDate=new Date();
        var duration = actualDate.getTime()-this.initializedTime.getTime();
        this.initialized=false;
        if(this.type != SCORMTYPE.SCO) {
            throw new Error("You cannot terminate an object for a type different that SCO.");
        }
        return this.tracker.Trace('terminated', this.ScormType[this.type], this.scormId)
                    .withDuration(duration);
    }

    /**
     * Send Passed statement
     * @returns {StatementBuilder}
     */
    Passed() {
        return this.tracker.Trace('passed',this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Failed statement
     * @returns {StatementBuilder}
     */
    Failed() {
        return this.tracker.Trace('failed',this.ScormType[this.type], this.scormId);
    }

    /**
     * Send Scored statement
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    Scored(score) {
        if (typeof score === 'undefined') {score = 1;}

        return this.tracker.Trace('scored',this.ScormType[this.type], this.scormId)
            .withScore({raw:score});
    }

    /**
     * Send Completed statement
     * @param {boolean} success the success status of the Scorm object
     * @param {boolean} completion the completion status of the Scorm object
     * @param {number} score the score of the Scorm object
     * @returns {StatementBuilder}
     */
    Completed(success, completion, score) {
        if (typeof success === 'undefined') {success = true;}
        if (typeof completion === 'undefined') {completion = false;}
        if (typeof score === 'undefined') {score = 1;}

        if(!this.initialized) {
            if (this.tracker.debug) {
                throw new Error("You need to send a initialized statement before sending an suspended statement!");
            } else {
                console.warn("You need to send a initialized statement before sending an suspended statement!");
                return;
            }
        }
        let actualDate=new Date();
        var duration = actualDate.getTime()-this.initializedTime.getTime();

        return this.tracker.Trace('completed',this.ScormType[this.type], this.scormId)
            .withSuccess(success)
            .withCompletion(completion)
            .withScore({raw:score})
            .withDuration(duration/1000);
    }
}

/**
 * the list of types possible for the scorm object
 */
const SCORMTYPE = Object.freeze({
    SCO: 0,
    COURSE: 1,
    MODULE: 2,
    ASSESSMENT: 3,
    INTERACTION: 4,
    OBJECTIVE: 5,
    ATTEMPT: 6
});

/**
 * Main JavaScript Tracker class for xAPI tracking functionality
 */
class JSTracker {
    /**
     * The underlying tracker instance
     * @type {xAPITrackerAsset|xAPITrackerAssetOAuth1|xAPITrackerAssetOAuth2}
     */
    tracker;

    /**
     * Creates a new JSTracker instance
     * @param {Object} [config] - Configuration options
     * @param {string} [config.result_uri] - Primary xAPI endpoint URI
     * @param {string} [config.backup_uri] - Backup endpoint URI
     * @param {string} [config.backup_type] - Type of backup (XAPI or CSV)
     * @param {string} [config.actor_homePage] - Actor's homepage URL
     * @param {string} [config.actor_name] - Actor's username
     * @param {string} [config.auth_token] - Authentication token
     * @param {string} [config.default_uri] - Default URI for statements
     * @param {boolean} [config.debug] - Debug mode flag
     */
    constructor({
        result_uri = null,
        backup_uri = null,
        backup_type = null,
        actor_homePage = null,
        actor_name = null,
        auth_token = null,
        default_uri = null,
        debug = null
    } = {}) {
        this.tracker = new xAPITrackerAsset({
            endpoint:result_uri,
            backup_endpoint:backup_uri,
            backup_type:backup_type,
            actor_homePage:actor_homePage,
            actor_name:actor_name,
            auth_token:auth_token,
            default_uri:default_uri,
            debug:debug
        });
    }

    /**
     * Flushes the statement queue
     * @param {Object} [opts] - Flush options
     * @param {boolean} [opts.withBackup=false] - Whether to also send to backup endpoint
     * @returns {Promise<void>} Promise that resolves when flushing is complete
     */
    flush({ withBackup = false } = {}) {
        return this.tracker.flush({ withBackup: withBackup });
    }

    /**
     * Generates an xAPI tracker instance from URL parameters
     * @param {Object} [config] - Configuration options
     * @param {string} [config.default_uri] - Default URI for statements
     */
    generateXAPITrackerFromURLParams({ default_uri = null } = {}) {
        const xAPIConfig = {};
        const urlParams = new URLSearchParams(window.location.search);
        let result_uri, backup_uri, backup_type, actor_name, actor_homePage, strDebug, debug;
        let username, password, auth_token;
        let batchLength, batchTimeout, maxRetryDelay;

        if (urlParams.size > 0) {
            // RESULT URI
            result_uri = urlParams.get('result_uri');

            // BACKUP URI
            backup_uri = urlParams.get('backup_uri');
            backup_type = urlParams.get('backup_type');

            // ACTOR DATA
            actor_homePage = urlParams.get('actor_homePage');
            actor_name = urlParams.get('actor_user');

            // SSO OAUTH 2.0 DATA
            const sso_token_endpoint = urlParams.get('sso_token_endpoint');
            if (sso_token_endpoint) {
                xAPIConfig.token_endpoint = sso_token_endpoint;
            }
            const sso_client_id = urlParams.get('sso_client_id');
            if (sso_client_id) {
                xAPIConfig.client_id = sso_client_id;
            }
            const sso_login_hint = urlParams.get('sso_login_hint');
            if (sso_login_hint) {
                xAPIConfig.login_hint = sso_login_hint;
            }
            const sso_grant_type = urlParams.get('sso_grant_type');
            if (sso_grant_type) {
                xAPIConfig.grant_type = sso_grant_type;
            }
            const sso_scope = urlParams.get('sso_scope');
            if (sso_scope) {
                xAPIConfig.scope = sso_scope;
            }
            const sso_username = urlParams.get('sso_username');
            if (sso_username) {
                xAPIConfig.username = sso_username;
            }
            const sso_password = urlParams.get('sso_password');
            if (sso_password) {
                xAPIConfig.password = sso_password;
            } else {
                if (sso_username) {
                    xAPIConfig.password = sso_username;
                }
            }

            // OAUTH 1.0 DATA
            username = urlParams.get('username');
            password = urlParams.get('password');

            // OAUTH 0: VIA AUTHTOKEN DIRECTLY (not recommended)
            auth_token = urlParams.get('auth_token');

            // DEBUG
            strDebug = urlParams.get('debug');

            // BATCH
            batchLength = parseInt(urlParams.get('batch_length'));
            batchTimeout = parseInt(urlParams.get('batch_timeout'));
            maxRetryDelay = parseInt(urlParams.get('max_retry_delay'));

            if (strDebug !== null && strDebug === "true") {
                debug = Boolean(strDebug);
                console.debug(result_uri);
                console.debug(backup_type);
                console.debug(actor_name);
                console.debug(actor_homePage);
                console.debug(debug);
                console.debug(batchLength);
                console.debug(batchTimeout);
                console.debug(maxRetryDelay);
            }
        } else {
            result_uri = null;
            backup_type = "XAPI";
            actor_homePage = null;
            actor_name = null;
            debug = false;
        }

        if (xAPIConfig.token_endpoint) {
            this.tracker = new xAPITrackerAssetOAuth2({
                endpoint:result_uri,
                backup_endpoint:backup_uri,
                backup_type:backup_type,
                actor_homePage:actor_homePage,
                actor_name:actor_name,
                config:xAPIConfig,
                default_uri:default_uri,
                debug:debug,
                batchLength:batchLength,
                batchTimeout:batchTimeout,
                maxRetryDelay:maxRetryDelay
            });
        } else if (username && password) {
            this.tracker = new xAPITrackerAssetOAuth1({
                endpoint:result_uri,
                backup_endpoint:backup_uri,
                backup_type:backup_type,
                actor_homePage:actor_homePage,
                actor_name:actor_name,
                username:username,
                password:password,
                default_uri:default_uri,
                debug:debug,
                batchLength:batchLength,
                batchTimeout:batchTimeout,
                maxRetryDelay:maxRetryDelay
            });
        } else {
            this.tracker = new xAPITrackerAsset({
                endpoint:result_uri,
                backup_endpoint:backup_uri,
                backup_type:backup_type,
                actor_homePage:actor_homePage,
                actor_name:actor_name,
                auth_token:auth_token,
                default_uri:default_uri,
                debug:debug,
                batchLength:batchLength,
                batchTimeout:batchTimeout,
                maxRetryDelay:maxRetryDelay
            });
        }
    }
}

/**
 * SCORM-specific tracker extending JSTracker
 */
class JSScormTracker extends JSTracker {
    /**
     * SCORM type constants
     * @type {Object}
     */
    SCORMTYPE = SCORMTYPE;

    /**
     * list of scorm instances
     */
    scormInstances={};

    /**
     * Creates a new SCORM tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - SCORM type
     * @returns {ScormTracker} New SCORM tracker instance
     */
    scorm(id, type=SCORMTYPE.SCO) {
        var scorm;
        if(!this.scormInstances[type]) {
            this.scormInstances[type]={};
        }
        if(!this.scormInstances[type][id]) {
            scorm =new ScormTracker(this.tracker, id, type);            this.scormInstances[type][id]=scorm;
        } else {
            scorm=this.scormInstances[type][id];
        }
        return 
    }
}


/**
 * Serious Game Tracker extending JSTracker with game-specific functionality
 */
class SeriousGameTracker extends JSTracker {
    /**
     * Accessible type constants
     */
    ACCESSIBLETYPE = ACCESSIBLETYPE;

    /**
     * Completable type constants
     */
    COMPLETABLETYPE = COMPLETABLETYPE;

    /**
     * Alternative type constants
     */
    ALTERNATIVETYPE = ALTERNATIVETYPE;

    /**
     * Game object type constants
     */
    GAMEOBJECTTYPE = GAMEOBJECTTYPE;

    /**
     * SCORM tracker instance
     * @type {ScormTracker}
     */
    scormTracker;

    /**
     * list of instances
     */
    instances= {
        "completable": {},
        "gameObject": {},
        "alternative": {},
        "accessible": {}
    };

    /**
     * Creates a new SeriousGameTracker instance
     * @param {Object} [config] - Configuration options
     * @param {string} [config.result_uri] - Primary xAPI endpoint URI
     * @param {string} [config.backup_uri] - Backup endpoint URI
     * @param {string} [config.activityId] - Activity ID
     * @param {string} [config.backup_type] - Type of backup (XAPI or CSV)
     * @param {string} [config.actor_homePage] - Actor's homepage URL
     * @param {string} [config.actor_name] - Actor's username
     * @param {string} [config.auth_token] - Authentication token
     * @param {string} [config.default_uri] - Default URI for statements
     * @param {boolean} [config.debug] - Debug mode flag
     */
    constructor({
        result_uri = null,
        backup_uri = null,
        activityId = null,
        backup_type = null,
        actor_homePage = null,
        actor_name = null,
        auth_token = null,
        default_uri = null,
        debug = null
    } = {}) {
        super({
            result_uri: result_uri,
            backup_uri: backup_uri,
            backup_type: backup_type,
            actor_homePage: actor_homePage,
            actor_name: actor_name,
            auth_token: auth_token,
            default_uri: default_uri,
            debug: debug
        });
        this.scormTracker = new ScormTracker(this.tracker, activityId, SCORMTYPE.SCO);
    }

    /**
     * Marks the game as started
     * @returns {StatementBuilder} Promise that resolves when the start is recorded
     */
    start() {
        return this.scormTracker.Initialized();
    }

    /**
     * Marks the game as paused
     * @returns {StatementBuilder} Promise that resolves when the pause is recorded
     */
    pause() {
        return this.scormTracker.Suspended();
    }

    /**
     * Marks the game as resumed
     * @returns {StatementBuilder} Promise that resolves when the resume is recorded
     */
    resumed() {
        return this.scormTracker.Resumed();
    }

    /**
     * Marks the game as finished
     * @returns {StatementBuilder} Promise that resolves when the finish is recorded
     */
    finish() {
        return this.scormTracker.Terminated();
    }

    /**
     * Creates an accessible tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Accessible type
     * @returns {AccessibleTracker} New AccessibleTracker instance
     */
    accessible(id, type=ACCESSIBLETYPE.ACCESSIBLE) {
        var accessible;
        if(!this.instances["accessible"][type]) {
            this.instances["accessible"][type]={};
        }
        if(!this.instances["accessible"][type][id]) {
            accessible =new AccessibleTracker(this.tracker, id, type);
            this.instances["accessible"][type][id]=accessible;
        } else {
            accessible=this.instances["accessible"][type][id];
        }
        return accessible;
    }

    /**
     * Creates a game object tracker instance
     * @param {string} id - Game object ID
     * @param {number} type - Game object type
     * @returns {GameObjectTracker} New GameObjectTracker instance
     */
    gameObject(id, type=GAMEOBJECTTYPE.GAMEOBJECT) {
        var gameObject;
        if(!this.instances["gameObject"][type]) {
            this.instances["gameObject"][type]={};
        }
        if(!this.instances["gameObject"][type][id]) {
            gameObject =new GameObjectTracker(this.tracker, id, type);
            this.instances["gameObject"][type][id]=gameObject;
        } else {
            gameObject=this.instances["gameObject"][type][id];
        }
        return gameObject;
    }

    /**
     * Creates a completable tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Completable type
     * @returns {CompletableTracker} New CompletableTracker instance
     */
    completable(id, type=COMPLETABLETYPE.COMPLETABLE) {
        var completable;
        if(!this.instances["completable"][type]) {
            this.instances["completable"][type]={};
        }
        if(!this.instances["completable"][type][id]) {
            completable =new CompletableTracker(this.tracker, id, type);
            this.instances["completable"][type][id]=completable;
        } else {
            completable=this.instances["completable"][type][id];
        }
        return completable;
    }

    /**
     * Creates an alternative tracker instance
     * @param {string} id - Activity ID
     * @param {number} type - Alternative type
     * @returns {AlternativeTracker} New AlternativeTracker instance
     */
    alternative(id, type=ALTERNATIVETYPE.ALTERNATIVE) {
        var alternative;
        if(!this.instances["alternative"][type]) {
            this.instances["alternative"][type]={};
        }
        if(!this.instances["alternative"][type][id]) {
            alternative =new AlternativeTracker(this.tracker, id, type);
            this.instances["alternative"][type][id]=alternative;
        } else {
            alternative=this.instances["alternative"][type][id];
        }
        return alternative;
    }
}

exports.JSScormTracker = JSScormTracker;
exports.JSTracker = JSTracker;
exports.SeriousGameTracker = SeriousGameTracker;
