/**
 * The Verb Class  of a Statement
 */
export default class VerbStatement {
    /**
     * Constructor of VerbStatement class
     *
     * @param {string} verbId The verb id of the statement
     * @param {string} baseURI The base URI for the statement
     */
    constructor(verbId: string, baseURI: string);
    /**
     * The Verb Id
     * @type {string}
     */
    verbId: string;
    /**
     * The Verb Ids array
     */
    verbIds: {
        initialized: string;
        progressed: string;
        completed: string;
        accessed: string;
        skipped: string;
        selected: string;
        unlocked: string;
        interacted: string;
        used: string;
        responded: string;
        resumed: string;
        suspended: string;
        terminated: string;
        passed: string;
        failed: string;
        scored: string;
    };
    /**
     * The Verb display
     * @type {Map<string, string>}
     */
    verbDisplay: Map<string, string>;
    /**
     * Add or set a verb display
     * @param {string} lang
     * @param {string} display
     */
    addDisplay(lang: string, display: string): void;
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
