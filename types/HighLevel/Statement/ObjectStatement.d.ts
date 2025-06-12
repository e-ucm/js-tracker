export = ObjectStatement;
declare class ObjectStatement {
    constructor(id: any, type: any, name?: any, description?: any);
    id: any;
    type: any;
    name: any;
    description: any;
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
        id: any;
        definition: {
            name: {
                "en-US": any;
            };
            description: {
                "en-US": any;
            };
            type: any;
        };
    };
    toCSV(): string;
}
