var XAPI = require("@xapi/xapi");
var ActorStatement = require("./HighLevel/Statement/ActorStatement");
var ContextStatement = require("./HighLevel/Statement/ContextStatement");
const Statement = require("./HighLevel/Statement/Statement");

class xAPITrackerAsset {
    constructor(endpoint, auth, homePage, token) {
        this.endpoint = endpoint;
        this.auth = auth;
        this.homePage = homePage;
        this.token = token;
        this.actor=new ActorStatement(token, token, homePage);
        this.context = new ContextStatement();
        this.xapi = new XAPI({
            endpoint: endpoint,
            auth: auth
        });
    }
    
    xapi;
    endpoint;
    auth;
    homePage;
    token;
    
    Trace(verbId, objectType, objectId) {
        var statement=new Statement(this.actor, verbId, objectId, objectType, this.context);
        this.enqueue(statement.toXAPI());
        return statement;
    }

    enqueue(statement) {
        const mystatement=[statement];
        this.xapi.sendStatement({statement: mystatement})
        .then((result) => {
            console.log(result);
        })
        .catch(console.error);
    }
}

module.exports = xAPITrackerAsset;