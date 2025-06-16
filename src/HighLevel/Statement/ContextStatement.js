const uuidv4 = require('uuid').v4;

class ContextStatement {
    /**
     * @param {string} categoryId
     * @param {string} registrationId
     */
    constructor(categoryId="seriousgame", registrationId=null) {
        if(registrationId != null) {
            this.registration=uuidv4();
        } else {
            this.registration=uuidv4();
        }
        this.categoryId=this.categoryIDs[categoryId];
        this.category=categoryId;
    }
    /**
     * @type {string}
     */
    registration;

    categoryIDs = {
        seriousgame : 'https://w3id.org/xapi/seriousgame',
        scorm: 'https://w3id.org/xapi/scorm'
    };
    
    toXAPI() {
        return {
            registration: this.registration,
            contextActivities: { 
                category:[{
                    id: this.categoryId,
                    definition: {
                        type : "http://adlnet.gov/expapi/activities/profile"
                    }
                }]
            }
        };
    }

    /**
     * @returns {string}
     */
    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }
}

module.exports = ContextStatement;