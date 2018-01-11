var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var TrackerAsset = require('../src/js-tracker');

var tracker = new TrackerAsset();
tracker.HttpRequest = function(url, method, headers, body, success, error){
	if (connected){
		var result = JSON.parse("{"
            + "\"authToken\": \"5a26cb5ac8b102008b41472b5a30078bc8b102008b4147589108928341\", "
            + "\"actor\": { \"account\": { \"homePage\": \"http://a2:3000/\", \"name\": \"Anonymous\"}, \"name\": \"test-animal-name\"}, "
            + "\"playerAnimalName\": \"test-animal-name\", "
            + "\"playerId\": \"5a30078bc8b102008b41475769103\", "
            + "\"objectId\": \"http://a2:3000/api/proxy/gleaner/games/5a26cb5ac8b102008b41472a/5a26cb5ac8b102008b41472b\", "
            + "\"session\": 1, "
            + "\"firstSessionStarted\": \"2017-12-12T16:44:59.273Z\", "
            + "\"currentSessionStarted\": \"2017-12-12T16:44:59.273Z\" "
            + "}").toString();

        netstorage += body;

        success(result)
    }
    else
    {
        error("Cant connect");
    }
};

var storage = [];
tracker.LocalStorage = {
	getItem: function(name){
		return storage[name];
	},
	setItem: function(name, data){
		storage[name] = data;
	}
}

var settings = 	{
	host : "http://localhost/",
	port : 80,
	secure : false,
	trackingCode : "test",
	userToken: "",
	max_flush: 4,
	batch_size: 10,
	backupStorage: true,
	debug: false,
	force_actor: true
}

var enqueueTrace01 = function(){
	return tracker.ActionTrace("accessed", "gameobject", "ObjectID");
}

var enqueueTrace02 = function(){
	tracker.setResponse("TheResponse");
	tracker.setScore(0.123);
	return tracker.ActionTrace("initialized", "game", "ObjectID2");
}

var enqueueTrace03 = function(){
	tracker.setResponse("AnotherResponse");
	tracker.setScore(123.456);
	tracker.setSuccess(false);
	tracker.setCompletion(true);
	tracker.setVar("extension1", "value1");
	tracker.setVar("extension2", "value2");
	tracker.setVar("extension3", 3);
	tracker.setVar("extension4", 4.56);
	return tracker.ActionTrace("selected", "zone", "ObjectID3");
}

var obsize = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

var connected = true;
var netstorage = "";
var initTracker = function(callback){
    tracker.Stop();
    netstorage = "";
    tracker.settings = settings;
    tracker.Start(callback);
}


