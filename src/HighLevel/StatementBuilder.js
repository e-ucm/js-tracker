// ------------------------------------------------------------------
// 1) THE BUILDER

import xAPITrackerAsset from "../xAPITrackerAsset";
import Statement from "./Statement/Statement";

// ------------------------------------------------------------------
export class StatementBuilder {
    client;
    statement;
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
  withSuccess(success) {
    this.statement.setSuccess(success);
    return this;
  }

  withScore(raw = null, min = null, max = null, scaled = null) {
    this.statement.setScore(raw, min, max, scaled);
    return this;
  }

  withScoreRaw(raw) {
    this.statement.setScoreRaw(raw);
    return this;
  }

  withScoreMin(min) {
    this.statement.setScoreMin(min);
    return this;
  }

  withScoreMax(max) {
    this.statement.setScoreMax(max);
    return this;
  }

  withScoreScaled(scaled) {
    this.statement.setScoreScaled(scaled);
    return this;
  }

  withCompletion(value) {
    this.statement.setCompletion(value);
    return this;
  }

  withDuration(diffInSeconds) {
    this.statement.setDuration(diffInSeconds);
    return this;
  }

  withResponse(value) {
    this.statement.setResponse(value);
    return this;
  }

  withProgress(value) {
    this.statement.setProgress(value);
    return this;
  }

  withResultExtension(key, value) {
    this.statement.addResultExtension(key, value);
    return this;
  }

  withResultExtensions(ext = {}) {
    this.statement.setExtensions(ext);
    return this;
  }
  
  //— make this builder awaitable (thenable) ————————————————————————
  then(onFulfilled, onRejected) {
    return this._promise.then(onFulfilled, onRejected)
  }

  catch(onRejected) {
    return this._promise.catch(onRejected)
  }

  finally(onFinally) {
    return this._promise.finally(onFinally)
  }
}