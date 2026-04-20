import { v4 as uuidv4 } from 'uuid';
import { isUri, setAsUri } from './helper.js';
import ObjectStatement from './ObjectStatement.js';
/**
 * The Context Class of a Statement
 */
export default class ContextStatement {
    /**
     * Constructor of the ContextStatement class
     * 
     * @param {string} base default URI for the context construction
     * @param {string} platform platform of context
     * @param {string} categoryId category Id of context
     * @param {string} registrationId registration id of context
     */
    constructor(base, platform, registrationId=null, categoryId=null) {
        this.defaultURI = base;
        this.platform = platform;
        if(registrationId != null) {
            this.registration=registrationId;
        } else {
            this.registration=uuidv4();
        }
        // Initialize contextActivities with category by default
        this.contextActivities = {};
        if(categoryId && categoryId in this.categoryIDs) {
            this.contextActivities.category = [
                {
                    id: isUri(categoryId) ? categoryId : categoryId in this.categoryIDs ? this.categoryIDs[categoryId] : setAsUri(categoryId, this.defaultURI),
                    definition: {
                        type : "http://adlnet.gov/expapi/activities/profile"
                    }
                }
            ]
        }
    }

    /** 
     * default URI for the context construction
     * @type {string}
      */
    defaultURI;

    /** 
     * Registration Id of the Context
     * 
     * @type {string}
     */
    registration;

    
    /** 
     * Platform of the Context
     * 
     * @type {string}
     */
    platform;

    /** 
     * Extensions of the Context
     * 
     * @type {Object}
     */
    extensions;

    /**
     * Context Activities (parent, grouping, category, other)
     * @type {Object}
     */
    contextActivities;

    

    /**
     * The category IDs list
     */
    categoryIDs = {
        seriousgame : 'https://w3id.org/xapi/seriousgame',
        scorm: 'https://w3id.org/xapi/scorm/v/2'
    };

    /**
     * Add or set a context activity
     * @param {"parent"|"grouping"|"category"|"other"} type
     * @param {ObjectStatement|ObjectStatement[]|string} activity activity object(s) or activity id
     * @param {string} [activityType] activity type when activity is an id
     */
    addContextActivity(type, activity, activityType) {
        if (typeof activity === 'string') {
              activity = new ObjectStatement(activity, activityType, this.defaultURI);
        }
        if (["parent", "grouping", "category", "other"].includes(type)) {
            // Accept single object or array
            if (!this.contextActivities[type]) {
                this.contextActivities[type] = [];
            }
            if (Array.isArray(activity)) {
                this.contextActivities[type].push(...activity);
            } else {
                this.contextActivities[type].push(activity);
            }
        }
    }
    
    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        // Deep copy and serialize contextActivities
        const serializedContextActivities = {};
        for (const [type, activities] of Object.entries(this.contextActivities)) {
            serializedContextActivities[type] = activities.map(act => {
                // If it has a toXAPI method, use it
                if (act && typeof act.toXAPI === 'function') {
                    const obj = act.toXAPI();
                    // Flatten definition fields to top-level for contextActivities (xAPI spec)
                    return {
                        id: obj.id,
                        ...(obj.definition && obj.definition.type ? { definition: { type: obj.definition.type } } : {})
                    };
                }
                // Otherwise, assume it's already a plain object
                return act;
            });
        }
        return {
            platform: this.platform,
            registration: this.registration,
            contextActivities: serializedContextActivities,
            ...(this.extensions ? { extensions: this.extensions } : {})
        };
    }

    setExtensions(ext) {
        this.extensions = ext;
    }

    setExtension(key, value) {
        if(!this.extensions) {
            this.extensions = {};
        }
        this.extensions[key] = value;
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }
}