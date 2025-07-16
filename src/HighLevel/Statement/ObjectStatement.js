/**
 * The Object Class of a Statement
 */
export default class ObjectStatement {
    /**
     * The constructor of the ObjectStatement class
     * 
     * @param {string} id the id of the object
     * @param {string} type the type of the object
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id, type, name = null, description = null) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.description = description;
    }
    
    /**
     * The Type IDs list for Objects
     */
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
        gameobject: 'https://w3id.org/xapi/seriousgames/activity-types/game-object',

        // SCORM
        course: 'http://adlnet.gov/expapi/activities/course',
        module: 'http://adlnet.gov/expapi/activities/module',
        SCO: 'http://adlnet.gov/expapi/activities/lesson',
        assessment: 'http://adlnet.gov/expapi/activities/assessment',
        interaction: 'http://adlnet.gov/expapi/activities/interaction',
        cmi_interaction: "http://adlnet.gov/expapi/activities/cmi.interaction",
        objective: 'http://adlnet.gov/expapi/activities/objective',
        attempt: 'http://adlnet.gov/expapi/activities/attempt',
        profile: 'http://adlnet.gov/expapi/activities/profile'
    };

    /**
     * The Extensions IDs for Objects
     */
    ExtensionIDs = {
      extended_interaction_type: "https://w3id.org/xapi/netc-assessment/extensions/activity/extended-interaction-type",
    };

    /**
     * The ID of the Object
     * 
     * @type {string}
     */
    id;
    /**
     * The type of the Object
     * 
     * @type {string}
     */
    type;
    /**
     * The name of the Object
     * 
     * @type {string}
     */
    name;
    /**
     * The description of the Object
     * 
     * @type {string}
     */
    description;

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        var object= {};
        if(this.id) {
            object.id = this.id;
        }
        object.definition={};
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

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.typeIds[this.type].replaceAll(',','\\,') + ',' + this.id.replaceAll(',', '\\,');
    }
}