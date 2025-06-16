const VerbStatement = require("./VerbStatement.js");
const ObjectStatement = require("./ObjectStatement.js");
const ResultStatements = require("./ResultStatement.js");
const ContextStatement = require("./ContextStatement.js");
const ActorStatement = require("./ActorStatement.js");
const uuidv4 = require('uuid').v4;

class Statement {
    /**
     * @param {ActorStatement} actor 
     * @param {string} verbId
     * @param {string} objectId 
     * @param {string} objectType
     * @param {ContextStatement} context
     * @param {string} defautURI
     */
    constructor(actor, verbId, objectId, objectType, context, defautURI) {
        this.id = uuidv4();
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

    /**
     * @param {string} id
     * @returns {string}
     */
    setAsUri(id) {
        if(this.isUri(id)) {
            return id;
        } else {
            return `${this.defautURI}://${id}`;
        }
    }
    
    /**
     * @param {string} id
     * @returns {boolean}
     */
    isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    /**
     * @param {number} raw
     * @param {number} min
     * @param {number} max
     * @param {number} scaled
     */
    setScore(raw, min=null, max=null, scaled=null) {
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
     * @param {number} raw
     */
    setScoreRaw(raw) {
        this.result.setScoreValue('raw', raw);
    }

    /**
     * @param {number} min
     */
    setScoreMin(min) {
        this.result.setScoreValue('min', min);
    }

    /**
     * @param {number} max
     */
    setScoreMax(max) {
        this.result.setScoreValue('max', max);
    }

    /**
     * @param {number} scaled
     */
    setScoreScaled(scaled) {
        this.result.setScoreValue('scaled', scaled);
    }

    /**
     * @param {boolean} value
     */
    setCompletion(value) {
        this.addResultExtension('completion', value);
    }

    /**
     * @param {boolean} value
     */
    setSuccess(value) {
        this.addResultExtension('success', value);
    }

    /**
     * @param {number} diffInSeconds
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
     * @param {string} value
     */
    setResponse(value) {
        this.addResultExtension('response', value);
    }

    /**
     * @param {number} value
     */
    setProgress(value) {
        this.addResultExtension('progress', value);
    }

    /**
     * @param {string} key 
     * @param {any} value
     */
    setVar(key,value) {
        this.addResultExtension(key,value);
    }

    /**
     * @param {string} key 
     * @param {any} value
     */
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

    /**
     * @returns {string}
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

module.exports = Statement;