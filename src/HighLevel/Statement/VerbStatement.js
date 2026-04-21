import { isUri, setAsUri } from "./helper.js";

/**
 * The Verb Class  of a Statement
 */
export default class VerbStatement {
    /**
     * Constructor of VerbStatement class
     * 
     * @param {string} id The verb id of the statement
     * @param {string} baseURI The base URI for the statement
     */
    constructor(id, baseURI) {
        if(isUri(id)) {
            this.id = id;
        } else {
            if(id in this.ids) {
                this.id = this.ids[id];
                this.display.set('en', id);
            } else {
                this.id = setAsUri(id, baseURI);
            }
        }
    }
    
    /**
     * The Verb Ids array
     */
    ids = {
        //Completable Verbs
        initialized: 'http://adlnet.gov/expapi/verbs/initialized',
        progressed: 'http://adlnet.gov/expapi/verbs/progressed',
        completed: 'http://adlnet.gov/expapi/verbs/completed',
        //Accessible Verbs
        accessed: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
        skipped: 'http://id.tincanapi.com/verb/skipped',
        //Alternative Verbs
        selected: 'https://w3id.org/xapi/adb/verbs/selected',
        unlocked: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
        //GameObject Verbs
        interacted: 'http://adlnet.gov/expapi/verbs/interacted',
        used: 'https://w3id.org/xapi/seriousgames/verbs/used',

        //SCORM Verbs
        responded: 'http://adlnet.gov/expapi/verbs/responded',
        resumed: 'http://adlnet.gov/expapi/verbs/resumed',
        suspended: 'http://adlnet.gov/expapi/verbs/suspended',
        terminated: 'http://adlnet.gov/expapi/verbs/resumed',
        passed: 'http://adlnet.gov/expapi/verbs/passed',
        failed: 'http://adlnet.gov/expapi/verbs/failed',
        scored: 'http://adlnet.gov/expapi/verbs/scored',
    };
    /**
     * The Verb Id 
     * @type {string}
     */
    id;

    /**
     * The Verb display 
     * @type {Map<string, string>}
     */
    display = new Map();

    /**
     * Add or set a verb display
     * @param {string} lang
     * @param {string} display
     */
    addDisplay(lang, display) {
        this.display.set(lang, display);
    }

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        var verb = {};
        if(this.id) {
            verb.id = this.id;
        }
        
        if(this.display) {
            verb.display = this.display;
        }
        return verb;
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.id;
    }

    /**
     * Create a VerbStatement from xAPI verb object
     * @param {Object} xapiObj
     * @param {string} baseURI - Optional base URI to resolve relative IDs
     * @returns {VerbStatement}
     */
    static fromXAPI(xapiObj, baseURI) {
        if (!xapiObj) return null;
        const id = xapiObj.id;
        const display = xapiObj.display;
        const verb = new VerbStatement(id, baseURI);
        if (display) {
            for (const [lang, text] of Object.entries(display)) {
                verb.addDisplay(lang, text);
            }
        }
        return verb;
    }
}