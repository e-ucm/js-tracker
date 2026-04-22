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
     * @param {typeof ALL.ACTIVITYTYPES[keyof typeof ALL.ACTIVITYTYPES]|string} type the type of the object
     * @param {string} baseURI the base URI for the object construction
     * @param {string} language the language for the name and description (default: "en")
     * @param {string} name the name of the object
     * @param {string} description the description of the object
     */
    constructor(id: string, type: (typeof ALL.ACTIVITYTYPES)[keyof typeof ALL.ACTIVITYTYPES] | string, baseURI: string, language?: string, name?: string, description?: string);
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
     * The extensions of the Object definition
     *
     * @type {Object}
     */
    definitionExtensions: any;
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
     * Set the extensions of the Object definition
     * @param {Object} ext extensions object
     */
    setExtensions(ext: any): void;
    /**
     * Add or set a single extension key-value pair in the Object definition
     * @param {typeof ALL.ACTIVITYEXTENSION[keyof typeof ALL.ACTIVITYEXTENSION]|string} key extension key
     * @param {any} value extension value
     */
    setExtension(key: (typeof ALL.ACTIVITYEXTENSION)[keyof typeof ALL.ACTIVITYEXTENSION] | string, value: any): void;
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
import { ALL } from "./Ids/Profiles/Generated/index.js";
