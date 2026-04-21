// ------------------------------------------------------------------
// 1) THE BUILDER

import xAPITrackerAsset from "../xAPITrackerAsset.js";
import InteractionObjectStatement from "./Statement/InteractionObjectStatement.js";
import LRSStatement from "./Statement/LRSStatement.js";
import Statement from "./Statement/Statement.js";

// ------------------------------------------------------------------
/**
 * Statement Builder Class
 */
export default class StatementBuilder {
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
     * Promise of Statement sent
     * @type {Promise<void>}
     */
    _sendPromise;

  /**
   * @param  {xAPITrackerAsset} xapiClient  any client that has a `.sendStatement(statement)` → Promise
   * @param  {Statement} initial     a partial Statement (actor, verb, object…)
   */
  constructor(xapiClient, initial) {
    this.client    = xapiClient;
    this.statement = initial;
    this._sendPromise = null;
  }

  // RESULT
  /**
   * Set success to statemement
   * @param {boolean} success 
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withSuccess(success) {
    this.statement.result.setSuccess(success);
    return this;
  }

/**
 * Sets score-related properties to statemement
 * @param {Partial<{raw: number; min: number; max: number; scaled: number}>} score - Score configuration
 * @returns {StatementBuilder} Returns the current instance for chaining
 */
  withScore(score) {
    this.statement.result.setScore(
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
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreRaw(raw) {
    this.statement.result.setScoreRaw(raw);
    return this;
  }
  /**
   * Set min score to statemement
   * @param {number} min the min score value
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreMin(min) {
    this.statement.result.setScoreMin(min);
    return this;
  }
  /**
   * Set max score to statemement
   * @param {number} max the max score value
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreMax(max) {
    this.statement.result.setScoreMax(max);
    return this;
  }
  /**
   * Set scaled score to statemement
   * @param {number} scaled the scaled score value
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withScoreScaled(scaled) {
    this.statement.result.setScoreScaled(scaled);
    return this;
  }

  /**
   * Set completion status to statement
   * @param {boolean} value completion status of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withCompletion(value) {
    this.statement.result.setCompletion(value);
    return this;
  }

  /**
   * Set duration to statement
   * @param {Date} init init date of statement
   * @param {Date} end end date of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withDuration(init, end) {
    this.statement.result.setDuration(init, end);
    return this;
  }

  /**
   * Set response to statement
   * @param {string} value response of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withResponse(value) {
    this.statement.result.setResponse(value);
    return this;
  }

  /**
   * Set progress to statement
   * @param {number} value progress of statement
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withProgress(value) {
    this.statement.result.setProgress(value);
    return this;
  }

  /**
   * Add result extension to statement
   * @param {string} key key of the result extension
   * @param {*} value value of the result extension
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  
  withResultExtension(key, value) {
    this.statement.result.setExtension(key, value);
    return this;
  }

  /**
     * Add result extensions as Object key/values list of the statement
     * @param {Object} extensions extensions list
     */
  withResultExtensions(extensions = {}) {
    this.statement.result.setExtensions(extensions);
    return this;
  }
  /**
   * Add context extension to statement
   * @param {string} key key of the context extension
   * @param {*} value value of the context extension
   * @returns {StatementBuilder} Returns the current instance for chaining
   */
  withContextExtension(key, value) {
    this.statement.context.setExtension(key, value);
    return this;
  }
  
  /**
     * Add context activity to statement
     * @param {"parent"|"grouping"|"category"|"other"} type
     * @param {string} activityId
     * @param {string} activityType
     * @return {StatementBuilder} Returns the current instance for chaining
     */
  withContextActivity(type, activityId, activityType) {
    this.statement.context.addContextActivity(type, activityId, activityType);
    return this;
  }

  withContextCategory(categoryId) {
    this.statement.context.addCategory(categoryId);
    return this;
  }

  /**
   * Add or set a verb display
   * @param {string} lang
   * @param {string} display
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withVerbDisplay(lang, display) {
    this.statement.verb.addDisplay(lang, display);
    return this;
  }

  /**
   * Add or set a name of the Object definition
   * @param {string} lang
   * @param {Set<string>} list list of the Object definition names
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectDefinitionsName(lang, list) {
    for(const name of list) {
      this.statement.object.setObjectDefinitionName(lang, name);
    }
    return this;
  }

  /**
   * Add or set a description of the Object definition
   * @param {string} lang
   * @param {Set<string>} list list of the Object definition descriptions
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectDefinitionsDescription(lang, list) {
    for(const description of list) {
      this.statement.object.setObjectDefinitionDescription(lang, description);
    }
    return this;
  }
  /**
   * Add or set a name of the Object definition
   * @param {string} lang
   * @param {string} name name of the Object definition
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withObjectDefinitionName(lang, name) {
    this.statement.object.setObjectDefinitionName(lang, name);
    return this;
  }
  /**
   * Add or set a description of the Object definition
   * @param {string} lang
   * @param {string} description description of the Object definition
   * @return {StatementBuilder} Returns the current instance for chaining
   * */ 
  withObjectDefinitionDescription(lang, description) {
    this.statement.object.setObjectDefinitionDescription(lang, description);
    return this;
  }

  /**
   * Add or set an interaction component with language support (for interaction activities)
   * @param {string} type - One of 'choices', 'scale', 'source', 'target', 'steps'
   * @param {string} id - The identifier for the component
   * @param {string} lang - The language code (e.g., 'en')
   * @param {string} description - The description in the given language
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withInteractionWithLang(type, id, lang, description) {
    if(this.statement.object instanceof InteractionObjectStatement) {
      this.statement.object.addInteractionWithLang(type, id, lang, description);
    } else {
      if (this.client.settings.debug) {
        throw new Error("Trying to set interaction choice on a non-interaction object");
      } else {
        console.warn("Trying to set interaction choice on a non-interaction object");
        return this;
      }
    }
    return this;
  }

  /**
   * Add or set an interaction type for interaction activities
   * @param {string} type interaction type to set
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withInteractionType(type) {
    if(this.statement.object instanceof InteractionObjectStatement) {
      this.statement.object.setInteractionType(type);
    } else {
      if (this.client.settings.debug) {
        throw new Error("Trying to set interaction scale on a non-interaction object");
      } else {
        console.warn("Trying to set interaction choice on a non-interaction object");
        return this;
      }
    }
    return this;
  }
  
  /**
   * Add or set a correct responses pattern for interaction activities
   * @param {string|string[]} pattern correct responses pattern(s) to add
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withCorrectResponsesPattern(pattern) {
    if(this.statement.object instanceof InteractionObjectStatement) {
      this.statement.object.addCorrectResponsesPattern(pattern);
    } else {
      if (this.client.settings.debug) {
        throw new Error("Trying to set correct responses pattern on a non-interaction object");
      } else {
        console.warn("Trying to set correct responses pattern on a non-interaction object");
        return this;
      }
    }
    return this;
  }
  
  /**
   * Add or set an actor to the statement
   * @param {string} type - The type of the actor
   * @param {object} actor - The actor object
   * @return {StatementBuilder} Returns the current instance for chaining
   */
  withActor(type, actor) {
    if(this.statement instanceof LRSStatement) {
      this.statement.actor.setActor(type, actor);
    } else {
      if (this.client.settings.debug) {
        throw new Error("Trying to set actor on a non-LRS statement");
      } else {
        console.warn("Trying to set actor on a non-LRS statement");
      }
    }
    return this;
  }

  /**
   * Sends a statement to the queue and returns a promise that resolves when the statement is processed.
   *
   * @returns {Promise} The promise sent
   */
  async send() {
    if (!this._sendPromise) {
      // @ts-ignore
      this._sendPromise = await this.client.enqueue(this.statement);
    }
    return this._sendPromise;
  }
}