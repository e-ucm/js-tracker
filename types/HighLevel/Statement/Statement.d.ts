export = Statement;
declare class Statement {
    constructor(actor: any, verbId: any, objectId: any, objectType: any, context: any, defautURI: any);
    id: string;
    actor: any;
    verb: VerbStatement;
    defautURI: any;
    object: ObjectStatement;
    timestamp: Date;
    context: any;
    version: string;
    result: ResultStatements;
    setAsUri(id: any): any;
    isUri(id: any): boolean;
    setScore(raw: any, min: any, max: any, scaled: any): void;
    setScoreRaw(raw: any): void;
    setScoreMin(min: any): void;
    setScoreMax(max: any): void;
    setScoreScaled(scaled: any): void;
    setCompletion(value: any): void;
    setSuccess(value: any): void;
    setDuration(diffInSeconds: any): void;
    setResponse(value: any): void;
    setProgress(value: any): void;
    setVar(key: any, value: any): void;
    addResultExtension(key: any, value: any): void;
    toXAPI(): {
        id: string;
        actor: any;
        verb: {
            id: any;
            display: {
                en: any;
            };
        };
        object: {
            id: any;
            definition: {
                name: {
                    "en-US": any;
                };
                description: {
                    "en-US": any;
                };
                type: any;
            };
        };
        timestamp: string;
        context: any;
        version: string;
        result: {
            success: boolean;
            completion: boolean;
            response: any;
            score: any;
            duration: any;
            extensions: {};
        };
    };
    toCSV(): string;
}
import VerbStatement = require("./VerbStatement.js");
import ObjectStatement = require("./ObjectStatement.js");
import ResultStatements = require("./ResultStatement.js");
