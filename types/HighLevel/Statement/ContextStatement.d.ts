export = ContextStatement;
declare class ContextStatement {
    /**
     * @param {string} categoryId
     * @param {string} registrationId
     */
    constructor(categoryId?: string, registrationId?: string);
    /**
     * @type {string}
     */
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
    /**
     * @returns {string}
     */
    toCSV(): string;
}
