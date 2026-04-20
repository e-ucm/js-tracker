/**
 * The Result Class of a Statement
 */
export default class ResultStatement {
    /**
     * Constructor of the ResultStatement class
     *
     * @param {string} defaultURI The default URI for the extensions
     */
    constructor(defaultURI: string);
    /**
     * The ID of the Result
     *
     * @type {string}
     */
    defaultURI: string;
    /**
     * The Score of the Result
     *
     * @type {Object}
     */
    Score: any;
    /**
     * The success status of the Result
     *
     * @type {boolean}
     */
    Success: boolean;
    /**
     * The Completion status of the Result
     *
     * @type {boolean}
     */
    Completion: boolean;
    /**
     * The response of the Result
     *
     * @type {string}
     */
    Response: string;
    /**
     * The duration of the Result
     *
     * @type {string}
     */
    Duration: string;
    /**
     * The Extensions of the Result
     *
     * @type {Object}
     */
    Extensions: any;
    /**
     * Check if the result is empty or not
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * The possible extensions of a result statement
     */
    ExtensionIDs: {
        health: string;
        position: string;
        progress: string;
        interactionID: string;
        response_explanation: string;
        response_type: string;
    };
    /**
     * The Score Keys for the result
     */
    ScoreKey: string[];
    /**
     * Set extensions from list
     * @param {Object} extensions extension list
     */
    setExtensions(extensions: any): void;
    /**
     * Set result extension for key value
     * @param {string} key the key of the extension
     * @param {*} value the value of the extension
     */
    setExtension(key: string, value: any): void;
    /**
     * Set the score of the statement
     * @param {string} key the key for the score
     * @param {number} value the score
     */
    setScoreValue(key: string, value: number): void;
    /**
 * Set the score of the statement
 * @param {number} raw the raw score
 * @param {number} min the min score
 * @param {number} max the max score
 * @param {number} scaled the scaled score
 */
    setScore(raw: number, min: number, max: number, scaled: number): void;
    /**
 * Set the raw score of the statement
 * @param {number} raw the raw score
 */
    setScoreRaw(raw: number): void;
    /**
     * Set the min score of the statement
     * @param {number} min the min score
     */
    setScoreMin(min: number): void;
    /**
     * Set the max score of the statement
     * @param {number} max the max score
     */
    setScoreMax(max: number): void;
    /**
     * Set the scaled score of the statement
     * @param {number} scaled the scaled score
     */
    setScoreScaled(scaled: number): void;
    /**
     * Set completion status of the statement
     * @param {boolean} value the completion status
     */
    setCompletion(value: boolean): void;
    /**
     * Set success status of the statement
     * @param {boolean} value the success status
     */
    setSuccess(value: boolean): void;
    /**
     * Set duration of the statement
     * @param {Date} init init date of statement
     * @param {Date} end end date of statement
     */
    setDuration(init: Date, end: Date): void;
    /**
     * Set response of the statement
     * @param {string} value the response
     */
    setResponse(value: string): void;
    /**
     * Set progress status of the statement
     * @param {number} value the progress status
     */
    setProgress(value: number): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {string} value the value of the extension
     */
    setVar(key: string, value: string): void;
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
