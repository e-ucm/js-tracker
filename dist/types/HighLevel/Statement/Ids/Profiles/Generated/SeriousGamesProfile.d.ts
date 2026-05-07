export const SERIOUSGAMESPROFILE: Readonly<{
    CATEGORYID: "https://w3id.org/xapi/seriousgames/v1.0";
    VERBS: {
        ACCESSED: string;
        PRESSED: string;
        RELEASED: string;
        UNLOCKED: string;
        USED: string;
    };
    ACTIVITYTYPES: {
        AREA: string;
        CONTROLLER: string;
        CUTSCENE: string;
        DIALOG_TREE: string;
        ENEMY: string;
        ITEM: string;
        KEYBOARD: string;
        LEVEL: string;
        MENU: string;
        MOUSE: string;
        NON_PLAYER_CHARACTER: string;
        QUEST: string;
        SCREEN: string;
        SERIOUS_GAME: string;
        TOUCHSCREEN: string;
        ZONE: string;
    };
    ACTIVITYEXTENSION: {};
    CONTEXTEXTENSION: {};
    RESULTEXTENSION: {
        HEALTH: string;
        POSITION: string;
        PROGRESS: string;
    };
}>;
