/**
 * Actor Class of a Statement
 */
export default class ActorStatement {
    /**
     * Actor constructor
     * @param {string} accountName account name
     * @param {string} homepage account homepage 
     */
    constructor(accountName, homepage) {
        this.accountName = accountName;
        this.homepage = homepage;
    }

    /**
     * Account name
     * @type {string}
     */
    accountName;

    /**
     * Account homePage
     * @type {string}
     */
    homepage;

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        return {
            account: {
                name: this.accountName,
                homePage: this.homepage
            }
        };
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.accountName.replaceAll(',', '\\,') ;
    }
}