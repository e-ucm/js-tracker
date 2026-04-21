/**
 * The Object Class of a Statement
 */
export default class ObjectStatement {
    /**
     * Create an ObjectStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {ObjectStatement}
     */
    static fromXAPI(xapiObj: any, baseURI: string): ObjectStatement;
    /**
     * The constructor of the ObjectStatement class
     *
     * @param {string} id the id of the object
     * @param {string} type the type of the object
     * @param {string} baseURI the base URI for the object construction
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id: string, type: string, baseURI: string, language?: string, name?: string, description?: string);
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
    definitionType: string;
    /**
     * default URI for the object construction
     * @type {string}
     * */
    defaultURI: string;
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
     * The name of the Object
     *
     * @type {Map<string, string>}
     */
    definitionName: Map<string, string>;
    /**
     * The description of the Object
     *
     * @type {Map<string, string>}
     */
    definitionDescription: Map<string, string>;
    /**
     * Set the name of the Object definition
     * @param {string} lang - The language code
     * @param {string} name - The name of the Object definition
     */
    setObjectDefinitionName(lang: string, name: string): void;
    /**
     * Set the description of the Object definition
     * @param {string} lang - The language code
     * @param {string} description - The description of the Object definition
     */
    setObjectDefinitionDescription(lang: string, description: string): void;
    /**
     * Convert to xAPI object, including interaction activities if set
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
