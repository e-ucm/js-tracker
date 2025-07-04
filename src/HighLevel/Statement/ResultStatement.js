/**
 * The Result Class of a Statement
 */
export default class ResultStatement {
    /**
     * Constructor of the ResultStatement class
     * 
     * @param {string} defautURI The default URI for the extensions
     */
    constructor(defautURI) {
        this.defautURI = defautURI;
        this.Score = null;
        this.Success = null;
        this.Completion = null;
        this.Response = null;
        this.Duration = null;
        this.Extensions = {};
    }

    /**
     * The ID of the Result
     * 
     * @type {string}
     */
    defautURI;

    /**
     * The Score of the Result
     * 
     * @type {Object}
     */
    Score;
    /**
     * The success status of the Result
     * 
     * @type {boolean}
     */
    Success;
    /**
     * The Completion status of the Result
     * 
     * @type {boolean}
     */
    Completion;
    /**
     * The response of the Result
     * 
     * @type {string}
     */
    Response;
    /**
     * The duration of the Result
     * 
     * @type {string}
     */
    Duration;
    /**
     * The Extensions of the Result
     * 
     * @type {Object}
     */
    Extensions;

    /**
     * Check if the result is empty or not
     * @returns boolean
     */
    isEmpty() {
        return (this.Score == null) && (this.Duration == null) && (this.Success == null) && (this.Completion == null) && (this.Response == null) && (Object.keys(this.Extensions).length == 0);
    }

    /**
     * The possible extensions of a result statement
     */
    ExtensionIDs = {
        health: 'https://w3id.org/xapi/seriousgames/extensions/health',
        position: 'https://w3id.org/xapi/seriousgames/extensions/position',
        progress: 'https://w3id.org/xapi/seriousgames/extensions/progress',
        interactionID: 'https://w3id.org/xapi/netc-assessment/extensions/activity/id-number',
        response_explanation: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-explanation',
        response_type: 'https://w3id.org/xapi/netc-assessment/extensions/result/response-type',
    };

    /**
     * The Score Keys for the result
     */
    ScoreKey = ["raw", "min", "max", "scaled"];

    /**
     * Set extensions from list
     * @param {Object} extensions extension list
     */
    setExtensions(extensions) {
        this.Extensions = {};
        for (var key in extensions) {
            this.setExtension(key,extensions[key]);
        }
    }

    /**
     * Set result extension for key value
     * @param {string} key the key of the extension
     * @param {string} value the value of the extension
     */
    setExtension(key, value) {
        switch (key.toLowerCase()) {
            case 'success': { this.Success = value; break; }
            case 'completion': { this.Completion = value; break; }
            case 'response': { this.Response = value; break; }
            case 'score': { this.Score = this.setScoreValue("raw", value); break; }
            case 'duration': { this.Duration = value; break; }
            default: { this.Extensions[key] = value; break; }
        }
    }

    /**
     * Set as URI if it is not an URI already

     * @param {string} id the id of the part of the statement
     * @returns string
     */
    setAsUri(id) {
        if(this.isUri(id)) {
            return id;
        } else {
            return `${this.defautURI}://${id}`;
        }
    }
    
    /**
     * Check if the string is an URI
     * @param {string} id 
     * @returns boolean
     */
    isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    /**
     * Set the score of the statement
     * @param {string} key the key for the score 
     * @param {number} value the score 
     */
    setScoreValue(key, value) {
        if(! this.Score) {
            this.Score = {};
        }
        if(this.ScoreKey.includes(key)) {
            this.Score[key] = Number(value);
        }    
    }

    /**
     * convert to XAPI
     * 
     * @returns Object
     */
    toXAPI() {
        var ret = {};

        if (this.Success !== null) {
            ret.success = (this.Success) ? true : false;
        }

        if (this.Completion !== null) {
            ret.completion = (this.Completion) ? true : false;
        }

        if (this.Response) {
            ret.response = this.Response.toString();
        }

        if (this.Score !== null) {
            ret.score = this.Score;
        }

        if (this.Duration !== null) {
            ret.duration = this.Duration;
        }


        if (this.Extensions !== null && obsize(this.Extensions) > 0) {
            ret.extensions = this.Extensions;

            for (var key in this.Extensions) {
                if (this.ExtensionIDs.hasOwnProperty(key)) {
                    this.Extensions[this.ExtensionIDs[key]] = this.Extensions[key];
                    delete this.Extensions[key];
                } else {
                    var newuri= this.setAsUri(key);
                    this.Extensions[newuri] = this.Extensions[key];
                    if(newuri !== key) {
                        delete this.Extensions[key];
                    }
                }
            }
        }

        return ret;
    }
    
    /**
     * convert to CSV
     * 
     * @returns String
     */
    toCSV() {
        var success = (this.Success !== null) ? ',success,' + this.Success.toString() : '';
        var completion = (this.Completion !== null) ? ',completion,' + this.Completion.toString() : '';
        var response = (this.Response) ? ',response,' + this.Response.replaceAll(',', '\\,') : '';
        var score = '';

        if (exists(this.Score)) {
            if (exists(this.Score.raw)) {
                score += ',score,' + this.Score.raw;
            }

            if (exists(this.Score.min)) {
                score += ',score_min,' + this.Score.min;
            }

            if (exists(this.Score.max)) {
                score += ',score_max,' + this.Score.max;
            }

            if (exists(this.Score.scaled)) {
                score += ',score_scaled,' + this.Score.scaled;
            }
        }

        var result = success + completion + response + score;

        if (this.Extensions !== null && obsize(this.Extensions) > 0) {
            for (var key in this.Extensions) {
                result += ',' + key.replaceAll(',', '\\,') + ',';
                if (this.Extensions[key] !== null) {
                    if (typeof this.Extensions[key] === 'number') {
                        result += this.Extensions[key];
                    } else if (typeof this.Extensions[key] === 'string') {
                        result += this.Extensions[key].replaceAll(',', '\\,');
                    } else if (typeof this.Extensions[key] === 'object') {
                        if (ismap(this.Extensions[key])) {
                            var smap = '';

                            for (var k in this.Extensions[key]) {
                                if (typeof this.Extensions[key][k] === 'number') {
                                    smap += k + '=' + this.Extensions[key][k] + '-';
                                } else {
                                    smap += k + '=' + this.Extensions[key][k].replaceAll(',', '\\,') + '-';
                                }
                            }

                            result += smap.slice(0,-1);
                        }
                    } else {
                        result += this.Extensions[key];
                    }
                }
            }
        }

        return result;
    }
}

/**
 * Get the size of the object
 * @param {Object} obj the object to get the size
 * @returns number
 */
var obsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

/**
 * Check if is map
 * @param {Object} obj the object to check
 * @returns boolean
 */
var ismap = function(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            return false;
        }
    }
    return true;
};

/**
 * Check if exist
 * @param {Object} value the object to check
 * @returns boolean
 */
var exists = function(value) {
    return !(typeof value === 'undefined' || value === null);
};