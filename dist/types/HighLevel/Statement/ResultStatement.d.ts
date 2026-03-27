/**
 * The Result Class of a Statement
 */
export default class ResultStatement {
    /**
     * Constructor of the ResultStatement class
     *
     * @param {string} defautURI The default URI for the extensions
     */
    constructor(defautURI: string);
    /**
     * The ID of the Result
     *
     * @type {string}
     */
    defautURI: string;
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
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns {String}
     */
    setAsUri(id: string): string;
    /**
     * Check if the string is an URI
     * @param {string} id
     * @returns {boolean}
     */
    isUri(id: string): boolean;
    /**
     * Set the score of the statement
     * @param {string} key the key for the score
     * @param {number} value the score
     */
    setScoreValue(key: string, value: number): void;
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
