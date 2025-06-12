export { JSTracker as default };
declare module 'js-tracker' {
declare class JSTracker {
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
    Trace(verbId: any, objectType: any, objectId: any): Statement;
    sendBackup(): Promise<void>;
    enqueue(statement: any): Promise<void>;
}
declare class AccessibleTracker {
    constructor(tracker: any);
    tracker: any;
    AccessibleType: string[];
    Accessed(accessibleId: any, type: any): any;
    Skipped(accessibleId: any, type: any): any;
    enqueue(statement: any): Promise<void>;
}
declare class CompletableTracker {
    constructor(tracker: any);
    tracker: any;
    CompletableType: string[];
    Initialized(completableId: any, type: any): any;
    Progressed(completableId: any, type: any, progress: any): any;
    Completed(completableId: any, type: any, success: any, completion: any, score: any): any;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
declare class AlternativeTracker {
    constructor(tracker: any);
    tracker: any;
    AlternativeType: string[];
    Selected(alternativeId: any, optionId: any, type: any): any;
    Unlocked(alternativeId: any, optionId: any, type: any): any;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
declare class GameObjectTracker {
    constructor(tracker: any);
    tracker: any;
    GameObjectType: string[];
    Interacted(gameobjectId: any, type: any): any;
    Used(gameobjectId: any, type: any): any;
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
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
    /**
     * @param {Statement} statement
     *
     */
    enqueue(statement: Statement): Promise<void>;
}
declare class ActorStatement {
    constructor(token: any, accountName: any, homepage: any);
    token: any;
    accountName: any;
    homepage: any;
    toXAPI(): {
        account: {
            name: any;
            homePage: any;
        };
    };
    toCSV(): any;
}
declare class ContextStatement {
    constructor(categoryId?: string, registrationId?: any);
    registration: string;
    categoryId: any;
    category: string;
    categoryIDs: {
        seriousgame: string;
        scorm: string;
    };
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
    toCSV(): string;
}
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
declare class VerbStatement {
    constructor(verbId: any);
    verbId: any;
    verbDisplay: any;
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
        id: any;
        display: {
            en: any;
        };
    };
    toCSV(): any;
}
declare class ObjectStatement {
    constructor(id: any, type: any, name?: any, description?: any);
    id: any;
    type: any;
    name: any;
    description: any;
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
    ExtensionIDs: {
        extended_interaction_type: string;
    };
    toXAPI(): {
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
    toCSV(): string;
}
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
}