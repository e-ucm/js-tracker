export const SERIOUSGAMEPROFILE = Object.freeze({
    CATEGORYID:  'https://w3id.org/xapi/seriousgame',
    VERBS: {
        //Completable Verbs
        INITIALIZED: 'http://adlnet.gov/expapi/verbs/initialized',
        PROGRESSED: 'http://adlnet.gov/expapi/verbs/progressed',
        COMPLETED: 'http://adlnet.gov/expapi/verbs/completed',
        //Accessible Verbs
        ACCESSED: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
        SKIPPED: 'http://id.tincanapi.com/verb/skipped',
        //Alternative Verbs
        SELECTED: 'https://w3id.org/xapi/adb/verbs/selected',
        UNLOCKED: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
        //GameObject Verbs
        INTERACTED: 'http://adlnet.gov/expapi/verbs/interacted',
        USED: 'https://w3id.org/xapi/seriousgames/verbs/used'
    },
    ACTIVITYTYPES: {
        // Completable
        GAME: 'https://w3id.org/xapi/seriousgames/activity-types/serious-game' ,
        SESSION: 'https://w3id.org/xapi/seriousgames/activity-types/session',
        LEVEL: 'https://w3id.org/xapi/seriousgames/activity-types/level',
        QUEST: 'https://w3id.org/xapi/seriousgames/activity-types/quest',
        STAGE: 'https://w3id.org/xapi/seriousgames/activity-types/stage',
        COMBAT: 'https://w3id.org/xapi/seriousgames/activity-types/combat',
        STORYNODE: 'https://w3id.org/xapi/seriousgames/activity-types/story-node',
        RACE: 'https://w3id.org/xapi/seriousgames/activity-types/race',
        COMPLETABLE: 'https://w3id.org/xapi/seriousgames/activity-types/completable',
        // Accessible
        SCREEN: 'https://w3id.org/xapi/seriousgames/activity-types/screen' ,
        AREA: 'https://w3id.org/xapi/seriousgames/activity-types/area',
        ZONE: 'https://w3id.org/xapi/seriousgames/activity-types/zone',
        CUTSCENE: 'https://w3id.org/xapi/seriousgames/activity-types/cutscene',
        ACCESSIBLE: 'https://w3id.org/xapi/seriousgames/activity-types/accessible',
        // Alternative
        QUESTION: 'http://adlnet.gov/expapi/activities/question' ,
        MENU: 'https://w3id.org/xapi/seriousgames/activity-types/menu',
        DIALOG: 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree',
        PATH: 'https://w3id.org/xapi/seriousgames/activity-types/path',
        ARENA: 'https://w3id.org/xapi/seriousgames/activity-types/arena',
        ALTERNATIVE: 'https://w3id.org/xapi/seriousgames/activity-types/alternative',
        // GameObject
        ENEMY: 'https://w3id.org/xapi/seriousgames/activity-types/enemy' ,
        NPC: 'https://w3id.org/xapi/seriousgames/activity-types/non-player-character',
        ITEM: 'https://w3id.org/xapi/seriousgames/activity-types/item',
        GAMEOBJECT: 'https://w3id.org/xapi/seriousgames/activity-types/game-object'
    }
});
