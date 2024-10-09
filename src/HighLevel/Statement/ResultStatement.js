export default class ResultStatements {
    constructor(defautURI) {
        this.defautURI = defautURI;
        this.parent = null;
        this.Score = null;
        this.Success = null;
        this.Completion = null;
        this.Response = null;
        this.Duration = null;
        this.Extensions = {};
    }

    isEmpty() {
        return (this.parent == null) && (this.Score == null) && (this.Duration == null) && (this.Success == null) && (this.Completion == null) && (this.Response == null) && (Object.keys(this.Extensions).length == 0);
    }

    ExtensionIDs = {
        health: 'https://w3id.org/xapi/seriousgames/extensions/health',
        position: 'https://w3id.org/xapi/seriousgames/extensions/position',
        progress: 'https://w3id.org/xapi/seriousgames/extensions/progress'
    };

    setExtensions(extensions) {
        this.Extensions = {};
        for (var key in extensions) {
            setExtension(key,extensions[key]);
        }
    }

    setExtension(key, value) {
        switch (key.toLowerCase()) {
            case 'success': { this.Success = value; break; }
            case 'completion': { this.Completion = value; break; }
            case 'response': { this.Response = value; break; }
            case 'score': { this.Score = value; break; }
            case 'duration': { this.Duration = value; break; }
            default: { this.Extensions[key] = value; break; }
        }
    };

    setAsUri(id) {
        if(this.isUri(id)) {
            return id;
        } else {
            return `${this.defautURI}://${id}`;
        }
    }
    
    isUri(id) {
        const pattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^\s/$.?#].[^\s]*$/i;
        return pattern.test(id);
    }

    setScoreValue(key, value) {
        if (! this.Extensions.score == null) {
            this.Extensions.score = {};
        }
        this.Extensions.score[key] = Number(value);
    };

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
                    this.Extensions[this.setAsUri(key)] = this.Extensions[key];
                    delete this.Extensions[key];
                }
            }
        }

        return ret;
    };
};
var obsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};