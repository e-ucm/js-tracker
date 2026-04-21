/**
 * Actor Class of a Statement (xAPI Agent or Group)
 */
export default class ActorStatement {
    /**
     * Create an Agent or Group
     * @param {Object} options
     *  - objectType: "Agent" | "Group" (default: "Agent")
     *  - name: string (optional)
     *  - mbox: string (optional, mailto:...)
     *  - mbox_sha1sum: string (optional)
     *  - openid: string (optional)
     *  - account: { homePage: string, name: string } (optional)
     *  - member: ActorStatement[] (for Group)
     */
    constructor(options = {}) {
        this.objectType = options.objectType || "Agent";
        for (const key of ["name", "mbox", "mbox_sha1sum", "openid", "account", "member"]) {
            this.setActor(key, options[key]);
        }
    }

    /**
     * Set actor properties with validation
     * @param {String} type - one of name, mbox, mbox_sha1sum, openid, account, member
     * @param {Object|Array|String} actorData - data for the specified type
     */
    setActor(type, actorData) {
        switch (type) {
            case "name":
                if (this.objectType === "Agent") {
                    throw new Error("Agent cannot have a name, only mbox, mbox_sha1sum, openid, or account");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Group name must be a string");
                }
                this.name = actorData;
                break;
            case "mbox":
                if (this.objectType === "Group") {
                    throw new Error("Group cannot have mbox, mbox_sha1sum, openid, or account, only a name");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Agent mbox must be a string");
                }

                this.mbox = actorData;
                break;
            case "mbox_sha1sum":
                if (this.objectType === "Group") {
                    throw new Error("Group cannot have mbox_sha1sum");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Agent mbox_sha1sum must be a string");
                }
                this.mbox_sha1sum = actorData;
                break;
            case "openid":
                if (this.objectType === "Group") {
                    throw new Error("Group cannot have openid");
                }
                if (typeof actorData !== "string") {
                    throw new Error("Agent openid must be a string");
                }
                this.openid = actorData;
                break;
            case "account":
                if  (this.objectType === "Group") {
                    throw new Error("Group cannot have account");
                }
                if (typeof actorData !== "object" || typeof actorData.homePage !== "string" || typeof actorData.name !== "string") {
                    throw new Error("Agent account must be an object with homePage and name strings");
                }
                this.account = actorData;
                break;
            case "member":
                if (this.objectType !== "Group") {
                    throw new Error("Only Group can have members");
                }
                if (!Array.isArray(actorData)) {
                    throw new Error("Group members must be an array");
                }
                this.member = actorData.map(m => m instanceof ActorStatement ? m : new ActorStatement(m));
                break;
            default:
                throw new Error(`Unsupported actor type: ${type}`);
        }
    }

    /**
     * Create an ActorStatement from xAPI Agent or Group object
     * @param {Object} xapiObj
     * @returns {ActorStatement}
     */
    static fromXAPI(xapiObj) {
        if (!xapiObj) return null;
        const options = {
            name: xapiObj.name,
            mbox: xapiObj.mbox,
            mbox_sha1sum: xapiObj.mbox_sha1sum,
            openid: xapiObj.openid,
            account: xapiObj.account,
            member: Array.isArray(xapiObj.member) ? xapiObj.member.map(m => ActorStatement.fromXAPI(m)) : undefined
        };
        return new ActorStatement(options);
    }

    /**
     * Convert to xAPI Agent or Group object
     * @returns {Object}
     */
    toXAPI() {
        const obj = { objectType: this.objectType };
        if (this.name) obj.name = this.name;
        // Agent or Identified Group: one of mbox, mbox_sha1sum, openid, account
        if (this.mbox) obj.mbox = this.mbox;
        else if (this.mbox_sha1sum) obj.mbox_sha1sum = this.mbox_sha1sum;
        else if (this.openid) obj.openid = this.openid;
        else if (this.account) obj.account = this.account;
        // Group: add member if present
        if (this.objectType === "Group" && Array.isArray(this.member)) {
            obj.member = this.member.map(m => (typeof m.toXAPI === 'function' ? m.toXAPI() : m));
        }
        return obj;
    }

    /**
     * Convert to CSV (uses name or account name)
     * @returns {String}
     */
    toCSV() {
        if (this.name) return this.name.replaceAll(',', '\\,');
        if (this.account && this.account.name) return this.account.name.replaceAll(',', '\\,');
        if (this.mbox) return this.mbox.replaceAll(',', '\\,');
        return '';
    }
}