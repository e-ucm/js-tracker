import xAPITrackerAsset from "../xAPITrackerAsset.js";
import LRSStatement from "./Statement/LRSStatement.js";
import StatementBuilder from "./StatementBuilder.js";

export default class LRSStatementBuilder extends StatementBuilder {
    /**
     * Constructor of LRSStatementBuilder
     * @param {xAPITrackerAsset} xapiClient the Tracker
     * @param {object} initial the initial statement
     */
    constructor(xapiClient, initial) {
        super(xapiClient, initial);
    }

    /**
     * Statement
     * @type {LRSStatement}
     */
    statement;

    /**
     * Adds a context activity to the statement
     * @param {string} type - The context activity type (e.g. 'parent', 'grouping', 'category', 'other')
     * @param {string} id - The IRI identifier of the context activity
     * @param {string} activityType - The activity type IRI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withContextActivity(type, id, activityType) {
        super.withContextActivity(type, id, activityType);
        return this;
    }

    /**
     * Sets the actor using an account identifier
     * @param {string} accountName - The account name
     * @param {string} accountHomePage - The home page IRI of the account service provider
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorAccount(accountName, accountHomePage) {
        super.withActor('account', { name: accountName, homePage: accountHomePage });
        return this;
    }

    /**
     * Sets the actor using an mbox (mailto URI)
     * @param {string} mbox - The mailto URI of the actor (e.g. 'mailto:user@example.com')
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorMbox(mbox) {
        super.withActor('mbox', mbox);
        return this;
    }

    /**
     * Sets the actor using an mbox SHA1 hash
     * @param {string} mboxSha1 - The SHA1 hash of the actor's mbox URI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorMboxSha1(mboxSha1) {
        super.withActor('mbox_sha1sum', mboxSha1);
        return this;
    }

    /**
     * Sets the actor using an OpenID URI
     * @param {string} openid - The OpenID URI of the actor
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withActorOpenID(openid) {
        super.withActor('openid', openid);
        return this;
    }

    /**
     * Sets the authority using an account identifier
     * @param {string} accountName - The account name
     * @param {string} accountHomePage - The home page IRI of the account service provider
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityAccount(accountName, accountHomePage) {
        this.statement.authority.setActor('account', { name: accountName, homePage: accountHomePage });
        return this;
    }

    /**
     * Sets the authority using an mbox (mailto URI)
     * @param {string} mbox - The mailto URI of the authority (e.g. 'mailto:lrs@example.com')
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityMbox(mbox) {
        this.statement.authority.setActor('mbox', mbox);
        return this;
    }

    /**
     * Sets the authority using an mbox SHA1 hash
     * @param {string} mboxSha1 - The SHA1 hash of the authority's mbox URI
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityMboxSha1(mboxSha1) {
        this.statement.authority.setActor('mbox_sha1sum', mboxSha1);
        return this;
    }

    /**
     * Sets the authority using an OpenID URI
     * @param {string} openid - The OpenID URI of the authority
     * @returns {LRSStatementBuilder} This builder instance for chaining
     */
    withAutorityOpenID(openid) {
        this.statement.authority.setActor('openid', openid);
        return this;
    }

    /**
     * Sends the built statement to the LRS
     * @returns {Promise<void>} Promise that resolves when the statement has been sent
     */
    async send() {
        return await super.send();
    }


}