// ------------------------------------------------------------------
// 1) THE BUILDER

import xAPITrackerAsset from "../xAPITrackerAsset";
import Statement from "./Statement/Statement";

// ------------------------------------------------------------------
/**
 * Statement Builder Class
 */
export class StatementBuilder {
  /**
   * XAPI Client 
   * @type {xAPITrackerAsset}
   */
    client;

    /**
     * Statement
     * @type {Statement}
     */
    statement;

    /**
     * Promise
     * @type {Promise<void>}
     */
    _promise;

  /**
   * @param  {xAPITrackerAsset} xapiClient  any client that has a `.sendStatement(statement)` → Promise
   * @param  {Statement} initial     a partial Statement (actor, verb, object…)
   */
  constructor(xapiClient, initial) {
    this.client    = xapiClient;
    this.statement = initial;
    this._promise = Promise
      .resolve()
      .then(() => this.client.enqueue(this.statement));
  }

  // RESULT
  /**
   * Set success to statemement
   * @param {boolean} success 
   * @returns {StatementBuilder}
   */
  withSuccess(success) {
    this.statement.setSuccess(success);
    return this;
  }

  /**
   * Set score to statemement
   * @param {object} opts the options of scores 
   * @param {number} opts.raw the raw score value
   * @param {number} opts.min the min score value
   * @param {number} opts.max the max score value
   * @param {number} opts.scaled the scaled score value
   * @returns {StatementBuilder}
   */
  withScore({raw = null, min = null, max = null, scaled = null}={}) {
    this.statement.setScore(raw, min, max, scaled);
    return this;
  }

  /**
   * Set raw score to statemement
   * @param {number} raw the raw score value
   * @returns {StatementBuilder}
   */
  withScoreRaw(raw) {
    this.statement.setScoreRaw(raw);
    return this;
  }
  /**
   * Set min score to statemement
   * @param {number} min the min score value
   * @returns {StatementBuilder}
   */
  withScoreMin(min) {
    this.statement.setScoreMin(min);
    return this;
  }
  /**
   * Set max score to statemement
   * @param {number} max the max score value
   * @returns {StatementBuilder}
   */
  withScoreMax(max) {
    this.statement.setScoreMax(max);
    return this;
  }
  /**
   * Set scaled score to statemement
   * @param {number} scaled the scaled score value
   * @returns {StatementBuilder}
   */
  withScoreScaled(scaled) {
    this.statement.setScoreScaled(scaled);
    return this;
  }

  /**
   * Set completion status to statement
   * @param {boolean} value completion status of statement
   * @returns {StatementBuilder}
   */
  withCompletion(value) {
    this.statement.setCompletion(value);
    return this;
  }

  /**
   * Set duration to statement
   * @param {number} diffInSeconds duration in sec of statement
   * @returns {StatementBuilder}
   */
  withDuration(diffInSeconds) {
    this.statement.setDuration(diffInSeconds);
    return this;
  }

  /**
   * Set response to statement
   * @param {string} value response of statement
   * @returns {StatementBuilder}
   */
  withResponse(value) {
    this.statement.setResponse(value);
    return this;
  }

  /**
   * Set progress to statement
   * @param {number} value progress of statement
   * @returns {StatementBuilder}
   */
  withProgress(value) {
    this.statement.setProgress(value);
    return this;
  }

  /**
   * Add result extension to statement
   * @param {string} key key of the result extension
   * @param {*} value value of the result extension
   * @returns {StatementBuilder}
   */
  
  withResultExtension(key, value) {
    this.statement.addResultExtension(key, value);
    return this;
  }

  /**
     * Set result extensions as Object key/values list of the statement
     * @param {Object} extensions extensions list
     */
  withResultExtensions(extensions = {}) {
    this.statement.addResultExtensions(extensions);
    return this;
  }

  /**
   * let me run any function on the statement
   * fn can either mutate `stmt` in‐place, or return a brand new statement
   * @param {Function<Statement>} fn function to apply to statement
   */
  apply(fn) {
    const result = fn(this.statement);
    // if your fn returns a new statement, pick that up, otherwise
    // assume it has mutated in place
    if (result !== undefined && typeof result == Statement) {
      this.statement = result;
    }
    return this;
  }

  //— make this builder awaitable (thenable) ————————————————————————
  /**
   * 
   * @param {*} onFulfilled
   * @param {*} onRejected 
   * @returns {Promise<void>}
   */
  then(onFulfilled, onRejected) {
    return this._promise.then(onFulfilled, onRejected)
  }

  /**
   * 
   * @param {*} onFinally 
   * @returns {Promise<void>}
   */
  catch(onRejected) {
    return this._promise.catch(onRejected)
  }

  /**
   * 
   * @param {*} onFinally 
   * @returns {Promise<void>}
   */
  finally(onFinally) {
    return this._promise.finally(onFinally)
  }
}