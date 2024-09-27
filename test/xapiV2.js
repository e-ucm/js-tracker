
var xAPITrackerAsset = require('../src/xAPITrackerAsset');
var Accessible = require('../src/HighLevel/Accessible');
var Completable = require('../src/HighLevel/Completable');
var Alternative = require('../src/HighLevel/Alternative');
var GameObject = require('../src/HighLevel/GameObject');
var XAPI = require("@xapi/xapi");
const fs = require('fs');

// Reading from a JSON file
currentdir=__dirname
fs.readFile(currentdir+'/config.json', 'utf8', async (err, data) => {
    if (err) {
        console.error("Error reading file:", err);
        return;
    }
    try {
        const jsonData = JSON.parse(data);
        console.log(jsonData); // Use the parsed JSON data
        var xapiTracker = new xAPITrackerAsset(jsonData.endpoint, XAPI.toBasicAuth(jsonData.username, jsonData.password), "https://simva-beta2.e-ucm.es/", "gxra")
        var accessibleTracker=new Accessible(xapiTracker);
        var completableTracker=new Completable(xapiTracker);
        var alternativeTracker=new Alternative(xapiTracker);
        var GameObjectTracker=new GameObject(xapiTracker);
        var mystatement=await accessibleTracker.Accessed("https://testid/");
        var mystatement=await completableTracker.Initialized("https://mynewSeriousGame", 0);
        var mystatement=await completableTracker.Progressed("https://mynewSeriousGame", 0, 0.5);
        var mystatement=xapiTracker.Trace("initialized", "game", "https://github.com/xapijs/xapi");
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
});