describe('TrackerAsset Connection Tests', function() {
	it('TestTraceSendingSync', function(){
		initTracker(function(){
			tracker.LocalStorage.setItem(tracker.backup_file, "");

		    enqueueTrace01();
		    tracker.Flush(function(){
			    var text = netstorage;
			    var file = JSON.parse(text);
			    var tracejson = file[file.length - 1];

			    expect(obsize(tracejson)).to.equal(4);
		        expect(tracejson["object"]["id"]).to.contain("ObjectID");
		        expect(tracejson["object"]["definition"]["type"]).to.equal("https://w3id.org/xapi/seriousgames/activity-types/game-object");
		        expect(tracejson["verb"]["id"]).to.equal("https://w3id.org/xapi/seriousgames/verbs/accessed");

			    netstorage += ",";
			    enqueueTrace02();
			    enqueueTrace03();
			    tracker.Flush(function(){
				    var text = "[" + netstorage + "]";
				    file = JSON.parse(text);

				    expect(obsize(file)).to.equal(2);
				    expect(obsize(file[0])).to.equal(1);
				    expect(obsize(file[1])).to.equal(2);
			    });
		    });
		});
	});

	it('TestBackupSync', function(){
		initTracker(function(){
		    storage[settings.BackupFile] = "";

		    tracker.LocalStorage.setItem(tracker.backup_file, "");

		    enqueueTrace01();
		    tracker.Flush(function(){
			    netstorage += ",";
			    enqueueTrace02();
			    enqueueTrace03();
			    tracker.Flush(function(){
				    var text = storage[tracker.backup_file];
				    var file = text.split('\n');
				    expect(file.length).to.equal(4);
			    });
		    });
		});
	});

	it('TestTraceSending_IntermitentConnection', function(){
	    initTracker(function(){
	    	netstorage = "";
	    	enqueueTrace01();

	    	tracker.Flush(function(){
				var text = netstorage;
			    var file = JSON.parse(text);
			    var tracejson = file[file.length - 1];

			    expect(obsize(tracejson)).to.equal(4);
		        expect(tracejson["object"]["id"]).to.contain("ObjectID");
		        expect(tracejson["object"]["definition"]["type"]).to.equal("https://w3id.org/xapi/seriousgames/activity-types/game-object");
		        expect(tracejson["verb"]["id"]).to.equal("https://w3id.org/xapi/seriousgames/verbs/accessed");

		        connected = false;
		        enqueueTrace02();
			    enqueueTrace03();

			    tracker.Flush(function(){
			    	var text = netstorage;
				    var file = JSON.parse(text);
				    expect(obsize(file)).to.equal(1);
				    connected = true;

				    netstorage += ",";

				    tracker.Flush(function(){
				    	var text = netstorage;
				    	text = "[" + text + "]";
				    	var file = JSON.parse(text);

					    expect(obsize(file)).to.equal(2);
					    expect(obsize(file[0])).to.equal(1);
					    expect(obsize(file[1])).to.equal(2);
				    });
			    });
	    	});
	    });   
	});

	it('TestBackupSync_IntermitentConnection', function(){
	    initTracker(function(){
	    	netstorage = "";
	    	storage[tracker.backup_file] = "";

	    	enqueueTrace01();
	    	tracker.Flush(function(){
			    var text = storage[tracker.backup_file];
			    var file = text.split('\n');
			    expect(file.length).to.equal(2);

			    connected = false;

			    enqueueTrace02();
	   			enqueueTrace03();
	   			tracker.Flush(function(){
				    var text = storage[tracker.backup_file];
				    var file = text.split('\n');
				    expect(file.length).to.equal(4);

				    connnected = true;

				    tracker.Flush(function(){
				    	var text = storage[tracker.backup_file];
					    var file = text.split('\n');
					    expect(file.length).to.equal(4);

					    connnected = true;
				    });
	   			});
	    	});
	    });
	});

	it('TestTraceSending_WithoutStart', function(){
	    tracker.Stop();

	    tracker.Accessible.Accessed("error");

	    tracker.Flush(function(result, error){
	    	expect(error).to.equal(true);
	    });
	});

	it('TestTraceSendingStartFailed', function(){
	    tracker.Stop();

	    connected = false;

	    initTracker(function(){
	    	netstorage = "";
	    	storage[tracker.backup_file] = "";

	    	enqueueTrace01();
	    	tracker.Flush(function(){
	    		expect(netstorage).to.equal("");
	    		expect(storage[tracker.backup_file]).to.not.equal("");

	    		connected = true;
			    enqueueTrace02();
			    enqueueTrace03();

	    		tracker.Flush(function(){
	   				var text = netstorage;
			    	text = netstorage.replace("][", "],[");
			    	text = "[" + text + "]";

			    	var file = JSON.parse(text);

				    expect(obsize(file)).to.equal(2);
				    expect(obsize(file[0])).to.equal(1);
				    expect(obsize(file[1])).to.equal(2);

				    tracejson = file[0][0];

				    expect(obsize(tracejson)).to.equal(4);
			        expect(tracejson["object"]["id"]).to.contain("ObjectID");
			        expect(tracejson["object"]["definition"]["type"]).to.equal("https://w3id.org/xapi/seriousgames/activity-types/game-object");
			        expect(tracejson["verb"]["id"]).to.equal("https://w3id.org/xapi/seriousgames/verbs/accessed");

			        var text = storage[tracker.backup_file];
				    var file = text.split('\n');
				    expect(file.length).to.equal(4);
	    		});
	    	});
	    });
	});

	it('TestEmptyQueueFlush', function(){
	    connected = false;

	    initTracker(function(){
	    	netstorage = "";
	    	storage[tracker.backup_file] = "";

	    	tracker.Flush(function(){
	    		expect(netstorage).to.equal("");

	    		tracker.Flush(function(){
		    		expect(netstorage).to.equal("");

		    		connected = true;
		    		tracker.Flush(function(){
		    			expect(netstorage).to.equal("");
		    			connected = false;

		    			enqueueTrace01();
		    			tracker.Flush(function(){
		    				tracker.Flush(function(){
		    					connected = true;
		    					tracker.Flush(function(){
				    				tracker.Flush(function(){
									    var file = JSON.parse(netstorage);

									    expect(file.length).to.equal(1);

									    var backup = storage[tracker.backup_file].split("\n");
									    expect(backup.length).to.equal(2);
				    				});
				    			});
		    				});
		    			});
		   			});
			    });
		    });
	    });
	});
});