export = ResultStatements;
declare class ResultStatements {
    /**
     * @param {string} defautURI
     */
    constructor(defautURI: string);
    defautURI: string;
    parent: any;
    Score: any;
    Success: any;
    Completion: any;
    Response: any;
    Duration: any;
    Extensions: {};
    /**
     * @returns {boolean}
     */
    isEmpty(): boolean;
    ExtensionIDs: {
        health: string;
        position: string;
        progress: string;
        interactionID: string;
        response_explanation: string;
        response_type: string;
    };
    /**
     * @param {Array} extensions
     */
    setExtensions(extensions: any[]): void;
    /**
     * @param {string} key
     * @param {any} value
     */
    setExtension(key: string, value: any): void;
    /**
     * @param {string} id
     * @returns {string}
     */
    setAsUri(id: string): string;
    /**
     * @param {string} id
     * @returns {boolean}
     */
    isUri(id: string): boolean;
    /**
     * @param {string} key
     * @param {number} value
     */
    setScoreValue(key: string, value: number): void;
    toXAPI(): {
        success: boolean;
        completion: boolean;
        response: any;
        score: any;
        duration: any;
        extensions: {};
    };
    /**
     * @returns {string}
     */
    toCSV(): string;
}
