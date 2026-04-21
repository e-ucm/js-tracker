/**
 * The Context Class of a Statement
 */
export default class ContextStatement {
    /**
     * Create a ContextStatement from xAPI context object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {ContextStatement}
     */
    static fromXAPI(xapiObj: any, baseURI: string): ContextStatement;
    /**
     * Constructor of the ContextStatement class
     *
     * @param {string} base default URI for the context construction
     * @param {string} platform platform of context
     * @param {string} categoryId category Id of context
     * @param {string} registrationId registration id of context
     */
    constructor(base: string, platform: string, registrationId?: string, categoryId?: string);
    /**
     * default URI for the context construction
     * @type {string}
      */
    defaultURI: string;
    /**
     * Platform of the Context
     *
     * @type {string}
     */
    platform: string;
    /**
     * Registration Id of the Context
     *
     * @type {string}
     */
    registration: string;
    /**
     * Context Activities (parent, grouping, category, other)
     * @type {Object}
     */
    contextActivities: any;
    /**
     * Extensions of the Context
     *
     * @type {Object}
     */
    extensions: any;
    /**
     * The category IDs list
     */
    categoryIDs: {
        seriousgame: string;
        scorm: string;
    };
    /**
     * Add or set a context activity
     * @param {"parent"|"grouping"|"category"|"other"} type
     * @param {ObjectStatement|ObjectStatement[]|string} activity activity object(s) or activity id
     * @param {string} [activityType] activity type when activity is an id
     */
    addContextActivity(type: "parent" | "grouping" | "category" | "other", activity: ObjectStatement | ObjectStatement[] | string, activityType?: string): void;
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    setExtensions(ext: any): void;
    setExtension(key: any, value: any): void;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
import ObjectStatement from './ObjectStatement.js';
