export = ContextStatement;
declare class ContextStatement {
    constructor(categoryId?: string, registrationId?: any);
    registration: string;
    categoryId: any;
    category: string;
    categoryIDs: {
        seriousgame: string;
        scorm: string;
    };
    toXAPI(): {
        registration: string;
        contextActivities: {
            category: {
                id: any;
                definition: {
                    type: string;
                };
            }[];
        };
    };
    toCSV(): string;
}
