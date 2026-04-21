import { isUri, setAsUri } from "./helper.js";
import ObjectStatement from "./ObjectStatement.js";

/**
 * The Object Class of a Statement
 */
export default class InteractionObjectStatement extends ObjectStatement {
    constructor(objectId, objectType, defaultURI) {
        super(objectId, objectType, defaultURI);
    }

    /**
     * Set the interactionType for interaction activities
     * @param {string} interactionType
     */
    setInteractionType(interactionType, debug = false) {
        if(!this.interactionType) {
            this.interactionType = interactionType; // Set interactionType based on the first component type added if not already set
        } else if (this.interactionType !== interactionType) {
            // Handle case where component type differs from existing interactionType
            if (debug) {
                throw new Error(`Component type ${interactionType} does not match existing interactionType ${this.interactionType}`);
            } else {
                console.warn(`Adding component of type ${interactionType} to interaction with interactionType ${this.interactionType}`);
                return;
            }
        }
    }

    /**
     * Set the correctResponsesPattern array
     * @param {string|string[]} pattern
     */
    addCorrectResponsesPattern(pattern) {
        if (!this.correctResponsesPattern) {
            this.correctResponsesPattern = [];
        }
        if (Array.isArray(pattern)) {
            this.correctResponsesPattern.push(...pattern);
        } else {
            this.correctResponsesPattern.push(pattern);
        }
    }

    /**
     * Add a single choice with language support (for interaction activities)
     * @param {string} componentType - One of 'choices', 'scale', 'source', 'target', 'steps'
     * @param {string} id - The identifier for the choice
     * @param {string} lang - The language code (e.g., 'en')
     * @param {string} description - The description in the given language
     */
    addInteractionWithLang(componentType, id, lang, description) {
        if (["choices", "scale", "source", "target", "steps"].includes(componentType)) {
            if (!this[componentType]) {
                this[componentType] = [];
            }
            // Check if choice with this id exists
            let existing = this[componentType].find(c => c.id === id);
            if (existing) {
                existing.description[lang] = description;
            } else {
                let desc = {};
                desc[lang] = description;
                this[componentType].push({ id, description: desc });
            }
        }
    }

    toXAPI() {
        var object = super.toXAPI();
        // Add interaction activity properties if present
        if (this.interactionType) {
            object.definition.interactionType = this.interactionType;
        }
        if (this.correctResponsesPattern) {
            object.definition.correctResponsesPattern = this.correctResponsesPattern;
        }
        ["choices", "scale", "source", "target", "steps"].forEach((key) => {
            if (this[key]) {
                // For choices/scale, ensure each item is {id, description: {lang: text}}
                if ((key === "choices" || key === "scale") && Array.isArray(this[key])) {
                    object.definition[key] = this[key].map(item => {
                        if (item.id && item.description && typeof item.description === 'object') {
                            return { id: item.id, description: item.description };
                        } else if (item.id && typeof item.description === 'string') {
                            // fallback: wrap string in default lang
                            return { id: item.id, description: { en: item.description } };
                        } else {
                            return item;
                        }
                    });
                } else {
                    object.definition[key] = this[key];
                }
            }
        });
        return object;
    }

    toCSV() {
        let csv = super.toCSV();
        if (this.interactionType) {
            csv += `,${this.interactionType}`;
        }
        if (this.correctResponsesPattern) {
            csv += `,${this.correctResponsesPattern.join('|')}`;
        }
        ["choices", "scale", "source", "target", "steps"].forEach((key) => {
            if (this[key]) {
                csv += `,${key}:${this[key].map(item => item.id).join('|')}`;
            }
        });
        return csv;
    }

    /**
     * Create an InteractionObjectStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {InteractionObjectStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return null;
        const id = xapiObj.id;
        const type = xapiObj.definition && xapiObj.definition.type ? xapiObj.definition.type : undefined;
        const obj = new InteractionObjectStatement(id, type, baseURI);
        if (xapiObj.definition) {
            if (xapiObj.definition.interactionType) obj.interactionType = xapiObj.definition.interactionType;
            if (xapiObj.definition.correctResponsesPattern) obj.correctResponsesPattern = xapiObj.definition.correctResponsesPattern;
            ["choices", "scale", "source", "target", "steps"].forEach(key => {
                if (xapiObj.definition[key]) obj[key] = xapiObj.definition[key];
            });
        }
        return obj;
    }
}