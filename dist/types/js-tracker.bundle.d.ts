export class JSTracker {
    static ACCESSIBLETYPE: Readonly<{
        SCREEN: 0;
        AREA: 1;
        ZONE: 2;
        CUTSCENE: 3;
        ACCESSIBLE: 4;
    }>;
    static COMPLETABLETYPE: Readonly<{
        GAME: 0;
        SESSION: 1;
        LEVEL: 2;
        QUEST: 3;
        STAGE: 4;
        COMBAT: 5;
        STORYNODE: 6;
        RACE: 7;
        COMPLETABLE: 8;
    }>;
    static ALTERNATIVETYPE: Readonly<{
        QUESTION: 0;
        MENU: 1;
        DIALOG: 2;
        PATH: 3;
        ARENA: 4;
        ALTERNATIVE: 5;
    }>;
    static GAMEOBJECTTYPE: Readonly<{
        ENEMY: 0;
        NPC: 1;
        ITEM: 2;
        GAMEOBJECT: 3;
    }>;
    static SCORMTYPE: Readonly<{
        SCO: 0;
        COURSE: 1;
        MODULE: 2;
        ASSESSMENT: 3;
        INTERACTION: 4;
        OBJECTIVE: 5;
        ATTEMPT: 6;
    }>;
    constructor(result_uri?: any, backup_uri?: any, backup_type?: any, actor_homepage?: any, actor_username?: any, auth_token?: any, default_uri?: any, debug?: any);
    tracker: xAPITrackerAsset;
    accessibleTracker: AccessibleTracker;
    completableTracker: CompletableTracker;
    alternativeTracker: AlternativeTracker;
    gameObjectTracker: GameObjectTracker;
    scormTracker: ScormTracker;
    sendBatch(): Promise<void>;
    sendBackup(): Promise<void>;
    generateXAPITrackerFromURLParams(default_uri: any): void;
}
declare class xAPITrackerAsset {
    constructor(endpoint: any, backup_endpoint: any, backup_type: any, actor_homePage: any, actor_name: any, auth_token: any, default_uri: any, debug: any, batchLength: any, batchTimeout: any, maxRetryDelay: any);
    xapi: any;
    endpoint: any;
    auth_token: any;
    online: boolean;
    statementsToSend: any[];
    sendingInProgress: any;
    offset: number;
    backup: boolean;
    backup_endpoint: any;
    backup_type: any;
    backupRequestParameters: any;
    actor: ActorStatement;
    actor_homePage: any;
    actor_name: any;
    context: ContextStatement;
    default_uri: any;
    debug: any;
    batchlength: number;
    batchtimeout: any;
    retryDelay: any;
    maxRetryDelay: any;
    timer: any;
    logout(): void;
    onOffline(): void;
    onOnline(): Promise<void>;
    updateAuth(): void;
    sendBatch(): Promise<void>;
    refreshAuth(): Promise<void>;
    startTimer(): void;
    Trace(verbId: any, objectType: any, objectId: any): StatementBuilder;
    sendBackup(): Promise<void>;
    enqueue(statement: any): Promise<void>;
}
declare class AccessibleTracker {
    constructor(tracker: any);
    tracker: any;
    AccessibleType: string[];
    Accessed(accessibleId: any, type: any): any;
    Skipped(accessibleId: any, type: any): any;
}
declare class CompletableTracker {
    constructor(tracker: any);
    tracker: any;
    CompletableType: string[];
    Initialized(completableId: any, type: any): any;
    Progressed(completableId: any, type: any, progress: any): any;
    Completed(completableId: any, type: any, success: any, completion: any, score: any): any;
}
declare class AlternativeTracker {
    constructor(tracker: any);
    tracker: any;
    AlternativeType: string[];
    Selected(alternativeId: any, optionId: any, type: any): any;
    Unlocked(alternativeId: any, optionId: any, type: any): any;
}
declare class GameObjectTracker {
    constructor(tracker: any);
    tracker: any;
    GameObjectType: string[];
    Interacted(gameobjectId: any, type: any): any;
    Used(gameobjectId: any, type: any): any;
}
declare class ScormTracker {
    constructor(tracker: any);
    tracker: any;
    ScormType: string[];
    Initialized(scoId: any): any;
    Suspended(scoId: any): any;
    Resumed(scoId: any): any;
    Terminated(scoId: any): any;
    Passed(activityId: any, type: any): any;
    Failed(activityId: any, type: any): any;
    Scored(activityId: any, type: any, score: any): any;
    Completed(activityId: any, type: any, success: any, completion: any, score: any): any;
}
/**
 * Actor Class of a Statement
 */
