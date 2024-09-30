export default class ActorStatement {
    constructor(token, accountName, homepage) {
        this.token = token;
        this.accountName = accountName;
        this.homepage = homepage;
    }
    token;
    accountName;
    homepage;
    
    toXAPI() {
        return {
            name: this.token,
            account: {
                name: this.accountName,
                homePage: this.homepage
            }
        }
    }
}