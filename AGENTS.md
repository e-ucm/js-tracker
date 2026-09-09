# js-tracker Agent Guidelines

## Project Overview
This is a JavaScript xAPI tracker for serious games analytics. It helps track player interactions and analytics for games by sending statements to a Learning Record Store (LRS).

## Core Classes
- `JSTracker` - Base tracker class with authentication and core functionality
- `SeriousGameTracker` - Extends JSTracker with game-specific tracking methods
- `JSScormTracker` - SCORM-specific tracker
- `LRSTracker` - LRS-specific tracker with query capabilities

## Key Usage Patterns

### 1. Basic Tracker Setup
```javascript
const tracker = new SeriousGameTracker();
tracker.trackerSettings.batch_endpoint = "https://your-lrs-endpoint.com";
tracker.trackerSettings.platform = "https://your-game.com";
tracker.trackerSettings.actor_name = "player123";
await tracker.login();
tracker.start();
```

### 2. Tracking Game Objects
```javascript
// Completable objects (quests, levels, etc.)
tracker.completable("quest123", tracker.SERIOUSGAMEPROFILE.ACTIVITYTYPES.Quest)
  .initialized()
  .send();

// Accessible objects (screens, areas, etc.)
tracker.accessible("MainMenu", tracker.SERIOUSGAMEPROFILE.ACTIVITYTYPES.SCREEN)
  .accessed()
  .send();

// Alternative objects (questions, menus, etc.)
tracker.alternative("question1", tracker.ALL.ACTIVITYTYPES.ASSESSMENT)
  .selected("optionB")
  .send();

// Game objects (items, NPCs, etc.)
tracker.gameObject("healthPotion", tracker.SERIOUSGAMEPROFILE.ACTIVITYTYPES.ITEM)
  .used()
  .send();
```

### 3. Authentication
- OAuth0: Direct token authentication
- OAuth1: Basic username/password authentication
- OAuth2: Token-based authentication with grant types

#### OAuth2 Device Mode (`urn:ietf:params:oauth:grant-type:device_code`)
- `login()` requests a device code, then attempts to auto-open the `verification_uri_complete` in a new browser tab.
- Because the flow runs asynchronously (after `await fetch`), browsers may block the popup. The `onDeviceAuthorizationInfo` callback on `xAPITrackerAssetOAuth2` receives a payload that includes `user_code`, `verification_uri`, `verification_uri_complete`, and a `popupBlocked` boolean.
- Host games should render a manual fallback (e.g. a button that opens `verification_uri_complete` from a real click gesture) whenever `popupBlocked` is `true`.
- `getUsername()` decodes `preferred_username` from the access token JWT.

## Build and Test Commands
- `npm run build` - Build the project (webpack + types)
- `npm run test` - Run linting and tests
- `npm run lint` - Run linting only
- `npm run build:types` - Build TypeScript definitions
- `npm run build:webpack` - Build webpack bundles only

## Important Files
- `src/js-tracker.js` - Main entry point with all tracker classes
- `src/HighLevel/SeriousGames/*` - Game-specific tracking components
- `src/HighLevel/Scorm/*` - SCORM tracking components
- `src/HighLevel/StatementBuilder/*` - Statement building components
- `src/Auth/*` - Authentication components

## Key Constants
- `SERIOUSGAMESPROFILE.ACTIVITYTYPES` - Game object types
- `ALL.ACTIVITYTYPES` - Generic activity types
- `SCORMPROFILE.ACTIVITYTYPES` - SCORM activity types