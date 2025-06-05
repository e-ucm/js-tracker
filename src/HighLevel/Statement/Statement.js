import VerbStatement from "./VerbStatement.js";
import ObjectStatement from "./ObjectStatement.js";
import ResultStatements from "./ResultStatement.js";
import { v4 as uuidv4 } from 'uuid';

export default class Statement {
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