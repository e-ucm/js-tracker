class VerbStatement {
    constructor(verbId) {
        this.verbId = this.verbIds[verbId];
        this.verbDisplay = verbId;
    }
    verbIds = {
        initialized: 'http://adlnet.gov/expapi/verbs/initialized',
        progressed: 'http://adlnet.gov/expapi/verbs/progressed',
        completed: 'http://adlnet.gov/expapi/verbs/completed',
        accessed: 'https://w3id.org/xapi/seriousgames/verbs/accessed',
        skipped: 'http://id.tincanapi.com/verb/skipped',
        selected: 'https://w3id.org/xapi/adb/verbs/selected',
        unlocked: 'https://w3id.org/xapi/seriousgames/verbs/unlocked',
        interacted: 'http://adlnet.gov/expapi/verbs/interacted',
        used: 'https://w3id.org/xapi/seriousgames/verbs/used'
    };
    verbId;
    verbDisplay;

    toXAPI() {
        return {
            id: this.verbId,
            display: { "en": this.verbDisplay }
        }
    }
}

module.exports = VerbStatement;