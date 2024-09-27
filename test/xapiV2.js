
//var xAPITrackerAssetOAuth1 = require('../src/Auth/OAuth1');
var xAPITrackerAssetOAuth2 = require('../src/Auth/OAuth2');
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
        //var xapiTracker = new xAPITrackerAssetOAuth1(jsonData.endpoint, jsonData.username, jsonData.password, "https://simva-beta2.e-ucm.es/", "gxra")
        var xapiTracker2 = new xAPITrackerAssetOAuth2(jsonData.endpoint, jsonData.config, "https://simva-beta2.e-ucm.es/", "gxra")
        //var accessibleTracker=new Accessible(xapiTracker);
        //var completableTracker=new Completable(xapiTracker);
        //var alternativeTracker=new Alternative(xapiTracker);
        //var GameObjectTracker=new GameObject(xapiTracker);
        //accessibleTracker.Accessed("https://testid/");
        //completableTracker.Initialized("https://mynewSeriousGame", 0);
        //completableTracker.Progressed("https://mynewSeriousGame", 0, 0.5);
        //var mystatement=xapiTracker.Trace("initialized", "game", "https://github.com/xapijs/xapi");
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
});

