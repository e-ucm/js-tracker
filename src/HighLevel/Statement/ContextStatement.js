import { v4 as uuidv4 } from 'uuid';
/**
 * The Context Class of a Statement
 */
export default class ContextStatement {
    /**
     * Constructor of the ContextStatement class
     * 
     * @param {*} categoryId category Id of context
     * @param {*} registrationId registration id of context
     */
    constructor(categoryId="seriousgame", registrationId=null) {
        if(registrationId != null) {
            this.registration=registrationId;
        } else {
            this.registration=uuidv4();
        }
        this.categoryId=this.categoryIDs[categoryId];
        this.category=categoryId;
    }
    /** 
     * Registration Id of the Context
     * 
     * @type {string}
     */
    registration;

    /**
     * The category IDs list
     */
    categoryIDs = {
        seriousgame : 'https://w3id.org/xapi/seriousgame',
        scorm: 'https://w3id.org/xapi/scorm/v/2'
    };
    
    /**
     * convert to XAPI
     * 
     * @returns {Object}
     */
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
     * convert to CSV
     * 
     * @returns {String}
     */
    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }
}