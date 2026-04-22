import { isUri, setAsUri } from "./helper.js";

/**
 * xAPI Attachment object (5.2.2.6)
 */
export default class AttachmentStatement {
    /**
     * @param {string} usageType - IRI that identifies attachment usage
     * @param {Object<string,string>} display - Language map title
     * @param {string} contentType - Internet media type
     * @param {number} length - Content length in octets
     * @param {string} sha2 - SHA-2 hash of content
     * @param {string} [defaultURI] - Base URI used if usageType is not absolute
     */
    constructor(usageType, display, contentType, length, sha2, defaultURI = "") {
        this.defaultURI = defaultURI;
        this.usageType = usageType ? setAsUri(usageType, defaultURI) : null;
        this.display = display || {};
        this.contentType = contentType;
        this.length = length;
        this.sha2 = sha2;
    }

    /** @type {string|null} */
    usageType;

    /** @type {Object<string,string>} */
    display;

    /** @type {Object<string,string>|undefined} */
    description;

    /** @type {string|undefined} */
    contentType;

    /** @type {number|undefined} */
    length;

    /** @type {string|undefined} */
    sha2;

    /** @type {string|undefined} */
    fileUrl;

    /** @type {string} */
    defaultURI;

    /**
     * Sets the attachment description language map
     * @param {Object<string,string>} description
     * @returns {AttachmentStatement}
     */
    setDescription(description) {
        this.description = description;
        return this;
    }

    /**
     * Sets file URL where the attachment can be fetched
     * @param {string} fileUrl - IRL/URL of the attachment
     * @returns {AttachmentStatement}
     */
    setFileUrl(fileUrl) {
        if (fileUrl) {
            this.fileUrl = isUri(fileUrl) ? fileUrl : setAsUri(fileUrl, this.defaultURI);
        }
        return this;
    }

    /**
     * Validate required xAPI attachment fields
     * @returns {boolean}
     */
    isValid() {
        return Boolean(
            this.usageType &&
            this.display &&
            Object.keys(this.display).length > 0 &&
            this.contentType &&
            Number.isInteger(this.length) &&
            this.length >= 0 &&
            this.sha2
        );
    }

    /**
     * Serialize attachment to xAPI object
     * @returns {Object}
     */
    toXAPI() {
        const xapi = {
            usageType: this.usageType,
            display: this.display,
            contentType: this.contentType,
            length: this.length,
            sha2: this.sha2
        };
        if (this.description && Object.keys(this.description).length > 0) {
            xapi.description = this.description;
        }
        if (this.fileUrl) {
            xapi.fileUrl = this.fileUrl;
        }
        return xapi;
    }

    /**
     * Creates an AttachmentStatement from xAPI object
     * @param {Object} xapiObj
     * @param {string} [baseURI]
     * @returns {AttachmentStatement}
     */
    static fromXAPI(xapiObj, baseURI = "") {
        const attachment = new AttachmentStatement(
            xapiObj.usageType,
            xapiObj.display,
            xapiObj.contentType,
            xapiObj.length,
            xapiObj.sha2,
            baseURI
        );
        if (xapiObj.description) {
            attachment.setDescription(xapiObj.description);
        }
        if (xapiObj.fileUrl) {
            attachment.setFileUrl(xapiObj.fileUrl);
        }
        return attachment;
    }
}