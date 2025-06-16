export = ObjectStatement;
declare class ObjectStatement {
    /**
     * @param {string} id
     * @param {string} type
     * @param {string} name
     * @param {string} description
     */
    constructor(id: string, type: string, name?: string, description?: string);
    id: string;
    type: string;
    name: string;
    description: string;
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
        id: string;
        definition: {
            name: {
                "en-US": string;
            };
            description: {
                "en-US": string;
            };
            type: any;
        };
    };
    /**
     * @returns {string}
     */
    toCSV(): string;
}
