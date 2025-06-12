export = ResultStatements;
declare class ResultStatements {
    constructor(defautURI: any);
    defautURI: any;
    parent: any;
    Score: any;
    Success: any;
    Completion: any;
    Response: any;
    Duration: any;
    Extensions: {};
    isEmpty(): boolean;
    ExtensionIDs: {
        health: string;
        position: string;
        progress: string;
        interactionID: string;
        response_explanation: string;
        response_type: string;
    };
    setExtensions(extensions: any): void;
    setExtension(key: any, value: any): void;
    setAsUri(id: any): any;
    isUri(id: any): boolean;
    setScoreValue(key: any, value: any): void;
    toXAPI(): {
        success: boolean;
        completion: boolean;
        response: any;
        score: any;
        duration: any;
        extensions: {};
    };
    toCSV(): string;
}
