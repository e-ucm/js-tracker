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
        this.name = options.name;
        this.mbox = options.mbox;
        this.mbox_sha1sum = options.mbox_sha1sum;
        this.openid = options.openid;
        this.account = options.account;
        this.member = options.member;
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