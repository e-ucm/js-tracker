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
     * @param {typeof ALL.CATEGORYID[keyof typeof ALL.CATEGORYID]} categoryId
     * @param {string} registrationId registration id of context
     */
    constructor(base: string, platform: string, registrationId?: string, categoryId?: (typeof ALL.CATEGORYID)[keyof typeof ALL.CATEGORYID]);
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
     * Add a category to the context
     * @param {typeof ALL.CATEGORYID[keyof typeof ALL.CATEGORYID]} categoryId
     */
    addCategory(categoryId: (typeof ALL.CATEGORYID)[keyof typeof ALL.CATEGORYID]): void;
    /**
     * Extensions of the Context
     *
     * @type {Object}
     */
    extensions: any;
    /**
     * Add or set a context activity
     * @param {typeof STATEMENT.CONTEXT.ACTIVITIES[keyof typeof STATEMENT.CONTEXT.ACTIVITIES]} type
     * @param {ObjectStatement|ObjectStatement[]|string} activity activity object(s) or activity id
     * @param {string} [activityType] activity type when activity is an id
     */
    addContextActivity(type: (typeof STATEMENT.CONTEXT.ACTIVITIES)[keyof typeof STATEMENT.CONTEXT.ACTIVITIES], activity: ObjectStatement | ObjectStatement[] | string, activityType?: string): void;
    /**
     * convert to XAPI
     *
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * Set the extensions of the Context
     * @param {Object} ext extensions object
     */
    setExtensions(ext: any): void;
    /**
     * Add or set a single extension key-value pair
     * @param {typeof ALL.CONTEXTEXTENSION[keyof typeof ALL.CONTEXTEXTENSION]|string} key extension key
     * @param {any} value extension value
     */
    setExtension(key: (typeof ALL.CONTEXTEXTENSION)[keyof typeof ALL.CONTEXTEXTENSION] | string, value: any): void;
    /**
     * convert to CSV
     *
     * @returns {String}
     */
    toCSV(): string;
}
import { ALL } from './Ids/Profiles/Generated/index.js';
import { STATEMENT } from './Ids/Statements.js';
import ObjectStatement from './ObjectStatement.js';
