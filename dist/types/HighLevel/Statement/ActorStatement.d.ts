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
    constructor(options?: any);
    objectType: any;
    name: any;
    mbox: any;
    mbox_sha1sum: any;
    openid: any;
    account: any;
    member: any;
    /**
     * Convert to xAPI Agent or Group object
     * @returns {Object}
     */
    toXAPI(): any;
    /**
     * Convert to CSV (uses name or account name)
     * @returns {String}
     */
    toCSV(): string;
}
