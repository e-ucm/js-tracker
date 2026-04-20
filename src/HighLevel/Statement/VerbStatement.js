import { isUri, setAsUri } from "./helper.js";

/**
 * The Verb Class  of a Statement
 */
export default class VerbStatement {
    /**
     * Constructor of VerbStatement class
     * 
     * @param {string} verbId The verb id of the statement
     * @param {string} baseURI The base URI for the statement
     */
    constructor(verbId, baseURI) {
        if(isUri(verbId)) {
            this.verbId = verbId;
        } else {
            if(verbId in this.verbIds) {
                this.verbId = this.verbIds[verbId];
                this.verbDisplay.set('en', verbId);
            } else {
                this.verbId = setAsUri(verbId, baseURI);
            }
        }
    }
    
    /**
     * The Verb Ids array
     */
    verbIds = {
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
    verbId;

    /**
     * The Verb display 
     * @type {Map<string, string>}
     */
    verbDisplay = new Map();

    /**
     * Add or set a verb display
     * @param {string} lang
     * @param {string} display
     */
    addDisplay(lang, display) {
        this.verbDisplay.set(lang, display);
    }

    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
    toXAPI() {
        var verb = {};
        if(this.verbId) {
            verb.id = this.verbId;
        }
        
        if(this.verbDisplay) {
            verb.display = this.verbDisplay;
        }
        return verb;
    }

    /**
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.verbId;
    }
}