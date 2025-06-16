export = JSTracker;
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
    /**
     * @param {string} endpoint
     * @param {string} backup_endpoint
     * @param {string} backup_type
     * @param {string} actor_homePage
     * @param {string} actor_name
     * @param {string} auth_token
     * @param {string}  default_uri
     * @param {boolean} debug
     * @param {string} batchLength
     * @param {string} batchTimeout
     * @param {string} maxRetryDelay
     *
     */
    constructor(endpoint?: string, backup_endpoint?: string, backup_type?: string, actor_homePage?: string, actor_name?: string, auth_token?: string, default_uri?: string, debug?: boolean, batchLength?: string, batchTimeout?: string, maxRetryDelay?: string);
    /**
     * @type {xAPITrackerAsset}
     */
    Tracker: xAPITrackerAsset;
    /**
     * @type {AccessibleTracker}
     */
    AccessibleTracker: AccessibleTracker;
    /**
     * @type {CompletableTracker}
     */
    CompletableTracker: CompletableTracker;
    /**
     * @type {AlternativeTracker}
     */
    AlternativeTracker: AlternativeTracker;
    /**
     * @type {GameObjectTracker}
     */
    GameObjectTracker: GameObjectTracker;
    /**
     * @type {ScormTracker}
     */
    ScormTracker: ScormTracker;
    /**
     * @param {string} default_uri
     */
    generateXAPITrackerFromURLParams(default_uri: string): void;
    completableTracker: CompletableTracker;
}
import xAPITrackerAsset = require("./xAPITrackerAsset.js");
import { AccessibleTracker } from "./HighLevel/Accessible.js";
import { CompletableTracker } from "./HighLevel/Completable.js";
import { AlternativeTracker } from "./HighLevel/Alternative.js";
import { GameObjectTracker } from "./HighLevel/GameObject.js";
import { ScormTracker } from "./HighLevel/ScormTracker.js";
