[![Build Status](https://travis-ci.org/e-ucm/js-tracker.svg?branch=master)](https://travis-ci.org/e-ucm/js-tracker) [![Coverage Status](https://coveralls.io/repos/e-ucm/js-tracker/badge.svg?branch=master&service=github)](https://coveralls.io/github/e-ucm/js-tracker?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/8332c331fee826d6ed36/maintainability)](https://codeclimate.com/github/e-ucm/js-tracker/maintainability) [![Dependency Status](https://david-dm.org/e-ucm/js-tracker.svg)](https://david-dm.org/e-ucm/js-tracker) [![devDependency Status](https://david-dm.org/e-ucm/js-tracker/dev-status.svg)](https://david-dm.org/e-ucm/js-tracker#info=devDependencies) [![Pull Request Stats](http://issuestats.com/github/e-ucm/js-tracker/badge/pr?style=flat)](http://issuestats.com/github/e-ucm/js-tracker) [![Issue Stats](http://issuestats.com/github/e-ucm/js-tracker/badge/issue?style=flat)](http://issuestats.com/github/e-ucm/js-tracker)


# JavaScript tracker

This code belongs to e-UCM research group and has been developed for the H2020 BEACONING Project and sends analytics information to a server; or, if the server is currently unavailable, stores them locally until it becomes available again.

![Beaconing logo](http://beaconing.eu/wp-content/themes/beaconing/images/logo/original_version_(black).png)


After a game is developed, a common need is to know how the players play, what interactions they follow within the game and how much time they spend in a game session; collectively, these are known as game analytics. Analytics are used to locate gameplay bottlenecks and assess  game effectiveness and learning outcomes, among other tasks.

## Installation
1. Obtain bundle library
    * Download files from Release
    * Clone or download repository and obtain them from /dist/
1. Copy into your project folder
1. Include library using, for example, `<script type="text/javascript" src="js-tracker.bundle.js"></script>>`
1. Configure the tracker by:
```js
var tracker = new TrackerAsset();

tracker.settings.host = "http://my.host:port/";
tracker.settings.trackingCode = "TrackingCode";
```
5. More configuration can be done with:
    * **port**: This should have the port for the analysis server
    * **secure**: Is the connection secure?
    * **max_flush**: max number of traces sent when flush
    * **batch_size**: max number of traces stored in the tracker queue
    * **backupStorage**: if enabled, csv traces will be stored at `localStorage.getItem("backup")`
    * **host**: This should have the host for the analysis server
    * **trackingCode**: If storage type is set to `net`, this is the [tracking code identifying the game](https://github.com/e-ucm/rage-analytics/wiki/Tracking-code)
    * **debug**: Enable to see tracker messages in the Unity console.
1. **optional** tracker.Login()
1. Start the tracker by using `tracker.Start()`
1. Send traces

## Integration example

An example test app can be found [here](https://github.com/e-ucm/js-tracker/blob/master/test_app.html).

## Plugin instalation

Include the plugin file into your program.

```html
<script type="text/javascript" src="plugins/geolocation.js"></script>
```

Add the plugin to the tracker using `tracker.addPlugin(plugin)`.

```js
var tracker = new TrackerAsset();

//Add the plugin
tracker.addPlugin(new TrackerPlugins.Geolocation());

//Enjoy the plugin
tracker.Places.Moved("Madrid", 1.4, 2.1, tracker.Places.PlaceType.UrbanArea);

```
### Tracker Login and Start

For tracker to send traces to the server, `tracker.Start()` has to be called. If you want to use an authenticated user, you can login before starting the tracker.

```js
var tracker = new TrackerAsset();

tracker.settings.host = "https://rage.e-ucm.es/";
tracker.settings.trackingCode = "58e3779b1043c7006d76d0e07sj9hnzljjo1dcxr";

//Login is optional. If not logged, anonymous actor is retrieved on start

var connected = false;
// You can use tracker.LoginBeaconing("accessToken", callback); if you want
tracker.Login("student","password", function(data,error){
  if(!error){
    tracker.Start(function(result, error){
      if(!error){
      	connected = true;
        console.log("tracker started");
      }else{
        console.log("start error")
      }
		});
  }else{
    console.log("login error")
  }
});
```
### Sending Traces to the Analytics Server

There are two methods used for sending traces:
1. Using the xAPI for serious games interfaces (Accessible, Alternative, Completable and GameObject).
1. Using `TrackerAsset.ActionTrace(verb,target_type,target_id)` method. This is **not recomended unless you have clear in mind what you're doing**. Remember that xAPI traces are focused on sending actions, not purely variable changes. If you want to track variables, you can add them as extensions using `TrackerAsset.setVar(key, val)`.

```js
//simple trace
tracker.GameObject.Used("GameObjectID2", tracker.GameObject.GameObjectType.Item);

//trace with extensions
tracker.setVar("extension1", "value1");
tracker.Accessible.Skipped("AccesibleID2", tracker.Accessible.AccessibleType.Screen);

//Very complex trace
tracker.setResponse("AnotherResponse");
tracker.setScore(123.456);
tracker.setSuccess(false);
tracker.setCompletion(true);
tracker.setVar("extension1", "value1");
tracker.setVar("extension2", "value2");
tracker.setVar("extension3", 3);
tracker.setVar("extension4", 4.56);
tracker.ActionTrace("selected", "zone", "ObjectID3");

//Sending the traces
tracker.Flush();
```
### Trace sending automatization

As in JavaScript is a language very oriented to Async programming, there are multiple alternatives to generate an automatic loop for sending traces automatically. For example, you can create a loop like:
```js

setInterval(function(){
	if(connected)
		tracker.Flush(function(result, error){
			console.log("flushed");
		})
}, 3000);
```

## User Guide

The tracker requires (if `net` mode is on) the [RAGE Analytics](https://github.com/e-ucm/rage-analytics) infrastructure up and running. Check out the [Quickstart guide](https://github.com/e-ucm/rage-analytics/wiki/Quickstart) and follow the `developer` and `teacher` steps in order to create a game and [setup a class](https://github.com/e-ucm/rage-analytics/wiki/Set-up-a-class). It also requires a:

* **Host**: where the server is at. This value usually looks like `<rage_server_hostmane>/api/proxy/gleaner/collector/`. The [collector](https://github.com/e-ucm/rage-analytics/wiki/Back-end-collector) is an endpoint designed to retrieve traces and send them to the analysis pipeline.
* **Tracking code**: an unique tracking code identifying the game. [This code is created in the frontend](https://github.com/e-ucm/rage-analytics/wiki/Tracking-code), when creating a new game.


The tracker exposes an API designed to collect, analyze and visualize the data. The  API consists on defining a set of **game objects**. A game object represents an element of the game on which players can perform one or several types of interactions. Some examples of player's interactions are:

* start or complete (interaction) a level (game object)
* increase or decrease (interaction) the number of coins (game object)
* select or unlock (interaction) a power-up (game object)

A **gameplay** is the flow of interactions that a player performs over these game objects in a sequential order.

The main typed of game objects supported are:

* [Completable](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/CompletableTracker.cs) - for Game, Session, Level, Quest, Stage, Combat, StoryNode, Race or any other generic Completable. Methods: `Initialized`, `Progressed` and `Completed`.
* [Accessible](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/AccessibleTracker.cs) - for Screen, Area, Zone, Cutscene or any other generic Accessible. Methods: `Accessed` and `Skipped`.
* [Alternative](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/AlternativeTracker.cs) - for Question, Menu, Dialog, Path, Arena or any other generic Alternative. Methods: `Selected` and `Unlocked`.
* [GameObject](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/GameObjectTracker.cs) for Enemy, Npc, Item or any other generic GameObject. Methods: `Interacted` and `Used`.

##### Completable

Usage example for the tracking of an in-game quest. We decided to use a completable game object for this use-case as the most suitable option:

```js
// Completable
// Initialized
tracker.Completable.Initialized("MyGameQuestId", tracker.Completable.CompletableType.Quest);

// Progressed
var progress = 0.8;
tracker.Completable.Progressed("MyGameQuestId", tracker.Completable.CompletableType.Quest, progress);

// Progressed
var success = true;
var score = 0.75;
var t = tracker.Completable.Completed("MyGameQuestId",tracker.Completable.CompletableType.Quest, success,score);
```

##### Accessible

Usage example for the tracking the player's movement through some in-game screens and skipping the `Intro` cutscene:

```js
// Accessible
// The player accessed the 'MainMenu' screen
tracker.Accessible.Accessed("MainMenu", tracker.Accessible.AccessibleType.Screen);

// The player skipped a cutscene
tracker.Accessible.Skipped("Intro", tracker.Accessible.AccessibleType.Cutscene);
```

##### Alternative

Usage example for the tracking the player's choices during a conversation:

```js
// Alternative
// The player selected the 'Ivan' answer for the question 'What's his name?'
tracker.Alternative.Selected("What's his name?", "Ivan", tracker.Alternative.AlternativeType.Question);

// The player unlocked 'Combat Mode' for the menu 'Menues/Start'
tracker.Alternative.Unlocked("Menues/Start", "Combat Mode", tracker.Alternative.AlternativeType.Menu);
```

##### Game Object

Usage example for the tracking the player's with a NPC villager and using a health potion (item):

```js
// Game Object
// The player interacted with a Non Playable Character
tracker.GameObject.Interacted("NPC/Villager", tracker.GameObject.GameObjectType.Npc);

// The player used a health potion
tracker.GameObject.Used("Item/HealthPotion/Consumable", tracker.GameObject.GameObjectType.Item);
```

Note that in order to track other type of user interactions it is required to perform a previous analysis to identify the most suitable game objects ([Completable](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/CompletableTracker.cs), [Accessible](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/AccessibleTracker.cs), [Alternative](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/AlternativeTracker.cs), [GameObject](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/GameObjectTracker.cs)) for the given case. For instance, in order to track conversations [alternatives](https://github.com/e-ucm/csharp-tracker/blob/3c56f43a53e69c10b031887419113ac2817afd96/TrackerAsset/Interfaces/AlternativeTracker.cs) are the best choice.

### Tracker and Collector Flow
If the storage type is `net`, the tracker will try to connect to a `Collector` [endpoint](https://github.com/e-ucm/rage-analytics/wiki/Back-end-collector), exposed by the [rage-analytics Backend](https://github.com/e-ucm/rage-analytics-backend). 

More information about the tracker can be found in the [official documentation of rage-analytics](https://github.com/e-ucm/rage-analytics/wiki/Tracker).
