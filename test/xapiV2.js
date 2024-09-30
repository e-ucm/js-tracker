
//import xAPITrackerAssetOAuth1 from '../src/Auth/OAuth1';
import xAPITrackerAssetOAuth2 from '../src/Auth/OAuth2.js';
import Accessible from '../src/HighLevel/Accessible.js';
import Completable from '../src/HighLevel/Completable.js';
import Alternative from '../src/HighLevel/Alternative.js';
import GameObject from '../src/HighLevel/GameObject.js';
import XAPI from "@xapi/xapi";
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the __filename equivalent
const __filename = fileURLToPath(import.meta.url);

// Get the __dirname equivalent
const __dirname = dirname(__filename);

console.log(__dirname);  // This will now behave like __dirname
// Reading from a JSON file
const currentdir=__dirname
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

