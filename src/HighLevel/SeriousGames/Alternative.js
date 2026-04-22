import xAPITrackerAsset from "../../xAPITrackerAsset.js";
import { SERIOUSGAMEPROFILE } from "../Statement/Ids/Profiles/SeriousGameProfile.js";
import { SERIOUSGAMESPROFILE } from "../Statement/Ids/Profiles/Generated/SeriousGamesProfile.js";
import { ALL } from "../Statement/Ids/Profiles/Generated/All.js";
import StatementBuilder from "../StatementBuilder/StatementBuilder.js";
/**
 * Accessible Tracker
 */
export class AlternativeTracker {
    /**
     * Constructor of accessible tracker
     * @param {xAPITrackerAsset} tracker the tracker
     * @param {string} id the id of the accessible object
     * @param {string} type the type of the accessible object
     */
    constructor(tracker, id, type=SERIOUSGAMEPROFILE.ACTIVITYTYPES.ALTERNATIVE) {
        this.AlternativeId=id;
        this.Type=type;
        this.Tracker = tracker;
    }
    /**
     * the id of the alternative object
     * @type {string}
     */
    AlternativeId;
    /**
     * the type of the alternative object
     * @type {string}
     */
    Type;
    /**
     * the tracker of the alternative object
     * @type {xAPITrackerAsset}
     */
    Tracker;

    /**
     * Send selected statement
     * @param {string} optionId the optionId of the selected statement
     * @returns {StatementBuilder}
     */
    selected(optionId) {        
        return this.Tracker.trace(ALL.VERBS.SELECTED,this.Type,this.AlternativeId)
            .withResponse(optionId);
    }

    /**
     * Send unlocked statement
     * @param {string} optionId the optionId of the Unlocked statement
     * @returns {StatementBuilder}
     */
    unlocked(optionId) {
        return this.Tracker.trace(SERIOUSGAMESPROFILE.VERBS.UNLOCKED,this.Type,this.AlternativeId)
                .withResponse(optionId);
    }
}

/**
 * the list of types possible for the alternative object
 */
export const ALTERNATIVETYPE = Object.freeze({
    QUESTION: 0,
    MENU: 1,
    DIALOG: 2,
    PATH: 3,
    ARENA: 4,
    ALTERNATIVE: 5
});