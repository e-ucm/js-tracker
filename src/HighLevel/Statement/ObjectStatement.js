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
        this.definitionType = setAsUri(type, baseURI);
        if(name) {
            this.definitionName.set(language, name);
        }
        if(description) {
            this.definitionDescription.set(language, description);
        }
        this.defaultURI = baseURI;
    }

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
            object.definition.type = this.definitionType;
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

    /**
     * Create an ObjectStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {ObjectStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return null;
        const id = xapiObj.id;
        const type = xapiObj.definition && xapiObj.definition.type ? xapiObj.definition.type : undefined;
        const obj = new ObjectStatement(id, type, baseURI);
        for (const [lang, name] of Object.entries(xapiObj.definition?.name || {})) {
            obj.setObjectDefinitionName(lang, name);
        }
        for (const [lang, desc] of Object.entries(xapiObj.definition?.description || {})) {
            obj.setObjectDefinitionDescription(lang, desc);
        }
        return obj;
    }
}