/**
 * Shows the device authorization fallback UI.
 * If the UI is already shown (e.g. a new device code was pulled after
 * the previous one expired), it updates the existing overlay in place.
 *
 * @param {object} info - The device authorization info object
 * @param {string} info.user_code - The code the user must enter
 * @param {string} info.verification_uri - Base verification URL
 * @param {string} [info.verification_uri_complete] - Full verification URL with code pre-filled
 * @param {number} [info.expires_in] - Seconds until the device code expires
 * @returns {{ dismiss: () => void }} Handle to programmatically dismiss the overlay
 */
export function showDeviceFallbackUI(info: {
    user_code: string;
    verification_uri: string;
    verification_uri_complete?: string;
    expires_in?: number;
}): {
    dismiss: () => void;
};
declare namespace _default {
    export { showDeviceFallbackUI };
}
export default _default;
