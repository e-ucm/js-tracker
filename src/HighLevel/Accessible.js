const xAPITrackerAsset = require("../xAPITrackerAsset.js");
const Statement = require("./Statement/Statement.js");

class AccessibleTracker {
    /**
     * @param {xAPITrackerAsset} tracker
     */
    constructor(tracker) {
        this.tracker = tracker;
    }
    
    /**
     * @type {xAPITrackerAsset}
     */
    tracker;

    AccessibleType = ['screen', 'area', 'zone', 'cutscene', 'accessible']

    /**
     * @param {string} accessibleId
     * @param {number} type
     * @returns {Statement}
     * 
     */
    Accessed(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('accessed',this.AccessibleType[type],accessibleId);
        return statement;
    }

    /**
     * @param {string} accessibleId
     * @param {number} type
     * @returns {Statement}
     * 
     */
    Skipped(accessibleId, type) {
        if (typeof type === 'undefined') {type = 4;}

        var statement = this.tracker.Trace('skipped',this.AccessibleType[type],accessibleId);
        return statement;
    }
    
    /**
     * @param {Statement} statement
     * 
     */
    async enqueue(statement) {
        await this.tracker.enqueue(statement);
    }
}

const ACCESSIBLETYPE = Object.freeze({
    SCREEN: 0,
    AREA: 1,
    ZONE: 2,
    CUTSCENE: 3,
    ACCESSIBLE: 4
});

module.exports = { AccessibleTracker, ACCESSIBLETYPE };