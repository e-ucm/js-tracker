/**
 * The Verb Class  of a Statement
 */
export default class VerbStatement {
    /**
     * Constructor of VerbStatement class
     * 
     * @param {string} verbDisplay The verb display id of the statement
     */
    constructor(verbDisplay) {
        this.verbId = this.verbIds[verbDisplay];
        this.verbDisplay = verbDisplay;
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
     * @type {string}
     */
    verbDisplay;

    /**
     * convert to XAPI
     * 
     * @returns Object
     */
    toXAPI() {
        var verb = {};
        if(this.verbId) {
            verb.id = this.verbId;
        }
        
        if(this.verbDisplay) {
            verb.display = { "en": this.verbDisplay };
        }
        return verb;
    }

    /**
     * convert to CSV
     * 
     * @returns String
     */
    toCSV() {
        return this.verbId;
    }
}