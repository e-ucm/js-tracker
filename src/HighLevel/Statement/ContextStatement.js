import { v4 as uuidv4 } from 'uuid';

export default class ContextStatement {
    constructor(categoryId="seriousgame", registrationId=null) {
        if(registrationId != null) {
            this.registration=uuidv4();
        } else {
            this.registration=uuidv4();
        }
        this.categoryId=this.categoryIDs[categoryId];
        this.category=categoryId;
    }
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
        }
    }

    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }
}