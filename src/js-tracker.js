/*
 * Copyright 2017 e-UCM, Universidad Complutense de Madrid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * This project has received funding from the European Union’s Horizon
 * 2020 research and innovation programme under grant agreement No 644187.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var $ = require("jquery");
var moment = require("./moment.js");

function TrackerAsset(){

	this.settings = {
		host : "https://rage.e-ucm.es/",
		port : 443,
		secure : true,
		trackingCode : "",
		userToken: "",
		max_flush: 4,
		batch_size: 10,
		backupStorage: true,
		debug: true
	}

	this.collector = "proxy/gleaner/collector/";

	this.url = "";
	this.logged_token = "";
	this.auth = "";
	this.playerId = "";
	this.objectId = "";

	this.session = 0;
	this.actor = "{}";
	this.extensions = {};

	this.queue = [];

	this.Accessible = new Accessible(this);
	this.Alternative = new Alternative(this);
	this.Completable = new Completable(this);
	this.GameObject = new GameObject(this);

	this.generateURL = function(){
		var splitted = this.settings.host.split ('/');
		var host_splitted = splitted [2].split (':');

		var domain = host_splitted [0];
		var secure = secure || splitted[0] == "https:";
		var port = (host_splitted.Length > 1) ? parseint(host_splitted[1]) : (splitted[0] == "https:" ? 443 : 80);

		this.url = (secure ? 'https://' : 'http://') + domain + '/api/';
		console.log(this.url);
	}

	this.Login = function(username, password, callback){
		this.generateURL();

		var tracker = this;
		$.ajax({
			url: this.url + "login",
			type: 'post',
			data: JSON.stringify({username: username, password: password}),
			headers: {
				'Content-Type': 'application/json'
			},
			dataType: 'json',
			success: function (data) {
				tracker.logged_token = data['user']['token'];
				if(tracker.settings.debug)
					console.info("AuthToken: " + data['user']['token']);
				callback(data, null);
				
			},
			error: function (data) {
				if(tracker.settings.debug)
					console.info(data);
				callback(data, true)
			}
		});
	}

	this.Start = function(callback){
		this.generateURL();

		var tracker = this;

		var headers = {
			'Content-Type': 'application/json'
		};

		if(this.logged_token)
			headers.Authorization = "Bearer " + this.logged_token;

		$.ajax({
			url: this.url + this.collector + "start/" + this.settings.trackingCode,
			type: 'post',
			headers: headers,
			dataType: 'json',
			success: function (data) {
				if(tracker.settings.debug)
					console.info(data);

				tracker.auth = data['authToken'];
				tracker.actor = data['actor'];
				tracker.playerId = data['playerId'];
				tracker.objectId = null;//data['objectId'];
				tracker.session = data['session'];

				callback(data, null)
			},
			error: function (data) {
				callback(data,true)
			}
		});
	}

	this.ActionTrace = function(verb,type,id){
		var t = new TrackerEvent(this);
		t.setActor(this.actor);
		t.setEvent(new TrackerEvent.TraceVerb(verb));
		t.setTarget(new TrackerEvent.TraceObject(type, id));
		t.setResult(new TrackerEvent.TraceResult());
		t.Result.setExtensions(this.extensions);
		this.extensions = {};

		this.queue.push(t);
		return t;
	}

	this.Trace = function(verb,type,id){
		return this.ActionTrace(verb,type,id);
	}

	this.Flush = function(callback){
		if(this.queue.length > 0){
			var traced = 0;
			var to_flush = "";

			if(this.settings.backupStorage)
				var backup = "";

			while(this.queue.length > 0 && traced < this.settings.max_flush){
				traced++;

				var current = this.queue.shift();

				to_flush += current.ToXapi() + ',';

				if(this.settings.backupStorage)
					backup += current.ToCsv() + '\r\n';
			}

			to_flush = to_flush.replaceAll(/(^,)|(,$)/g, "");

			if(this.backupStorage){
				var current = localStorage.getItem("backup")

				if(current)
					backup = current + backup;

				localStorage.setItem("backup", backup);
			}

			var tracker = this;

			$.ajax({
				url: this.url + this.collector + "track",
				type: 'post',
				data: "[" + to_flush + "]",
				headers: {
					'Authorization': this.auth,
					'Content-Type': 'application/json'
				},
				dataType: 'json',
				success: function (data) {
					if(tracker.settings.debug)
						console.info(data);
					callback(data, null);
				},
				error: function (data) {
					if(tracker.settings.debug)
						console.info(data);
					callback(data, true);
				}
			});
		}
	}

	this.setScore = function(value){
		this.addExtension("score", value);
	}

	this.setCompletion = function(value){
		this.addExtension("completion", value);
	}

	this.setSuccess = function(value){
		this.addExtension("success", value);
	}

	this.setResponse = function(value){
		this.addExtension("response", value);
	}

	this.setProgress = function(value){
		this.addExtension("progress", value);
	}

	this.setVar = function(key,value){
		this.addExtension(key,value);
	}

	this.addExtension = function(key,value){
		this.extensions[key] = value;
	}
}

var obsize = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

var ismap = function(obj) {
	for (var key in obj) {
		if (typeof obj[key] === 'object')
			return false
	}
	return true;
};

function TrackerEvent (tracker){
	this.tracker = tracker;

	this.TimeStamp = Date.now();

	this.Actor;
	this.Event;
	this.Target;
	this.Result;

	this.setActor = function(actor){
		this.Actor = actor;
	}

	this.setEvent = function(event){
		this.Event = event;
		this.Event.parent = this;
	}

	this.setTarget = function(target){
		this.Target = target;
		this.Target.parent = this;
	}

	this.setResult = function(result){
		this.Result = result;
		this.Result.parent = this;
	}

	this.ToCsv = function()
	{
		return this.TimeStamp
			+ "," + this.Event.ToCsv()
			+ "," + this.Target.ToCsv() 
			+ (this.Result == null && this.Result.ToCsv() ? "" : this.Result.ToCsv());
	}

	this.ToXapi = function()
	{
		var t = {
			actor: this.Actor == null ? {} : this.Actor,
			verb: this.Event.ToXapi(), 
			object: this.Target.ToXapi(),
			timestamp: moment().toISOString()
		};

		if(this.Result != null){
			var result = this.Result.ToXapi();
			if (obsize(result) > 0)
				t.result = result;
		}

		return JSON.stringify(t, null, 4);
	}
}

//##############################################
//################ NESTED TYPES ################
//##############################################

// Trace Verb

TrackerEvent.TraceVerb = function(verb)
{
	this.verb = verb;

	this.ToCsv = function()
	{
		return this.verb.replaceAll(",", "\\,");
	}

	this.ToXapi = function()
	{
		if (TrackerEvent.TraceVerb.VerbIDs.hasOwnProperty(this.verb))
		{
			return {id: TrackerEvent.TraceVerb.VerbIDs[this.verb] };
		}
		else
		{
			return {id: this.verb}
		}
	}
}

TrackerEvent.TraceVerb.VerbIDs = {
	initialized: "http://adlnet.gov/expapi/verbs/initialized",
	progressed: "http://adlnet.gov/expapi/verbs/progressed",
	completed: "http://adlnet.gov/expapi/verbs/completed",
	accessed: "https://w3id.org/xapi/seriousgames/verbs/accessed",
	skipped: "http://id.tincanapi.com/verb/skipped",
	selected: "https://w3id.org/xapi/adb/verbs/selected",
	unlocked: "https://w3id.org/xapi/seriousgames/verbs/unlocked",
	interacted: "http://adlnet.gov/expapi/verbs/interacted",
	used: "https://w3id.org/xapi/seriousgames/verbs/used"
};

// Trace Target

TrackerEvent.TraceObject = function(type, id){
	this.parent;

	this.Type = type;
	this.ID = id;

	this.ToCsv = function(){
		return this.Type.replaceAll(",","\\,") + "," + this.ID.replaceAll(",", "\\,");
	}

	this.ToXapi = function()
	{
		var typeKey = this.Type;

		if (TrackerEvent.TraceObject.ObjectIDs.hasOwnProperty(this.Type))
		{
			typeKey = TrackerEvent.TraceObject.ObjectIDs[this.Type];
		}

		id = ((this.parent.tracker.objectId != null) ? this.parent.tracker.objectId + '/' + this.Type.toLowerCase() + '/' : "") + this.ID;
		definition = {type : typeKey};

		return {
			id: id,
			definition: definition
		};
	}
}

TrackerEvent.TraceObject.ObjectIDs = {
	// Completable
	game: "https://w3id.org/xapi/seriousgames/activity-types/serious-game" ,
	session: "https://w3id.org/xapi/seriousgames/activity-types/session",
	level: "https://w3id.org/xapi/seriousgames/activity-types/level",
	quest: "https://w3id.org/xapi/seriousgames/activity-types/quest",
	stage: "https://w3id.org/xapi/seriousgames/activity-types/stage",
	combat: "https://w3id.org/xapi/seriousgames/activity-types/combat",
	storynode: "https://w3id.org/xapi/seriousgames/activity-types/story-node",
	race: "https://w3id.org/xapi/seriousgames/activity-types/race",
	completable: "https://w3id.org/xapi/seriousgames/activity-types/completable",

	// Acceesible
	screen: "https://w3id.org/xapi/seriousgames/activity-types/screen" ,
	srea: "https://w3id.org/xapi/seriousgames/activity-types/area",
	zone: "https://w3id.org/xapi/seriousgames/activity-types/zone",
	cutscene: "https://w3id.org/xapi/seriousgames/activity-types/cutscene",
	accessible: "https://w3id.org/xapi/seriousgames/activity-types/accessible",

	// Alternative
	question: "http://adlnet.gov/expapi/activities/question" ,
	menu: "https://w3id.org/xapi/seriousgames/activity-types/menu",
	dialog: "https://w3id.org/xapi/seriousgames/activity-types/dialog-tree",
	path: "https://w3id.org/xapi/seriousgames/activity-types/path",
	arena: "https://w3id.org/xapi/seriousgames/activity-types/arena",
	alternative: "https://w3id.org/xapi/seriousgames/activity-types/alternative",

	// GameObject
	enemy: "https://w3id.org/xapi/seriousgames/activity-types/enemy" ,
	npc: "https://w3id.org/xapi/seriousgames/activity-types/non-player-character",
	item: "https://w3id.org/xapi/seriousgames/activity-types/item",
	gameobject: "https://w3id.org/xapi/seriousgames/activity-types/game-object"
};

// Trace Target

TrackerEvent.TraceResult = function(){
	this.parent;

	this.Score = null;
	this.Success = null;
	this.Completion = null;
	this.Response = null;
	this.Extensions = null;

	this.setExtensions = function(extensions){
		this.Extensions = {};

		for (var key in extensions) {
			switch (key.toLowerCase())
			{
				case "success": 	this.Success = extensions[key]; break;
				case "completion": 	this.Completion = extensions[key]; break;
				case "response": 	this.Response = extensions[key]; break;
				case "score": 		this.Score = extensions[key]; break;
				default: 			this.Extensions[key] = extensions[key]; break;
			}
		}
	}

	this.ToCsv = function(){
		var result =
			((this.Success!=null) ? ",success," + this.Success.toString() : "")
			+ ((this.Completion!=null) ? ",completion," + this.Completion.toString() : "")
			+ ((this.Response) ? ",response," + this.Response.replaceAll(",", "\\,") : "")
			+ ((this.Score!=null) ? ",score," + this.Score.toString() : "");

		if (this.Extensions != null && obsize(this.Extensions) > 0){
			for (var key in this.Extensions)
			{
				result += "," + key.replaceAll(",", "\\,") + ",";
				if(this.Extensions[key] !== null)
				{
					if(typeof this.Extensions[key] === 'number')
						result += this.Extensions[key];
					else if (typeof this.Extensions[key] === 'string')
						result += this.Extensions[key].replaceAll(",", "\\,");
					else if (typeof this.Extensions[key] === 'object')
					{
						if(ismap(this.Extensions[key])){
							var smap = "";

							for(var k in this.Extensions[key]){
								if(typeof this.Extensions[key][k] === 'number')
									smap += k + "=" + this.Extensions[key][k] + "-";
								else
									smap += k + "=" + this.Extensions[key][k].replaceAll(",", "\\,") + "-";
							}

							result += smap.slice(0,-1);
						}
					}
					else
					{
						result += this.Extensions[key];
					}
				}
			}
		}

		return result;
	}

	this.ToXapi = function()
	{
		var ret = {};

		if (this.Success != null)
			ret.success = (this.Success) ? true : false;

		if (this.Completion != null)
			ret.completion = (this.Completion) ? true : false;

		if (this.Response)
			ret.response = this.Response.toString();

		if (this.Score != null)
		{
			ret.score = {raw: Number(this.Score)};
		}

		if( this.Extensions != null && obsize(this.Extensions) > 0){
			ret.extensions = this.Extensions;

			for(key in this.Extensions){
				if(TrackerEvent.TraceResult.ExtensionIDs.hasOwnProperty(key)){
					this.Extensions[TrackerEvent.TraceResult.ExtensionIDs[key]] = this.Extensions[key];
        			delete this.Extensions[key];
				}
			}
		}

		return ret;
	}
}

TrackerEvent.TraceResult.ExtensionIDs = {
	health: "https://w3id.org/xapi/seriousgames/extensions/health",
	position: "https://w3id.org/xapi/seriousgames/extensions/position",
	progress: "https://w3id.org/xapi/seriousgames/extensions/progress"
};

//#################################################
//################ XAPI INTERFACES ################
//#################################################

Accessible = function(tracker){

	this.tracker = tracker;

	this.AccessibleType = {
		Screen: 0,
        Area: 1,
        Zone: 2,
        Cutscene: 3,
        Accessible: 4,
        properties: ["screen", "area", "zone", "cutscene", "accessible"]
    }

    this.Accessed = function(reachableId, type){
  		if(typeof type === "undefined") {type = 4;}

  		return this.tracker.Trace("accessed",this.AccessibleType.properties[type],reachableId);
    }

    this.Skipped = function(reachableId, type){
  		if(typeof type === "undefined") {type = 4;}
  		
    	return this.tracker.Trace("skipped",this.AccessibleType.properties[type],reachableId);
    }
}

Alternative = function(tracker){

	this.tracker = tracker;

	this.AlternativeType = {
		Question: 0,
        Menu: 1,
        Dialog: 2,
        Path: 3,
        Arena: 4,
        Alternative: 5,
        properties: ["question", "menu", "dialog", "path", "arena", "alternative"]
    }

    this.Selected = function(alternativeId, optionId, type){
  		if(typeof type === "undefined") {type = 5;}
  		
    	this.tracker.setResponse(optionId);
    	return this.tracker.Trace("selected",this.AlternativeType.properties[type],alternativeId);
    }

    this.Unlocked = function(alternativeId, optionId, type){
  		if(typeof type === "undefined") {type = 5;}
  		
    	this.tracker.setResponse(optionId);
    	return this.tracker.Trace("unlocked",this.AlternativeType.properties[type],alternativeId);
    }
}

Completable = function(tracker){

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
        properties: ["game", "session", "level", "quest", "stage", "combat", "storynode", "race", "completable"]
    }

    this.Initialized = function(completableId, type){
  		if(typeof type === "undefined") {type = 8;}
  		
    	return this.tracker.Trace("initialized",this.CompletableType.properties[type],completableId);
    }

    this.Progressed = function(completableId, type, progress){
  		if(typeof type === "undefined") {type = 8;}
  		
    	this.tracker.setProgress(progress);
    	return this.tracker.Trace("progressed",this.CompletableType.properties[type],completableId);
    }

    this.Completed = function(completableId, type, success, score){
  		if(typeof type === "undefined") {type = 8;}
  		if(typeof success === "undefined") {success = true;}
  		if(typeof score === "undefined") {score = 1;}
  		
    	this.tracker.setSuccess(success);
    	this.tracker.setScore(score);
    	return this.tracker.Trace("completed",this.CompletableType.properties[type],completableId);
    }
}

GameObject = function(tracker){

	this.tracker = tracker;

	this.GameObjectType = {
		Enemy: 0,
        Npc: 1,
        Item: 2,
        GameObject: 3,
        properties: ["enemy", "npc", "item", "gameobject"]
    }

    this.Interacted = function(gameobjectId, type){
  		if(typeof type === "undefined") {type = 3;}

    	return this.tracker.Trace("interacted",this.GameObjectType.properties[type],gameobjectId);
    }

    this.Used = function(gameobjectId, type){
  		if(typeof type === "undefined") {type = 3;}

    	return this.tracker.Trace("used",this.GameObjectType.properties[type],gameobjectId);
    }
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

module.exports = TrackerAsset;