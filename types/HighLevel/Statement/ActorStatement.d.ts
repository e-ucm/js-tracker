export = ActorStatement;
declare class ActorStatement {
    constructor(token: any, accountName: any, homepage: any);
    token: any;
    accountName: any;
    homepage: any;
    toXAPI(): {
        account: {
            name: any;
            homePage: any;
        };
    };
    toCSV(): any;
}
