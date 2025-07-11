[![Build Status](https://travis-ci.org/e-ucm/js-tracker.svg?branch=master)](https://travis-ci.org/e-ucm/js-tracker) [![Coverage Status](https://coveralls.io/repos/e-ucm/js-tracker/badge.svg?branch=master&service=github)](https://coveralls.io/github/e-ucm/js-tracker?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/8332c331fee826d6ed36/maintainability)](https://codeclimate.com/github/e-ucm/js-tracker/maintainability) [![Dependency Status](https://david-dm.org/e-ucm/js-tracker.svg)](https://david-dm.org/e-ucm/js-tracker) [![devDependency Status](https://david-dm.org/e-ucm/js-tracker/dev-status.svg)](https://david-dm.org/e-ucm/js-tracker#info=devDependencies) [![Pull Request Stats](http://issuestats.com/github/e-ucm/js-tracker/badge/pr?style=flat)](http://issuestats.com/github/e-ucm/js-tracker) [![Issue Stats](http://issuestats.com/github/e-ucm/js-tracker/badge/issue?style=flat)](http://issuestats.com/github/e-ucm/js-tracker)


# JavaScript tracker

This code belongs to e-UCM research group and has been developed for the H2020 BEACONING Project and sends analytics information to a server; or, if the server is currently unavailable, stores them locally until it becomes available again.

![Beaconing logo](http://beaconing.eu/wp-content/themes/beaconing/images/logo/original_version_(black).png)

After a game is developed, a common need is to know how the players play, what interactions they follow within the game and how much time they spend in a game session; collectively, these are known as game analytics. Analytics are used to locate gameplay bottlenecks and assess game effectiveness and learning outcomes, among other tasks.

## Installation
1. Obtain bundle library
    * Download files from Release
    * Clone or download repository and obtain them from /dist/
1. Copy into your project folder
1. Include library using, for example, `<script type="text/javascript" src="js-tracker-webpack.bundle.js"></script>>`
1. Configure the tracker by:
```js
var tracker = new SeriousGameTracker();

tracker.trackerSettings.activity_id="https://myendpoint.com/activities/activityId";
tracker.trackerSettings.generateSettingsFromURLParams=false;
tracker.trackerSettings.batch_endpoint = "https://myendpoint.com";
tracker.trackerSettings.actor_homePage = "https://myhomepage.com";
tracker.trackerSettings.actor_name = "username";
```
or 
```js
var tracker = new SeriousGameTracker();

tracker.trackerSettings.activity_id="https://myendpoint.com/activities/activityId";
tracker.trackerSettings.generateSettingsFromURLParams=true;
tracker.trackerSettings.default_uri="mygame";
```
Here is the complete list of configuration options for a JavaScript tracker:

**Tracker Configuration**

* **generateSettingsFromURLParams**: boolean (default: `false`)
	+ Generate settings from URL parameters.
* **oauth_type**: string (default: `OAuth0`)
	+ OAuth type (0, 1 or 2).
* **batch_mode**: boolean (default: `true`)
	+ Enable batch mode for sending data to the tracker.
* **batch_endpoint**: string (default: `null`)
	+ Endpoint for sending batch data to the tracker.
* **batch_length**: integer (default: `100`)
	+ Maximum number of traces stored in the tracker queue.
* **batch_timeout**: integer (default: `30000`) // 30 seconds
	+ Timeout for sending batch data to the tracker.
* **actor_homePage**: string (default: ``)
	+ Homepage URL for the actor.
* **actor_name**: string (default: `mydefaultactor`)
	+ Name of the actor.
* **backup_mode**: boolean (default: `false`)
	+ Enable backup mode for sending data to the tracker.
* **backup_endpoint**: string (default: `null`)
	+ Endpoint for sending backup data to the tracker.
* **backup_type**: string (default: `null`)
	+ Type of backup data to send to the tracker.
* **default_uri**: string (default: `null`)
	+ Default URI for the tracker.
* **max_retry_delay**: integer (default: `5000`) // 5 seconds
	+ Maximum retry delay for sending data to the tracker.

**OAuth1 Configuration**

* **tracker.oauth1.username**: string (default: `username`)
	+ Username for OAuth1 authentication.
* **tracker.oauth1.password**: string (default: `supersecret`)
	+ Password for OAuth1 authentication.

**OAuth2 Configuration**

* **tracker.oauth2.token_endpoint**: string (default: `null`)
	+ Token endpoint for OAuth2 authentication.
* **tracker.oauth2.grant_type**: string (default: `null`)
	+ Grant type for OAuth2 authentication.
* **tracker.oauth2.client_id**: string (default: `null`)
	+ Client ID for OAuth2 authentication.
* **tracker.oauth2.scope**: string (default: `null`)
	+ Scope for OAuth2 authentication.
* **tracker.oauth2.state**: string (default: `null`)
	+ State for OAuth2 authentication.
* **tracker.oauth2.code_challenge_method**: string (default: `null`)
	+ Code challenge method for OAuth2 authentication.
* **tracker.oauth2.username**: string (default: `username`)
	+ Username for OAuth2 authentication.
* **tracker.oauth2.password**: string (default: `supersecret`)
	+ Password for OAuth2 authentication.
* **tracker.oauth2.login_hint**: string (default: `null`)
	+ Login hint for OAuth2 authentication.

**Debug Configuration**

* **debug**: boolean (default: `false`)
	+ Enable debug mode to see tracker messages in the Unity console.

1. **Optional** Login the user configured by using `tracker.login()`
1. Start the tracker by using `tracker.start()`
1. Send traces

## Integration example

An example test app can be found [here](https://github.com/e-ucm/js-tracker/blob/master/test_app.html).

### Tracker Login and Start

For tracker to send traces to the server, `tracker.login()` has to be called. If you want to use an authenticated user, you can login before starting the tracker with `tracker.start()`.

```js
var tracker = new SeriousGameTracker();

tracker.trackerSettings.batch_endpoint = "https://myendpoint.com/";
tracker.trackerSettings.oauth_type = "OAuth1";
tracker.oauth1.username = "username";
tracker.oauth1.password = "password";

//Login is optional. If not logged, anonymous actor is retrieved on start
tracker.login();
tracker.start();
```

### Sending Traces to the Learning Record Store (LRS) Server

There are two methods used for sending traces that generate for you StatementBuilder that you can extend:
1. Using the xAPI for serious games interfaces (accessible(), alternative(), completable() and gameObject()).
1. Using `tracker.trace(verb,objectType,objectId)` method. This is **not recomended unless you have clear in mind what you're doing**. Remember that xAPI traces are focused on sending actions, not purely variable changes. If you want to track variables, you can add them as extensions using `.withResultExtension(key, val)`.

To extend yours statements, you can extend the StatementBuilder using : 
* `.withSuccess(bool success)` : Set success to statemement
* `.withScore({raw:number, min:number, max:number, scaled:number})` : Set score to statemement
* `.withRawScore(double score)` : Set raw score to statemement
* `.withMinScore(double score)` : Set min score to statemement
* `.withMaxScore(double score)` : Set max score to statemement
* `.withScaledScore(double score)` : Set scaled score to statemement
* `.withCompletion(bool completion)` : Set completion status to statement
* `.withDuration(Date init, Date end)` : Set duration to statement
* `.withResponse(string response)` : Set response to statement
* `.withProgress(double progress)` : Set progress to statement
* `.withResultExtension(key, val)` : Add result extension to statement
* `.withResultExtensions(exts = {})` : Add result extensions as Object key/values list of the statement
* `.apply(function fn)` : Applies a function to the statement

The statements are not sent until you enqueue it using `.send()` to the StatementBuilder.

```js
//simple trace
tracker.gameObject("GameObjectID2", tracker.GAMEOBJECTTYPE.Item)
      .used()
      .withResultExtension("extension1", "value1")
	  .send();

//Very complex trace
tracker.accessible("AccesibleID2", tracker.ACCESSIBLETYPE.Screen)
      .skipped()
      .withResponse("AnotherResponse")
      .withScore(123.456)
      .withSuccess(false)
      .withCompletion(true)
      .withResultExtension("extension1", "value1")
      .withResultExtension("extension2", "value2")
      .withResultExtension("extension3", 3)
      .withResultExtension("extension4", 4.56)
	  .send();

tracker.trace("selected", "zone", "ObjectID3")
	  .send();

tracker.flush();
```

### Trace sending automatization

As in JavaScript is a language very oriented to Async programming, there are multiple alternatives to generate an automatic loop for sending traces automatically. For example, you can create a loop like:
```js

setInterval(function(){
	if(connected)
		tracker.flush(function(result, error){
			console.log("flushed");
		})
}, 3000);
```

## User Guide

The tracker send your generated data to a Learning Record Store (LRS) Server API designed to collect, analyze and visualize the data. It consists on defining a set of **game objects**. A game object represents an element of the game on which players can perform one or several types of interactions. Some examples of player's interactions are:

* start or complete (interaction) a level (game object)
* increase or decrease (interaction) the number of coins (game object)
* select or unlock (interaction) a power-up (game object)

A **gameplay** is the flow of interactions that a player performs over these game objects in a sequential order.

The main typed of game objects supported are:

* [Completable](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-progress) - for Game, Session, Level, Quest, Stage, Combat, StoryNode, Race or any other generic Completable. Methods: `Initialized`, `Progressed` and `Completed`.
* [Accessible](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-navigation) - for Screen, Area, Zone, Cutscene or any other generic Accessible. Methods: `Accessed` and `Skipped`.
* [Alternative](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-decisions) - for Question, Menu, Dialog, Path, Arena or any other generic Alternative. Methods: `Selected` and `Unlocked`.
* [GameObject](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-game-world-interactions) for Enemy, Npc, Item or any other generic GameObject. Methods: `Interacted` and `Used`.

##### Completable

Usage example for the tracking of an in-game quest. We decided to use a completable game object for this use-case as the most suitable option:

```js
// Completable
// Initialized
tracker.completable("MyGameQuestId", tracker.COMPLETABLETYPE.Quest)
        .initialized()
	  	.send();

// Progressed
var progress = 0.8;
tracker.completable("MyGameQuestId", tracker.COMPLETABLETYPE.Quest)
        .progressed(progress)
	  	.send();

// Completed
var success = true;
var score = 0.75;
var t = tracker.completable("MyGameQuestId", tracker.COMPLETABLETYPE.Quest)
              .completed(success,score)
	  		  .send();
```

##### Accessible

Usage example for the tracking the player's movement through some in-game screens and skipping the `Intro` cutscene:

```js
// Accessible
// The player accessed the 'MainMenu' screen
tracker.accessible("MainMenu", tracker.ACCESSIBLETYPE.Screen)
        .accessed()
	    .send();

// The player skipped a cutscene
tracker.accessible("Intro", tracker.ACCESSIBLETYPE.Cutscene)
        .skipped()
		.send();
```

##### Alternative

Usage example for the tracking the player's choices during a conversation:

```js
// Alternative
// The player selected the 'Ivan' answer for the question 'What's his name?'
tracker.alternative("What's his name?", tracker.ALTERNATIVETYPE.Question)
        .selected("Ivan")
		.send();

// The player unlocked 'Combat Mode' for the menu 'Menues/Start'
tracker.alternative("Menues/Start", tracker.ALTERNATIVETYPE.Menu)
      .unlocked("Combat Mode")
	  .send();
```

##### Game Object

Usage example for the tracking the player's with a NPC villager and using a health potion (item):

```js
// Game Object
// The player interacted with a Non Playable Character
tracker.gameObject("NPC/Villager", tracker.GAMEOBJECTTYPE.Npc)
        .interacted()
		.send();

// The player used a health potion
tracker.gameObject("Item/HealthPotion/Consumable", tracker.GAMEOBJECTTYPE.Item)
        .used()
		.send();
```

Note that in order to track other type of user interactions it is required to perform a previous analysis to identify the most suitable game objects ([Completable](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-progress), [Accessible](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-navigation), [Alternative](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-decisions), [GameObject](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-game-world-interactions)) for the given case. For instance, in order to track conversations [alternatives](https://github.com/e-ucm/xapi-seriousgames/blob/master/xAPI%20Profile.md#tracking-decisions) are the best choice.
