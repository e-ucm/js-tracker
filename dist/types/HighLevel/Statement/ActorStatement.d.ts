/**
 * Actor Class of a Statement
 */
export default class ActorStatement {
    /**
     * Actor constructor
     * @param {string} accountName account name
     * @param {string} homepage account homepage
     */
    constructor(accountName: string, homepage: string);
    /**
     * Account name
     * @type {string}
     */
    accountName: string;
    /**
     * Account homePage
     * @type {string}
     */
    homepage: string;
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
