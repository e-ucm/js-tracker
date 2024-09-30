import XAPI from "@xapi/xapi";
import ActorStatement from "./HighLevel/Statement/ActorStatement.js";
import ContextStatement from "./HighLevel/Statement/ContextStatement.js";
import Statement from "./HighLevel/Statement/Statement.js";

export default class xAPITrackerAsset {
    constructor(endpoint, auth, homePage, token) {
        this.updateAuth(endpoint, auth, homePage, token);
    }

    updateAuth(endpoint, auth, homePage, token) {
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
        this.defaultUri="mygame";
    }
    
    xapi;
    endpoint;
    auth;
    homePage;
    token;
    defautURI;
    
    Trace(verbId, objectType, objectId) {
        var statement=new Statement(this.actor, verbId, objectId, objectType, this.context, this.defautURI);
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