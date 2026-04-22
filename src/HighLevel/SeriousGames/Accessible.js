import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import { SERIOUSGAMESPROFILE } from "../Statement/Ids/Profiles/Generated/SeriousGamesProfile.js";
import { ALL } from "../Statement/Ids/Profiles/Generated/All.js";
import StatementBuilder from "../StatementBuilder/StatementBuilder.js";

/**
 * Accessible Tracker
 */
export class AccessibleTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {string} type the type of the accessible object
     */
    constructor(tracker, id, type=ALL.ACTIVITYTYPES.AREA) {
        this.AccessibleId=id;
        this.Type=type;
        this.Tracker = tracker;
    }
    /**
     * the id of the accessible object
     * @type {string}
     */
    AccessibleId;
    /**
     * the type of the accessible object
     * @type {string}
     */
    Type;
    /**
     * the tracker of the accessible object
     * @type {xAPITrackerAsset}
     */
    Tracker;

    /**
     * Send Accessed statement
     * @returns {StatementBuilder}
     */
    accessed() {
        return this.Tracker.trace(SERIOUSGAMESPROFILE.VERBS.ACCESSED,this.Type,this.AccessibleId);
    }

    /**
     * Send Skipped statement
     * @returns {StatementBuilder}
     */
    skipped() {
        return this.Tracker.trace(ALL.VERBS.SKIPPED,this.Type,this.AccessibleId);
    }
}