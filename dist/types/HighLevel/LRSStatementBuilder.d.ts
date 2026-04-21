export default class LRSStatementBuilder extends StatementBuilder {
    /**
     * Constructor of LRSStatementBuilder
     * @param {xAPITrackerAsset} xapiClient the Tracker
     * @param {object} initial the initial statement
     */
    constructor(xapiClient: xAPITrackerAsset, initial: object);
    /**
     * Statement
     * @type {LRSStatement}
     */
    statement: LRSStatement;
    withContextActivity(type: any, id: any, activityType: any): this;
    withActorAccount(accountName: any, accountHomePage: any): this;
    withActorMbox(mbox: any): this;
    withActorMboxSha1(mboxSha1: any): this;
    withActorOpenID(openid: any): this;
    withAutorityAccount(accountName: any, accountHomePage: any): this;
    withAutorityMbox(mbox: any): this;
    withAutorityMboxSha1(mboxSha1: any): this;
    withAutorityOpenID(openid: any): this;
}
import StatementBuilder from "./StatementBuilder.js";
import LRSStatement from "./Statement/LRSStatement.js";
import xAPITrackerAsset from "../xAPITrackerAsset.js";
