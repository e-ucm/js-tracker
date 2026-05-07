/**
 * xAPI Attachment object (5.2.2.6)
 */
export default class AttachmentStatement {
    /**
     * Creates an AttachmentStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} [baseURI]
     * @returns {AttachmentStatement}
     */
    static fromXAPI(xapiObj: any, baseURI?: string): AttachmentStatement;
    /**
     * @param {string} usageType - IRI that identifies attachment usage
     * @param {Object<string,string>} display - Language map title
     * @param {string} contentType - Internet media type
     * @param {number} length - Content length in octets
     * @param {string} sha2 - SHA-2 hash of content
     * @param {string} [defaultURI] - Base URI used if usageType is not absolute
     */
    constructor(usageType: string, display: {
        [x: string]: string;
    }, contentType: string, length: number, sha2: string, defaultURI?: string);
    /** @type {string} */
    defaultURI: string;
    /** @type {string|null} */
    usageType: string | null;
    /** @type {Object<string,string>} */
    display: {
        [x: string]: string;
    };
    /** @type {string|undefined} */
    contentType: string | undefined;
    /** @type {number|undefined} */
    length: number | undefined;
    /** @type {string|undefined} */
    sha2: string | undefined;
    /** @type {Object<string,string>|undefined} */
    description: {
        [x: string]: string;
    } | undefined;
    /** @type {string|undefined} */
    fileUrl: string | undefined;
    /**
     * Sets the attachment description language map
     * @param {Object<string,string>} description
     * @returns {AttachmentStatement}
     */
    setDescription(description: {
        [x: string]: string;
    }): AttachmentStatement;
    /**
     * Sets file URL where the attachment can be fetched
     * @param {string} fileUrl - IRL/URL of the attachment
     * @returns {AttachmentStatement}
     */
    setFileUrl(fileUrl: string): AttachmentStatement;
    /**
     * Validate required xAPI attachment fields
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Serialize attachment to xAPI object
     * @returns {Object}
     */
    toXAPI(): any;
}
