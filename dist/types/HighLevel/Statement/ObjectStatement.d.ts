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
