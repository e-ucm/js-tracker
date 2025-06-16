export = VerbStatement;
declare class VerbStatement {
    /**
     * @param {string} verbId
     */
    constructor(verbId: string);
    /**
     * @type {string}
     */
    verbId: string;
    /**
     * @type {string}
     */
    verbDisplay: string;
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
    toXAPI(): {
        id: string;
        display: {
            en: string;
        };
    };
    /**
     * @returns {string}
     */
    toCSV(): string;
}