declare class ActorStatement {
    /**
     * Actor constructor
     * @param {string} accountName account name
     * @param {string} homepage account homepage
     */
    constructor(accountName: string, homepage: string);
    /**
     * Account name
     * @type {string}
     */
    accountName: string;
    /**
     * Account homePage
     * @type {string}
     */
    homepage: string;
    /**
     * convert to XAPI
     *
     * @returns Object
     */
    toXAPI(): {
        account: {
            name: string;
            homePage: string;
        };
    };
    /**
     * convert to CSV
     *
     * @returns String
     */
    toCSV(): string;
}
/**
 * The Context Class of a Statement
 */
declare class ContextStatement {
    /**
     * Constructor of the ContextStatement class
     *
     * @param {*} categoryId category Id of context
     * @param {*} registrationId registration id of context
     */
    constructor(categoryId?: any, registrationId?: any);
    /**
     * Registration Id of the Context
     *
     * @type {string}
     */
    registration: string;
    categoryId: any;
    category: any;
    /**
     * The category IDs list
     */
    categoryIDs: {
        seriousgame: string;
        scorm: string;
    };
    /**
     * convert to XAPI
     *
     * @returns Object
     */
    toXAPI(): {
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
    /**
     * convert to CSV
     *
     * @returns String
     */
    toCSV(): string;
}
declare class StatementBuilder {
    /**
     * @param  {xAPITrackerAsset} xapiClient  any client that has a `.sendStatement(statement)` → Promise
     * @param  {Statement} initial     a partial Statement (actor, verb, object…)
     */
    constructor(xapiClient: xAPITrackerAsset, initial: Statement);
    client: xAPITrackerAsset;
    statement: Statement;
    _promise: Promise<void>;
    withSuccess(success: any): this;
    withScore(raw?: any, min?: any, max?: any, scaled?: any): this;
    withScoreRaw(raw: any): this;
    withScoreMin(min: any): this;
    withScoreMax(max: any): this;
    withScoreScaled(scaled: any): this;
    withCompletion(value: any): this;
    withDuration(diffInSeconds: any): this;
    withResponse(value: any): this;
    withProgress(value: any): this;
    withResultExtension(key: any, value: any): this;
    withResultExtensions(ext?: {}): this;
    /**
     * let me run any function on the statement
     * fn can either mutate `stmt` in‐place, or return a brand new statement
     */
    apply(fn: any): this;
    then(onFulfilled: any, onRejected: any): Promise<void>;
    catch(onRejected: any): Promise<void>;
    finally(onFinally: any): Promise<void>;
}
/**
* Statement class
*/
declare class Statement {
    /**
     * Constructor of the Statement class
     * @param {ActorStatement} actor actor of the statement
     * @param {number} verbId verb id of the statement
     * @param {number} objectId object id of the statement
     * @param {string} objectType object Type of the statement
     * @param {ContextStatement} context context of the statement
     * @param {string} defaultURI default URI for the statement construction
     */
    constructor(actor: ActorStatement, verbId: number, objectId: number, objectType: string, context: ContextStatement, defaultURI: string);
    /**
     * Id of the statement
     * @type {string}
     */
    id: string;
    /**
     * Actor of the statement
     * @type {ActorStatement}
     */
    actor: ActorStatement;
    /**
     * Verb of the statement
     * @type {VerbStatement}
     */
    verb: VerbStatement;
    /**
     * default URI of the statement
     * @type {string}
     */
    defaultURI: string;
    /**
     * Object of the statement
     * @type {ObjectStatement}
     */
    object: ObjectStatement;
    /**
     * Timestamp of the statement
     * @type {Date}
     */
    timestamp: Date;
    /**
     * Context of the statement
     * @type {ContextStatement}
     */
    context: ContextStatement;
    /**
     * Version of the statement
     * @type {string}
     */
    version: string;
    /**
     * Result of the statement
     * @type {ResultStatement}
     */
    result: ResultStatement;
    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns string
     */
    setAsUri(id: string): string;
    /**
     * Check if the string is an URI
     * @param {string} id
     * @returns boolean
     */
    isUri(id: string): boolean;
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
     * @param {number} value the duration in second
     */
    setDuration(diffInSeconds: any): void;
    /**
     * Set response of the statement
     * @param {string} value the response
     */
    setResponse(value: string): void;
    /**
     * Set progress status of the statement
     * @param {boolean} value the progress status
     */
    setProgress(value: boolean): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {string} value the value of the extension
     */
    setVar(key: string, value: string): void;
    /**
     * Set result extension for key of the statement
     * @param {string} key the key of the extension
     * @param {string} value the value of the extension
     */
    addResultExtension(key: string, value: string): void;
    /**
     * Set result extension as Object key/values of the statement
     * @param {Object} extensions extensions list
     */
    addResultExtensions(extensions: any): void;
    /**
     * Convert to xAPI format
     * @returns Object
     */
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
            response: string;
            score: any;
            duration: string;
            extensions: any;
        };
    };
    /**
     * Convert to CSV format
     *
     * @returns string
     */
    toCSV(): string;
}
/**
 * The Verb Class  of a Statement
 */
