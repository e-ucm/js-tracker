import { isUri, setAsUri } from "./helper.js";

/**
 * The Object Class of a Statement
 */
export default class ObjectStatement {
    /**
     * The constructor of the ObjectStatement class
     * 
     * @param {string} id the id of the object
     * @param {string} type the type of the object
     * @param {string} baseURI the base URI for the object construction
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id, type, baseURI, language = "en", name = null, description = null) {
        if(isUri(id)) {
            this.id = id;
        } else {
            this.id = setAsUri(id, baseURI);
        }
        if(isUri(type)) {
            this.definitionType = type;
        } else {
            if(type in this.typeIds) {
                this.definitionType = this.typeIds[type];
            } else {
                this.definitionType = setAsUri(type, baseURI);
            }
        }
        if(name) {
            this.definitionName.set(language, name);
        }
        if(description) {
            this.definitionDescription.set(language, description);
        }
        this.defaultURI = baseURI;
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
    definitionType;
    /**
     * The name of the Object
     * 
     * @type {Map<string, string>}
     */
    definitionName = new Map();
    /**
     * The description of the Object
     * 
     * @type {Map<string, string>}
     */
    definitionDescription = new Map();

    /**
     * default URI for the object construction
     * @type {string}
     * */
    defaultURI;

    /**
     * Set the name of the Object definition
     * @param {string} lang - The language code
     * @param {string} name - The name of the Object definition
     */
    setObjectDefinitionName(lang, name) {
        this.definitionName.set(lang, name);
    }

    /**
     * Set the description of the Object definition
     * @param {string} lang - The language code
     * @param {string} description - The description of the Object definition
     */
    setObjectDefinitionDescription(lang, description) {
        this.definitionDescription.set(lang, description);
    }

    /**
     * Convert to xAPI object, including interaction activities if set
     * @returns {Object}
     */
    toXAPI() {
        var object = {};
        if (this.id) {
            object.id = this.id;
        }
        object.definition = {};
        if (this.definitionName && this.definitionName.size > 0) {
            object.definition.name = Object.fromEntries(this.definitionName);
        }
        if (this.definitionDescription && this.definitionDescription.size > 0) {
            object.definition.description = Object.fromEntries(this.definitionDescription);
        }
        if (this.definitionType) {
            object.definition.type = this.typeIds[this.definitionType] ? this.typeIds[this.definitionType] : this.definitionType;
        }
        return object;
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.definitionType + ',' + this.id.replaceAll(',', '\\,');
    }
}