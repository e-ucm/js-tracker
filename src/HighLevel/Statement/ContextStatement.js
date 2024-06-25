import { v4 as uuidv4 } from 'uuid';

export default class ContextStatement {
    constructor() {
        this.registration=uuidv4();
    }
    registration;

    categoryIDs = {
        seriousgame : 'https://w3id.org/xapi/seriousgame'
    };
    
    toXAPI() {
        return {
            registration: this.registration,
            contextActivities: { 
                category:[{
                    id: this.categoryIDs.seriousgame
                }]
            }
        }
    }

    toCSV() {
        return this.registration.replaceAll(',', '\\,') ;
    }
}