/**
 * The Object Class of a Statement
 */
export default class InteractionObjectStatement extends ObjectStatement {
    /**
     * Create an InteractionObjectStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {InteractionObjectStatement}
     */
    static fromXAPI(xapiObj: any, baseURI: string): InteractionObjectStatement;
    /**
     * Constructor for InteractionObjectStatement
     * @param {string} objectId - The identifier of the object (IRI or UUID)
     * @param {string} objectType - The type of the object (IRI)
     * @param {string} defaultURI - The default base URI to resolve relative IDs
     */
    constructor(objectId: string, objectType: string, defaultURI: string);
    /**
        * The correctResponsesPattern property for interaction activities.
        * Internally it is always handled as an array of strings.
        * @type {string[]}
     */
    correctResponsesPattern: string[];
    /**
     * The interactionType property for interaction activities (e.g., 'choice', 'fill-in', 'long-fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric', 'other')
     * @type {string}
     */
    interactionType: string;
    /**
     * The choices, scale, source, target, and steps properties for interaction activities, which are arrays of objects with id and description
     * Each item in choices/scale should be an object with an 'id' and a 'description' that can be a string or an object with language keys
     * @type {Array<{id: string, description: string|object}>}
     */
    choices: Array<{
        id: string;
        description: string | object;
    }>;
    /**
     * The scale property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */
    scale: Array<{
        id: string;
        description: string | object;
    }>;
    /**
     * The source property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */
    source: Array<{
        id: string;
        description: string | object;
    }>;
    /**
     * The target property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */
    target: Array<{
        id: string;
        description: string | object;
    }>;
    /**
     * The steps property for interaction activities, which is an array of objects with id and description
     * @type {Array<{id: string, description: string|object}>}
     */
    steps: Array<{
        id: string;
        description: string | object;
    }>;
    /**
     * Set the interactionType for interaction activities
     * @param {typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES[keyof typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES]} interactionType
     */
    setInteractionType(interactionType: (typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES)[keyof typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES], debug?: boolean): void;
    /**
     * Set the correctResponsesPattern array
     * @param {string|string[]} pattern
     */
    addCorrectResponsesPattern(pattern: string | string[]): void;
    /**
     * Add a single choice with language support (for interaction activities)
     * @param {typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES[keyof typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES]} componentType - One of 'choices', 'scale', 'source', 'target', 'steps'
     * @param {string} id - The identifier for the choice
     * @param {string} lang - The language code (e.g., 'en')
     * @param {string} description - The description in the given language
     */
    addInteractionWithLang(componentType: (typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES)[keyof typeof STATEMENT.INTERACTIONOBJECT.INTERACTIONTYPES], id: string, lang: string, description: string): void;
}
import ObjectStatement from "./ObjectStatement.js";
import { STATEMENT } from "./Ids/Statements.js";
