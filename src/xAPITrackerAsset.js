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
        console.log(this.xapi);
    }
    
    xapi;
    endpoint;
    auth;
    homePage;
    token;
    
    Trace(verbId, objectType, objectId) {
        var statement=new Statement(this.actor, verbId, objectId, objectType, this.context);
        return statement;
    }

    async enqueue(statement) {
        console.log("Sending to LRS ")
        console.log(statement);
        //const mystatement=statement;
        //this.xapi.sendStatement({statement: mystatement})
        const mystatements=[statement];
        await this.xapi.sendStatements({statements: mystatements})
        .then((result) => {
            console.log("Statement send");
            console.log(result);
        }).catch(console.error);
    }
}

module.exports = xAPITrackerAsset;