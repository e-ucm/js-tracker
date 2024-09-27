// ##############################################
// ################ NESTED TYPES ################
// ##############################################

// Trace Target

TrackerEvent.TraceObject = function(type, id) {
    this.parent = null;

    this.Type = type;
    this.ID = id;

    this.ToCsv = function() {
        return this.Type.replaceAll(',','\\,') + ',' + this.ID.replaceAll(',', '\\,');
    };

    this.ToXapi = function() {
        var typeKey = this.Type;

        if (TrackerEvent.TraceObject.ObjectIDs.hasOwnProperty(this.Type)) {
            typeKey = TrackerEvent.TraceObject.ObjectIDs[this.Type];
        }

        id = ((this.parent.tracker.objectId !== null) ? this.parent.tracker.objectId + '/' + this.Type.toLowerCase() + '/' : '') + this.ID;
        var definition = {type: typeKey};

        return {
            id: id,
            definition: definition
        };
    };
};


// Trace Target

TrackerEvent.TraceResult = function() {
    this.parent = null;

    this.Score = null;
    this.Success = null;
    this.Completion = null;
    this.Response = null;
    this.Extensions = null;

    this.setExtensions = function(extensions) {
        this.Extensions = {};

        for (var key in extensions) {
            switch (key.toLowerCase()) {
            case 'success': { this.Success = extensions[key]; break; }
            case 'completion': { this.Completion = extensions[key]; break; }
            case 'response': { this.Response = extensions[key]; break; }
            case 'score': { this.Score = extensions[key]; break; }
            default: { this.Extensions[key] = extensions[key]; break; }
            }
        }
    };

    this.ToCsv = function() {
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
    };

    this.ToXapi = function() {
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
                if (TrackerEvent.TraceResult.ExtensionIDs.hasOwnProperty(key)) {
                    this.Extensions[TrackerEvent.TraceResult.ExtensionIDs[key]] = this.Extensions[key];
                    delete this.Extensions[key];
                }
            }
        }

        return ret;
    };
};

TrackerEvent.TraceResult.ExtensionIDs = {
    health: 'https://w3id.org/xapi/seriousgames/extensions/health',
    position: 'https://w3id.org/xapi/seriousgames/extensions/position',
    progress: 'https://w3id.org/xapi/seriousgames/extensions/progress'
};

// #################################################
// ################ XAPI INTERFACES ################
// #################################################

var GameObject = function(tracker) {

    this.tracker = tracker;

    this.GameObjectType = {
        Enemy: 0,
        Npc: 1,
        Item: 2,
        GameObject: 3,
        properties: ['enemy', 'npc', 'item', 'gameobject']
    };

    this.Interacted = function(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        return this.tracker.Trace('interacted',this.GameObjectType.properties[type],gameobjectId);
    };

    this.Used = function(gameobjectId, type) {
        if (typeof type === 'undefined') {type = 3;}

        return this.tracker.Trace('used',this.GameObjectType.properties[type],gameobjectId);
    };
};