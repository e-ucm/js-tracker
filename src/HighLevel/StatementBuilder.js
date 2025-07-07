// ------------------------------------------------------------------
// 1) THE BUILDER

import xAPITrackerAsset from "../xAPITrackerAsset.js";
import Statement from "./Statement/Statement.js";

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
   * @returns {this} Returns the current instance for chaining
   */
  withSuccess(success) {
    this.statement.setSuccess(success);
    return this;
  }

/**
 * Sets score-related properties
 * @param {Partial<{raw: number; min: number; max: number; scaled: number}>} score - Score configuration
 * @returns {this} Returns the current instance for chaining
 */
  withScore(score) {
    this.statement.setScore(
      score.raw ?? score?.raw, 
      score.min ?? score?.min,
      score.max ?? score?.max,
      score.scaled ?? score?.scaled
    );
    return this;
}
  /**
   * Set raw score to statemement
   * @param {number} raw the raw score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreRaw(raw) {
    this.statement.setScoreRaw(raw);
    return this;
  }
  /**
   * Set min score to statemement
   * @param {number} min the min score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreMin(min) {
    this.statement.setScoreMin(min);
    return this;
  }
  /**
   * Set max score to statemement
   * @param {number} max the max score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreMax(max) {
    this.statement.setScoreMax(max);
    return this;
  }
  /**
   * Set scaled score to statemement
   * @param {number} scaled the scaled score value
   * @returns {this} Returns the current instance for chaining
   */
  withScoreScaled(scaled) {
    this.statement.setScoreScaled(scaled);
    return this;
  }

  /**
   * Set completion status to statement
   * @param {boolean} value completion status of statement
   * @returns {this} Returns the current instance for chaining
   */
  withCompletion(value) {
    this.statement.setCompletion(value);
    return this;
  }

  /**
   * Set duration to statement
   * @param {Date} init init date of statement
   * @param {Date} end end date of statement
   * @returns {this} Returns the current instance for chaining
   */
  withDuration(init, end) {
    this.statement.setDuration(init, end);
    return this;
  }

  /**
   * Set response to statement
   * @param {string} value response of statement
   * @returns {this} Returns the current instance for chaining
   */
  withResponse(value) {
    this.statement.setResponse(value);
    return this;
  }

  /**
   * Set progress to statement
   * @param {number} value progress of statement
   * @returns {this} Returns the current instance for chaining
   */
  withProgress(value) {
    this.statement.setProgress(value);
    return this;
  }

  /**
   * Add result extension to statement
   * @param {string} key key of the result extension
   * @param {*} value value of the result extension
   * @returns {this} Returns the current instance for chaining
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
   * Applies a function to the statement
   * @param {(statement: Statement) => Statement} fn - Function to apply to statement
   * @returns {this} Returns the current instance for chaining
   */
  apply(fn) {
    const result = fn(this.statement);
    // if your fn returns a new statement, pick that up, otherwise
    // assume it has mutated in place
    if (result instanceof Statement) {
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
   * @param {*} onRejected 
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