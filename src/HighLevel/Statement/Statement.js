import VerbStatement from "./VerbStatement.js";
import ObjectStatement from "./ObjectStatement.js";
import ResultStatements from "./ResultStatement.js";
import { v4 as uuidv4 } from 'uuid';

export default class Statement {
    constructor(actor, verbId, objectId, objectType, context, defautURI="mygame") {
        this.id = uuidv4();
        this.actor = actor;
        this.verb = new VerbStatement(verbId);
        this.object = new ObjectStatement(setAsUri(objectId, defautURI), objectType);
        this.timestamp = new Date();
        this.context = context;
        this.version = "1.0.3";
        this.result = new ResultStatements();
        this.defautURI = defautURI;
    }
    
    actor;
    verb;
    object;
    timestamp;
    context;
    result;

    static setAsUri(id, defaultValue="mygame") {
        if(isUri(id)) {
            return id;
        } else {
            return `${defaultValue}://${id}`;
        }
    }
    
    static isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    setScore(raw, min, max, scaled) {
        if (exists(raw)) {
            this.setScoreRaw(raw);
        }

        if (exists(min)) {
            this.setScoreMin(min);
        }

        if (exists(max)) {
            this.setScoreMax(max);
        }

        if (exists(scaled)) {
            this.setScoreScaled(scaled);
        }
    };

    setScoreRaw(raw) {
        this.setScoreValue('raw', raw);

    };

    setScoreMin(min) {
        this.setScoreValue('min', min);
    };

    setScoreMax(max) {
        this.setScoreValue('max', max);
    };

    setScoreScaled(scaled) {
        this.setScoreValue('scaled', scaled);
    };

    setScoreValue(key, value) {
        if (exists(this.result.Extensions.score)) {
            this.result.Extension.score = {};
        }

        this.result.Extension.score[key] = Number(value);
    };

    setCompletion(value) {
        this.addExtension('completion', value);
    };

    setSuccess(value) {
        this.addExtension('success', value);
    };

    setResponse(value) {
        this.addExtension('response', value);
    };

    setProgress(value) {
        this.addExtension('progress', value);
    };

    setVar(key,value) {
        this.addExtension(key,value);
    };

    addExtension(key,value) {
        this.result.setExtension(setAsUri(key, defautURI), value);
    };


    toXAPI() {
        var xapiTrace={}
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
        if(this.result) {
            xapiTrace.result = this.result.toXAPI();
        }
        return xapiTrace;
    }
}