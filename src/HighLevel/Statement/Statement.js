import VerbStatement from "./VerbStatement.js";
import ObjectStatement from "./ObjectStatement.js";
import ResultStatement from "./ResultStatement.js";
import ActorStatement from "./ActorStatement.js";
import ContextStatement from "./ContextStatement.js";
import { v4 as uuidv4 } from 'uuid';


/**
* Statement class
*/
export default class Statement {
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
        this.id = uuidv4();
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
     * @param {Date} init init date of statement
     * @param {Date} end end date of statement
     */
    setDuration(init, end) {
        const durationInMs = end.getTime()-init.getTime();
        const durationInSec = durationInMs / 1000;
        const seconds = durationInSec % 60;
        const minutes = Math.floor(durationInSec / 60) % 60;
        const hours = Math.floor(durationInSec / 3600) % 24;
        const days = Math.floor(durationInSec / 86400);

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