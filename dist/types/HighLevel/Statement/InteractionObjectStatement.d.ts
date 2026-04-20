/**
 * The Object Class of a Statement
 */
export default class InteractionObjectStatement extends ObjectStatement {
    constructor(objectId: any, objectType: any, defaultURI: any);
    /**
     * Set the interactionType for interaction activities
     * @param {string} interactionType
     */
    setInteractionType(interactionType: string, debug?: boolean): void;
    interactionType: string;
    /**
     * Set the correctResponsesPattern array
     * @param {string|string[]} pattern
     */
    addCorrectResponsesPattern(pattern: string | string[]): void;
    correctResponsesPattern: any[];
    /**
     * Add a single choice with language support (for interaction activities)
     * @param {string} componentType - One of 'choices', 'scale', 'source', 'target', 'steps'
     * @param {string} id - The identifier for the choice
     * @param {string} lang - The language code (e.g., 'en')
     * @param {string} description - The description in the given language
     */
    addInteractionWithLang(componentType: string, id: string, lang: string, description: string): void;
}
import ObjectStatement from "./ObjectStatement.js";
