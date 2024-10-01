
//import xAPITrackerAssetOAuth1 from '../src/Auth/OAuth1';
import xAPITrackerAssetOAuth2 from '../src/Auth/OAuth2.js';
import {AccessibleTracker, ACCESSIBLETYPE } from '../src/HighLevel/Accessible.js';
import { CompletableTracker , COMPLETABLETYPE } from '../src/HighLevel/Completable.js';
import {AlternativeTracker , ALTERNATIVETYPE } from '../src/HighLevel/Alternative.js';
import { GameObjectTracker , GAMEOBJECTTYPE } from '../src/HighLevel/GameObject.js';
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
        var xapiTracker = new xAPITrackerAssetOAuth2(jsonData.lrs_endpoint, jsonData.auth_parameters, "https://simva-beta2.e-ucm.es/", "gxra")
        var accessibleTracker=new AccessibleTracker(xapiTracker);
        var completableTracker=new CompletableTracker(xapiTracker);
        var alternativeTracker=new AlternativeTracker(xapiTracker);
        var gameObjectTracker=new GameObjectTracker(xapiTracker);
        accessibleTracker.Accessed("https://testid/");
        completableTracker.Initialized("https://mynewSeriousGame", COMPLETABLETYPE.GAME);
        completableTracker.Progressed("https://mynewSeriousGame", COMPLETABLETYPE.GAME, 0.5);
        var mystatement=xapiTracker.Trace("initialized", "game", "https://github.com/xapijs/xapi");
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
});

