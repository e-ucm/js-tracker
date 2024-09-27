var uuidv4 = require('uuid').v4;

class ContextStatement {
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
}

module.exports = ContextStatement;