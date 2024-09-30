export default class ObjectStatement {
    constructor(id, type, name = null, description = null) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description
    }
    
    typeIds = {
        // Completable
        game: 'https://w3id.org/xapi/seriousgames/activity-types/serious-game' ,
        session: 'https://w3id.org/xapi/seriousgames/activity-types/session',
        level: 'https://w3id.org/xapi/seriousgames/activity-types/level',
        quest: 'https://w3id.org/xapi/seriousgames/activity-types/quest',
        stage: 'https://w3id.org/xapi/seriousgames/activity-types/stage',
        combat: 'https://w3id.org/xapi/seriousgames/activity-types/combat',
        storynode: 'https://w3id.org/xapi/seriousgames/activity-types/story-node',
        race: 'https://w3id.org/xapi/seriousgames/activity-types/race',
        completable: 'https://w3id.org/xapi/seriousgames/activity-types/completable',
    
        // Acceesible
        screen: 'https://w3id.org/xapi/seriousgames/activity-types/screen' ,
        area: 'https://w3id.org/xapi/seriousgames/activity-types/area',
        zone: 'https://w3id.org/xapi/seriousgames/activity-types/zone',
        cutscene: 'https://w3id.org/xapi/seriousgames/activity-types/cutscene',
        accessible: 'https://w3id.org/xapi/seriousgames/activity-types/accessible',
    
        // Alternative
        question: 'http://adlnet.gov/expapi/activities/question' ,
        menu: 'https://w3id.org/xapi/seriousgames/activity-types/menu',
        dialog: 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree',
        path: 'https://w3id.org/xapi/seriousgames/activity-types/path',
        arena: 'https://w3id.org/xapi/seriousgames/activity-types/arena',
        alternative: 'https://w3id.org/xapi/seriousgames/activity-types/alternative',
    
        // GameObject
        enemy: 'https://w3id.org/xapi/seriousgames/activity-types/enemy' ,
        npc: 'https://w3id.org/xapi/seriousgames/activity-types/non-player-character',
        item: 'https://w3id.org/xapi/seriousgames/activity-types/item',
        gameobject: 'https://w3id.org/xapi/seriousgames/activity-types/game-object'
    };
    id;
    type;
    name;
    description;

    toXAPI() {
        var object= {}
        if(this.id) {
            object.id = this.id;
        }
        object.definition={}
        if(this.name) {
            object.definition.name = { "en-US": this.name };
        }
        if(this.description) {
            object.definition.description = { "en-US": this.description };
        }
        if(this.type) {
            object.definition.type = this.typeIds[this.type];
        }
        return object;
    }
}