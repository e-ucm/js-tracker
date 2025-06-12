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
    constructor(result_uri?: any, backup_uri?: any, backup_type?: any, actor_homepage?: any, actor_username?: any, auth_token?: any, default_uri?: any, debug?: any);
    Tracker: xAPITrackerAsset;
    AccessibleTracker: AccessibleTracker;
    CompletableTracker: CompletableTracker;
    AlternativeTracker: AlternativeTracker;
    GameObjectTracker: GameObjectTracker;
    ScormTracker: ScormTracker;
    generateXAPITrackerFromURLParams(default_uri: any): void;
    completableTracker: CompletableTracker;
}
import xAPITrackerAsset = require("./xAPITrackerAsset.js");
import { AccessibleTracker } from "./HighLevel/Accessible.js";
import { CompletableTracker } from "./HighLevel/Completable.js";
import { AlternativeTracker } from "./HighLevel/Alternative.js";
import { GameObjectTracker } from "./HighLevel/GameObject.js";
import { ScormTracker } from "./HighLevel/ScormTracker.js";
