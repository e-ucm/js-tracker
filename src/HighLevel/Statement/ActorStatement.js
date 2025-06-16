class ActorStatement {
    /**
     * @param {string} token
     * @param {string} accountName
     * @param {string} homepage
     */
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
            account: {
                name: this.accountName,
                homePage: this.homepage
            }
        };
    }
    
    /**
     * @returns {string}
     */
    toCSV() {
        return this.accountName.replaceAll(',', '\\,') ;
    }
}

module.exports = ActorStatement;