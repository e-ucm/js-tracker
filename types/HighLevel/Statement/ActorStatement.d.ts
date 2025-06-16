export = ActorStatement;
declare class ActorStatement {
    /**
     * @param {string} token
     * @param {string} accountName
     * @param {string} homepage
     */
    constructor(token: string, accountName: string, homepage: string);
    token: string;
    accountName: string;
    homepage: string;
    toXAPI(): {
        account: {
            name: string;
            homePage: string;
        };
    };
    /**
     * @returns {string}
     */
    toCSV(): string;
}