declare class VerbStatement {
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
     * @returns Object
     */
    toXAPI(): {
        id: string;
        display: {
            en: string;
        };
    };
    /**
     * convert to CSV
     *
     * @returns String
     */
    toCSV(): string;
}
/**
 * The Object Class of a Statement
 */
declare class ObjectStatement {
    /**
     * The constructor of the ObjectStatement class
     *
     * @param {string} id the id of the object
     * @param {string} type the type of the object
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id: string, type: string, name?: string, description?: string);
    /**
     * The ID of the Object
     *
     * @type {string}
     */
    id: string;
    /**
     * The type of the Object
     *
     * @type {string}
     */
    type: string;
    /**
     * The name of the Object
     *
     * @type {string}
     */
    name: string;
    /**
     * The description of the Object
     *
     * @type {string}
     */
    description: string;
    /**
     * The Type IDs list for Objects
     */
    typeIds: {
        game: string;
        session: string;
        level: string;
        quest: string;
        stage: string;
        combat: string;
        storynode: string;
        race: string;
        completable: string;
        screen: string;
        area: string;
        zone: string;
        cutscene: string;
        accessible: string;
        question: string;
        menu: string;
        dialog: string;
        path: string;
        arena: string;
        alternative: string;
        enemy: string;
        npc: string;
        item: string;
        gameobject: string;
        course: string;
        module: string;
        SCO: string;
        assessment: string;
        interaction: string;
        cmi_interaction: string;
        objective: string;
        attempt: string;
        profile: string;
    };
    /**
     * The Extensions IDs for Objects
     */
    ExtensionIDs: {
        extended_interaction_type: string;
    };
    /**
     * convert to XAPI
     *
     * @returns Object
     */
    toXAPI(): {
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
    /**
     * convert to CSV
     *
     * @returns String
     */
    toCSV(): string;
}
/**
 * The Result Class of a Statement
 */
declare class ResultStatement {
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
     * @returns boolean
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
     * @param {string} value the value of the extension
     */
    setExtension(key: string, value: string): void;
    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns string
     */
    setAsUri(id: string): string;
    /**
     * Check if the string is an URI
     * @param {string} id
     * @returns boolean
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
     * @returns Object
     */
    toXAPI(): {
        success: boolean;
        completion: boolean;
        response: string;
        score: any;
        duration: string;
        extensions: any;
    };
    /**
     * convert to CSV
     *
     * @returns String
     */
    toCSV(): string;
}
export {};
