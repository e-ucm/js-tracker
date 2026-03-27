/**
 * The Verb Class  of a Statement
 */
export default class VerbStatement {
    /**
     * Constructor of VerbStatement class
     *
     * @param {string} verbDisplay The verb display id of the statement
     */
    constructor(verbDisplay: string);
    /**
     * The Verb Id
     * @type {string}
     */
    verbId: string;
    /**
     * The Verb display
     * @type {string}
     */
    verbDisplay: string;
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
