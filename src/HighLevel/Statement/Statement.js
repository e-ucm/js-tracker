const { now } = require("moment");
const ActorStatement = require("./ActorStatement");
const VerbStatement = require("./VerbStatement");
const ObjectStatement = require("./ObjectStatement");
const ContextStatement = require("./ContextStatement");
var uuidv4 = require('uuid').v4;

class Statement {
    constructor(actor, verbId, objectId, objectType, context) {
        this.id = uuidv4();
        this.actor = actor;
        this.verb = new VerbStatement(verbId);
        this.object = new ObjectStatement(objectId, objectType);
        this.timestamp = new Date();
        this.context = context;
    }
    
    actor;
    verb;
    object;
    timestamp;
    context;

    toXAPI() {
        return {
            id : this.id,
            actor: this.actor ? this.actor.toXAPI() : null,
            verb: this.verb ? this.verb.toXAPI(): null,
            object:this.object ?  this.object.toXAPI() : null,
            timestamp: this.timestamp.toISOString(),
            context: this.context ? this.context.toXAPI() : null
        }
    }
}

module.exports = Statement;