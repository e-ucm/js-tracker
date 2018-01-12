/*
 * Copyright 2017 e-UCM, Universidad Complutense de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var $ = require('jquery');
var moment = require('moment');

function TrackerAsset() {

    this.settings = {
        host: 'https://rage.e-ucm.es/',
        port: 443,
        secure: true,
        trackingCode: '',
        userToken: '',
        max_flush: 4,
        batch_size: 10,
        backupStorage: true,
        debug: true,
        force_actor: true
    };

    this.collector = 'proxy/gleaner/collector/';
    this.backup_file = '';

    this.url = '';
    this.logged_token = '';
    this.auth = '';
    this.playerId = '';
    this.objectId = '';

    this.started = false;
    this.connected = false;
    this.active = false;

    this.session = 0;
    this.actor = '{}';
    this.extensions = {};

    this.queue = [];
    this.tracesPending = [];
    this.tracesUnlogged = [];

    this.Accessible = new Accessible(this);
    this.Alternative = new Alternative(this);
    this.Completable = new Completable(this);
    this.GameObject = new GameObject(this);

    this.generateURL = function() {
        var splitted = this.settings.host.split ('/');
        var host_splitted = '';
        var secure = false;

        if (splitted.length > 1 && splitted[0].startsWith('http')) {
            host_splitted = splitted [2].split (':');
            secure = splitted[0] === 'https:';
        } else {
            host_splitted = splitted [0].split (':');
            secure = this.settings.secure;
        }

        var domain = host_splitted [0];

        this.port = 80;
        if (host_splitted[1] && host_splitted[1].length > 1) {
            this.port = parseInt(host_splitted[1]);
        } else {
            this.port = secure ? 443 : 80;
        }

        this.url = (secure ? 'https://' : 'http://') + domain + ':' + this.port + '/api/';

        if (this.settings.debug) {
            console.log('Final Tracker URL is: ' + this.url);
        }
    };

    this.Login = function(username, password, callback) {
        this.generateURL();

        var tracker = this;
        this.HttpRequest(this.url + 'login', 'post', {'Content-Type': 'application/json' }, JSON.stringify({username: username, password: password}),
         function (data) {
            tracker.settings.userToken = 'Bearer ' + data.user.token;
            if (tracker.settings.debug) {
                console.info('AuthToken: ' + data.user.token);
            }
            callback(data, null);

        },
         function (data) {
            if (tracker.settings.debug && data.responseJSON) {
                console.log(data.responseJSON);
            }
            callback(data, true);
        });
    };

    this.Start = function(callback) {
        this.started = true;

        if (this.settings.backupStorage) {
            this.backup_file = 'backup_' + Math.random().toString(36).slice(2);
            if (this.settings.debug) {
                console.log('Backup file is: ' + this.backup_file);
            }
        }

        this.Connect(callback);
    };

    this.Stop = function() {
        this.active = false;
        this.connected = false;
        this.started = false;
        this.actor = null;
        this.queue = [];
        this.userToken = null;
        this.playerId = null;
        this.tracesPending = [];
        this.tracesUnlogged = [];
        this.extensions = {};
    };

    this.Connect = function(callback) {
        this.generateURL();

        var tracker = this;

        var headers = {
            'Content-Type': 'application/json'
        };

        var body = '';

        if (this.settings.userToken) {
            if (this.settings.userToken.indexOf('Bearer') !== -1) {
                headers.Authorization = this.settings.userToken;
            } else {
                body = JSON.stringify({anonymous: this.settings.userToken});
            }
        }else if (this.playerId) {
            body = JSON.stringify({anonymous: this.playerId});
        }

        this.HttpRequest(this.url + this.collector + 'start/' + this.settings.trackingCode, 'post', headers, body,
         function (data) {
            if (tracker.settings.debug) {
                console.info(data);
            }

            tracker.auth = data.authToken;
            tracker.actor = data.actor;
            tracker.playerId = data.playerId;
            tracker.objectId = null;
            tracker.session = data.session;

            if (headers.Authorization) {
                tracker.userToken = headers.Authorization;
            }else {
                tracker.userToken = data.playerId;
            }

            tracker.connected = true;
            if (!(tracker.actor === null || tracker.actor === '{}')) {
                tracker.active = true;
            }

            if (tracker.settings.debug) {
                console.log('Tracker Started: ' + tracker.userToken);
            }

            callback(data, null);
        },
         function (data) {
            if (tracker.settings.debug) {
                if (data.responseJSON) {
                    console.log(data.responseJSON);
                }else {
                    console.log('Can\'t connect.');
                }
            }

            callback(data, true);
        });
    };

    this.ActionTrace = function(verb,type,id) {
        var t = new TrackerEvent(this);
        t.setActor(this.actor);
        t.setEvent(new TrackerEvent.TraceVerb(verb));
        t.setTarget(new TrackerEvent.TraceObject(type, id));
        t.setResult(new TrackerEvent.TraceResult());
        t.Result.setExtensions(this.extensions);
        this.extensions = {};

        this.queue.push(t);
        return t;
    };

    this.Trace = function(verb,type,id) {
        return this.ActionTrace(verb,type,id);
    };

    this.flushing = false;
    this.redo_flush = false;
    this.Flush = function(callback) {
        if (!this.flushing) {
            this.flushing = true;
            this.DoFlush(callback);
        }else {
            this.redo_flush = true;
        }
    };

    this.DoFlush = function(callback) {
        var tracker = this;

        tracker.CheckStatus(function(res, err) {
            if (err && res === 'Not active') {
                tracker.flushing = false;
                callback(res, err);
                return;
            }

            tracker.ProcessQueue(function(result, error) {
                if (error) {
                    tracker.flushing = false;
                    callback(result, error);
                }else if (tracker.redo_flush) {
                    tracker.redo_flush = false;
                    tracker.DoFlush(callback);
                }else {
                    tracker.flushing = false;
                    callback(result, error);
                }
            });
        });
    };

    this.CheckStatus = function(callback) {
        if (!this.started) {
            if (this.settings.debug) {
                console.log('Refusing to send traces without starting tracker (Active is False, should be True)');
            }

            callback('Not active', true);
        } else if (!this.active) {
            if (this.settings.debug) {
                console.log('Tracker is not active, trying to reconnect.');
            }
            this.Connect(callback);
        }else {
            callback('Everything OK', false);
        }
    };

    this.ProcessQueue = function(callback) {
        var tracker = this;

        if (tracker.queue.length > 0 || tracker.tracesPending.length > 0 || tracker.tracesUnlogged.length > 0) {
            // Extract the traces from the queue and remove from the queue
            var traces = tracker.CollectTraces();

            tracker.SendAllTraces(traces, function(result, error) {
                if (tracker.settings.backupStorage && traces.length > 0) {
                    var current = tracker.LocalStorage.getItem(tracker.backup_file);
                    var rawData = tracker.ProcessTraces(traces, 'csv');

                    if (current) {
                        rawData = current + rawData;
                    }

                    tracker.LocalStorage.setItem(tracker.backup_file, rawData);
                }
                tracker.queue.dequeue(traces.length);

                callback(result, error);
            });
        } else {
            if (tracker.settings.debug) {
                console.log('Nothing to flush');
            }

            callback('Nothing to flush', false);
        }
    };

    this.SendAllTraces = function(traces, callback) {
        var tracker = this;

        if (tracker.active) {
            tracker.SendUnloggedTraces(function(unl_result, unl_error) {
                if (!unl_error) {
                    tracker.SendPendingTraces(function(pen_result, pen_error) {
                        var data = tracker.ProcessTraces(traces, 'xapi');

                        if (pen_error) {
                            if (tracker.queue.length > 0) {
                                tracker.tracesPending.push(data);
                            }

                            callback('Can\'t send pending traces', true);
                        }else if (tracker.queue.length > 0) {
                            tracker.SendTraces(data, function(result, error) {
                                if (error && tracker.queue.length > 0) {
                                    tracker.tracesPending.push(data);
                                    callback('Can\'t send Traces', true);
                                }else {
                                    callback('Everything OK', false);
                                }
                            });
                        }else {
                            callback('Everything OK', false);
                        }
                    });
                }else {
                    callback('Can\'t send Unlogged Traces', true);
                }
            });
        } else {
            tracker.tracesUnlogged = tracker.tracesUnlogged.concat(traces);
            callback('Tracker is not active', true);
        }
    };

    this.CollectTraces = function() {
        var cnt = this.settings.batch_size === 0 ? Number.MAX_SAFE_INTEGER : this.settings.batch_size;
        cnt = Math.min(this.queue.length, cnt);

        var traces = this.queue.peek(cnt);

        return traces;
    };

    this.ProcessTraces = function(traces, format) {
        var data = '';
        var item;
        var sb = [];

        for (var i = 0; i < traces.length; i++) {
            item = traces[i];

            switch (format) {
            case 'xapi': {
                sb.push(item.ToXapi());
                break;
            }
            default: {
                sb.push(item.ToCsv());
                break;
            }
        }
        }

        switch (format) {
        case 'csv': {
            data = sb.join('\r\n') + '\r\n';
            break;
        }
        case 'xapi': {
            data = '[\r\n' + sb.join(',\r\n') + '\r\n]';
            break;
        }
        default: {
            data = sb.join('\r\n');
            break;
        }
    }

        sb.length = 0;

        return data;
    };

    this.SendPendingTraces = function(callback) {
        var tracker = this;

        // Try to send old traces
        if (tracker.tracesPending.length > 0) {
            if (tracker.settings.debug) {
                console.log('Enqueued trace-blocks detected: ' + tracker.tracesPending.lenth + '. Processing...');
            }

            var data = tracker.tracesPending[0];

            tracker.SendTraces(data, function(result, error) {
                if (error) {
                    if (tracker.settings.debug) {
                        console.log('Error sending enqueued traces');
                    }
                    // Does not keep sending old traces, but continues processing new traces so that get added to tracesPending
                    callback('Error sending enqueued pending traces: \n' + result, true);
                }else {
                    tracker.tracesPending.shift();
                    if (tracker.settings.debug) {
                        console.log('Sent enqueued traces OK');
                    }

                    if (tracker.tracesPending.length > 0) {
                        tracker.SendPendingTraces(callback);
                    } else {
                        callback(result, null);
                    }
                }
            });
        }else {
            callback('Everything OK', null);
        }
    };

    this.SendUnloggedTraces = function(callback) {
        var tracker = this;

        if (tracker.tracesUnlogged.length === 0) {
            callback('Everything OK', null);
        } else if (tracker.actor === null || tracker.actor === '{}') {
            callback('Can\'t flush without actor', true);
        } else {
            var data = tracker.ProcessTraces(tracker.tracesUnlogged, 'xapi');
            tracker.SendTraces(data, function(result, error) {
                if (error) {
                    tracker.tracesPending.Add(data);
                    callback('Error sending unlogged traces', true);
                }else {
                    tracker.tracesUnlogged = [];
                    callback('Everything OK', null);
                }
            });
        }
    };

    this.SendTraces = function(data, callback) {
        var tracker = this;

        if (tracker.settings.debug) {
            console.log('Sending traces: ' + data);
        }

        this.HttpRequest(tracker.url + tracker.collector + 'track', 'post', { Authorization: tracker.auth, 'Content-Type': 'application/json' }, data,
         function (data) {
            if (tracker.settings.debug) {
                console.info(data);
            }

            tracker.connected = true;

            callback(data, null);
        },
         function (data) {
            if (tracker.settings.debug && data.responseJSON) {
                console.log(data.responseJSON);
            }
            if (tracker.settings.debug) {
                console.log('Error flushing, connection disabled temporaly');
            }

            tracker.connected = false;

            callback(data, true);
        });
    };

    this.setScore = function(value) {
        this.addExtension('score', value);
    };

    this.setCompletion = function(value) {
        this.addExtension('completion', value);
    };

    this.setSuccess = function(value) {
        this.addExtension('success', value);
    };

    this.setResponse = function(value) {
        this.addExtension('response', value);
    };

    this.setProgress = function(value) {
        this.addExtension('progress', value);
    };

    this.setVar = function(key,value) {
        this.addExtension(key,value);
    };

    this.addExtension = function(key,value) {
        this.extensions[key] = value;
    };

    // PLUGINS
    this.addPlugin = function(plugin) {
        var key = null;

        for (key in plugin.functions) {
            if (key in this) {
                console.log('WARNING: Function ' + key + '() already exists in tracker, ignoring.');
                continue;
            }

            this[key] = new plugin.functions[key](this);
        }

        key = null;
        for (key in plugin.verbs) {
            if (typeof TrackerEvent.TraceVerb.VerbIDs[key] !== 'undefined') {
                console.log('WARNING: Verb ' + key + ' already exists in verbs list, ignoring.');
                continue;
            }

            TrackerEvent.TraceVerb.VerbIDs[key] = plugin.verbs[key];
        }

        key = null;
        for (key in plugin.objects) {
            if (typeof TrackerEvent.TraceObject.ObjectIDs[key] !== 'undefined') {
                console.log('WARNING: Object ' + key + ' already exists in objects list, ignoring.');
                continue;
            }

            TrackerEvent.TraceObject.ObjectIDs[key] = plugin.objects[key];
        }

        key = null;
        for (key in plugin.extensions) {
            if (typeof TrackerEvent.TraceResult.ExtensionIDs[key] !== 'undefined') {
                console.log('WARNING: Extension ' + key + ' already exists in extensions list, ignoring.');
                continue;
            }

            TrackerEvent.TraceResult.ExtensionIDs[key] = plugin.extensions[key];
        }

        key = null;
        for (key in plugin.interfaces) {
            if (key in this) {
                console.log('WARNING: Interface ' + key + ' already exists, ignoring.');
                continue;
            }

            this[key] = new plugin.interfaces[key](this);
        }
    };

    // CONNECTION
    this.HttpRequest = function(url, method, headers, body, success, error) {
        $.ajax({
            url: url,
            type: method,
            headers: headers,
            dataType: 'json',
            data: body,
            success: success,
            error: error
        });
    };

    this.LocalStorage = {
        getItem: function(name) {
            return localStorage.getItem(name);
        },
        setItem: function(name, data) {
            localStorage.setItem(name, data);
        }
    };
}

var obsize = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            size++;
        }
    }
    return size;
};

var ismap = function(obj) {
    for (var key in obj) {
        if (typeof obj[key] === 'object') {
            return false;
        }
    }
    return true;
};

function TrackerEvent (tracker) {
    this.tracker = tracker;

    this.TimeStamp = Date.now();

    this.Actor = null;
    this.Event = null;
    this.Target = null;
    this.Result = null;

    this.setActor = function(actor) {
        this.Actor = actor;
    };

    this.setEvent = function(event) {
        this.Event = event;
        this.Event.parent = this;
    };

    this.setTarget = function(target) {
        this.Target = target;
        this.Target.parent = this;
    };

    this.setResult = function(result) {
        this.Result = result;
        this.Result.parent = this;
    };

    this.ToCsv = function() {
        return this.TimeStamp +
         ',' + this.Event.ToCsv() +
         ',' + this.Target.ToCsv() +
         (this.Result === null && this.Result.ToCsv() ? '' : this.Result.ToCsv());
    };

    this.ToXapi = function() {
        var t = {
            actor: this.Actor === null || this.Actor === '{}' ? (this.tracker.actor === null ? {} : this.tracker.actor) : this.Actor,
            verb: this.Event.ToXapi(),
            object: this.Target.ToXapi(),
            timestamp: moment().toISOString()
        };

        if (this.Result !== null) {
            var result = this.Result.ToXapi();
            if (obsize(result) > 0) {
                t.result = result;
            }
        }

        return JSON.stringify(t, null, 4);
    };
}

// ##############################################
// ################ NESTED TYPES ################
// ##############################################

// Trace Verb

TrackerEvent.TraceVerb = function(verb) {
    this.verb = verb;

    this.ToCsv = function() {
        return this.verb.replaceAll(',', '\\,');
    };

    this.ToXapi = function() {
        if (TrackerEvent.TraceVerb.VerbIDs.hasOwnProperty(this.verb)) {
            return { id: TrackerEvent.TraceVerb.VerbIDs[this.verb] };
        }

        return { id: this.verb };
    };
};

TrackerEvent.TraceVerb.VerbIDs = {
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

TrackerEvent.TraceObject.ObjectIDs = {
    // Completable
    game: 'https://w3id.org/xapi/seriousgames/activity-types/serious-game' ,
    session: 'https://w3id.org/xapi/seriousgames/activity-types/session',
    level: 'https://w3id.org/xapi/seriousgames/activity-types/level',
    quest: 'https://w3id.org/xapi/seriousgames/activity-types/quest',
    stage: 'https://w3id.org/xapi/seriousgames/activity-types/stage',
    combat: 'https://w3id.org/xapi/seriousgames/activity-types/combat',
    storynode: 'https://w3id.org/xapi/seriousgames/activity-types/story-node',
    race: 'https://w3id.org/xapi/seriousgames/activity-types/race',
    completable: 'https://w3id.org/xapi/seriousgames/activity-types/completable',

    // Acceesible
    screen: 'https://w3id.org/xapi/seriousgames/activity-types/screen' ,
    srea: 'https://w3id.org/xapi/seriousgames/activity-types/area',
    zone: 'https://w3id.org/xapi/seriousgames/activity-types/zone',
    cutscene: 'https://w3id.org/xapi/seriousgames/activity-types/cutscene',
    accessible: 'https://w3id.org/xapi/seriousgames/activity-types/accessible',

    // Alternative
    question: 'http://adlnet.gov/expapi/activities/question' ,
    menu: 'https://w3id.org/xapi/seriousgames/activity-types/menu',
    dialog: 'https://w3id.org/xapi/seriousgames/activity-types/dialog-tree',
    path: 'https://w3id.org/xapi/seriousgames/activity-types/path',
    arena: 'https://w3id.org/xapi/seriousgames/activity-types/arena',
    alternative: 'https://w3id.org/xapi/seriousgames/activity-types/alternative',

    // GameObject
    enemy: 'https://w3id.org/xapi/seriousgames/activity-types/enemy' ,
    npc: 'https://w3id.org/xapi/seriousgames/activity-types/non-player-character',
    item: 'https://w3id.org/xapi/seriousgames/activity-types/item',
    gameobject: 'https://w3id.org/xapi/seriousgames/activity-types/game-object'
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
            case 'success': {		this.Success = extensions[key]; break; }
            case 'completion': {	this.Completion = extensions[key]; break; }
            case 'response': {		this.Response = extensions[key]; break; }
            case 'score': {			this.Score = extensions[key]; break; }
            default: {				this.Extensions[key] = extensions[key]; break; }
        }
        }
    };

    this.ToCsv = function() {
        var success = (this.Success !== null) ? ',success,' + this.Success.toString() : '';
        var completion = (this.Completion !== null) ? ',completion,' + this.Completion.toString() : '';
        var response = (this.Response) ? ',response,' + this.Response.replaceAll(',', '\\,') : '';
        var score = (this.Score !== null) ? ',score,' + this.Score.toString() : '';

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
            ret.score = {raw: Number(this.Score)};
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

var Accessible = function(tracker) {

    this.tracker = tracker;

    this.AccessibleType = {
        Screen: 0,
        Area: 1,
        Zone: 2,
        Cutscene: 3,
        Accessible: 4,
        properties: ['screen', 'area', 'zone', 'cutscene', 'accessible']
    };

    this.Accessed = function(reachableId, type) {
        if (typeof type === 'undefined') {type = 4;}

        return this.tracker.Trace('accessed',this.AccessibleType.properties[type],reachableId);
    };

    this.Skipped = function(reachableId, type) {
        if (typeof type === 'undefined') {type = 4;}

        return this.tracker.Trace('skipped',this.AccessibleType.properties[type],reachableId);
    };
};

var Alternative = function(tracker) {

    this.tracker = tracker;

    this.AlternativeType = {
        Question: 0,
        Menu: 1,
        Dialog: 2,
        Path: 3,
        Arena: 4,
        Alternative: 5,
        properties: ['question', 'menu', 'dialog', 'path', 'arena', 'alternative']
    };

    this.Selected = function(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}

        this.tracker.setResponse(optionId);
        return this.tracker.Trace('selected',this.AlternativeType.properties[type],alternativeId);
    };

    this.Unlocked = function(alternativeId, optionId, type) {
        if (typeof type === 'undefined') {type = 5;}

        this.tracker.setResponse(optionId);
        return this.tracker.Trace('unlocked',this.AlternativeType.properties[type],alternativeId);
    };
};

var Completable = function(tracker) {

    this.tracker = tracker;

    this.CompletableType = {
        Game: 0,
        Session: 1,
        Level: 2,
        Quest: 3,
        Stage: 4,
        Combat: 5,
        StoryNode: 6,
        Race: 7,
        Completable: 8,
        properties: ['game', 'session', 'level', 'quest', 'stage', 'combat', 'storynode', 'race', 'completable']
    };

    this.Initialized = function(completableId, type) {
        if (typeof type === 'undefined') {type = 8;}

        return this.tracker.Trace('initialized',this.CompletableType.properties[type],completableId);
    };

    this.Progressed = function(completableId, type, progress) {
        if (typeof type === 'undefined') {type = 8;}

        this.tracker.setProgress(progress);
        return this.tracker.Trace('progressed',this.CompletableType.properties[type],completableId);
    };

    this.Completed = function(completableId, type, success, score) {
        if (typeof type === 'undefined') {type = 8;}
        if (typeof success === 'undefined') {success = true;}
        if (typeof score === 'undefined') {score = 1;}

        this.tracker.setSuccess(success);
        this.tracker.setScore(score);
        return this.tracker.Trace('completed',this.CompletableType.properties[type],completableId);
    };
};

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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

Array.prototype.peek = function(n) {
    n = Math.min(this.length, n);

    var tmp = [];

    for (var i = 0; i < n; i++) {
        tmp.push(this[i]);
    }

    return tmp;
};

Array.prototype.dequeue = function(n) {
    n = Math.min(this.length, n);

    var tmp = [];

    for (var i = 0; i < n; i++) {
        tmp.push(this.shift());
    }

    return tmp;
};

module.exports = TrackerAsset;