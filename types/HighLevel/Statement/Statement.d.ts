export = Statement;
declare class Statement {
    /**
     * @param {ActorStatement} actor
     * @param {string} verbId
     * @param {string} objectId
     * @param {string} objectType
     * @param {ContextStatement} context
     * @param {string} defautURI
     */
    constructor(actor: ActorStatement, verbId: string, objectId: string, objectType: string, context: ContextStatement, defautURI: string);
    id: string;
    actor: ActorStatement;
    verb: VerbStatement;
    defautURI: string;
    object: ObjectStatement;
    timestamp: Date;
    context: ContextStatement;
    version: string;
    result: ResultStatements;
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
     * @param {number} raw
     * @param {number} min
     * @param {number} max
     * @param {number} scaled
     */
    setScore(raw: number, min?: number, max?: number, scaled?: number): void;
    /**
     * @param {number} raw
     */
    setScoreRaw(raw: number): void;
    /**
     * @param {number} min
     */
    setScoreMin(min: number): void;
    /**
     * @param {number} max
     */
    setScoreMax(max: number): void;
    /**
     * @param {number} scaled
     */
    setScoreScaled(scaled: number): void;
    /**
     * @param {boolean} value
     */
    setCompletion(value: boolean): void;
    /**
     * @param {boolean} value
     */
    setSuccess(value: boolean): void;
    /**
     * @param {number} diffInSeconds
     */
    setDuration(diffInSeconds: number): void;
    /**
     * @param {string} value
     */
    setResponse(value: string): void;
    /**
     * @param {number} value
     */
    setProgress(value: number): void;
    /**
     * @param {string} key
     * @param {any} value
     */
    setVar(key: string, value: any): void;
    /**
     * @param {string} key
     * @param {any} value
     */
    addResultExtension(key: string, value: any): void;
    toXAPI(): {
        id: string;
        actor: {
            account: {
                name: string;
                homePage: string;
            };
        };
        verb: {
            id: string;
            display: {
                en: string;
            };
        };
        object: {
            id: string;
            definition: {
                name: {
                    "en-US": string;
                };
                description: {
                    "en-US": string;
                };
                type: any;
            };
        };
        timestamp: string;
        context: {
            registration: string;
            contextActivities: {
                category: {
                    id: any;
                    definition: {
                        type: string;
                    };
                }[];
            };
        };
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
    /**
     * @returns {string}
     */
    toCSV(): string;
}
import ActorStatement = require("./ActorStatement.js");
import VerbStatement = require("./VerbStatement.js");
import ObjectStatement = require("./ObjectStatement.js");
import ContextStatement = require("./ContextStatement.js");
import ResultStatements = require("./ResultStatement.js");
