export default class ResultStatements {
    constructor() {
        this.parent = null;
        this.Score = null;
        this.Success = null;
        this.Completion = null;
        this.Response = null;
        this.Extensions = {};
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
            default: { this.Extensions[key] = value; break; }
        }
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

        if (this.Extensions !== null && obsize(this.Extensions) > 0) {
            ret.extensions = this.Extensions;

            for (var key in this.Extensions) {
                if (this.ExtensionIDs.hasOwnProperty(key)) {
                    this.Extensions[this.ExtensionIDs[key]] = this.Extensions[key];
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