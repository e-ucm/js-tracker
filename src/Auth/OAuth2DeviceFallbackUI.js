/**
 * Default fallback UI for OAuth2 Device Authorization Flow.
 * Renders a modal overlay with the user code and a button to open the
 * verification URL when the browser blocks the automatic popup.
 *
 * Designed for game host applications: lightweight, no dependencies,
 * injects its own styles, and removes itself once the token is obtained.
 */

const STYLE_ID = 'xapi-oauth2-device-fallback-style';

const CSS = `
#${STYLE_ID} {}
#xapi-device-fallback-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}
#xapi-device-fallback-overlay .xapi-device-card {
  background: #fff;
  border-radius: 12px;
  padding: 32px 40px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
}
#xapi-device-fallback-overlay .xapi-device-card h2 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #222;
}
#xapi-device-fallback-overlay .xapi-device-card p {
  margin: 4px 0;
  font-size: 14px;
  color: #555;
}
#xapi-device-fallback-overlay .xapi-device-card .xapi-device-code {
  display: inline-block;
  margin: 16px 0;
  padding: 12px 24px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #1a1a2e;
  background: #f0f0f5;
  border: 2px dashed #999;
  border-radius: 8px;
  user-select: all;
  cursor: pointer;
}
#xapi-device-fallback-overlay .xapi-device-card .xapi-device-code:hover {
  background: #e8e8f0;
}
#xapi-device-fallback-overlay .xapi-device-card .xapi-device-url {
  display: block;
  margin: 8px 0 20px;
  font-size: 13px;
  color: #0066cc;
  word-break: break-all;
}
#xapi-device-fallback-overlay .xapi-device-card button.xapi-device-btn {
  display: inline-block;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: #0066cc;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
#xapi-device-fallback-overlay .xapi-device-card button.xapi-device-btn:hover {
  background: #0052a3;
}
#xapi-device-fallback-overlay .xapi-device-card button.xapi-device-btn:active {
  background: #003d7a;
}
#xapi-device-fallback-overlay .xapi-device-card .xapi-device-close {
  display: block;
  margin: 12px auto 0;
  padding: 4px 8px;
  font-size: 12px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
}
#xapi-device-fallback-overlay .xapi-device-card .xapi-device-close:hover {
  color: #333;
}
#xapi-device-fallback-overlay .xapi-device-card .xapi-device-expiry {
  margin-top: 12px;
  font-size: 12px;
  color: #999;
}
`;

function injectStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
}

function removeStyles() {
    if (typeof document === 'undefined') return;
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
}

/**
 * Shows the device authorization fallback UI.
 *
 * @param {object} info - The device authorization info object
 * @param {string} info.user_code - The code the user must enter
 * @param {string} info.verification_uri - Base verification URL
 * @param {string} [info.verification_uri_complete] - Full verification URL with code pre-filled
 * @param {number} [info.expires_in] - Seconds until the device code expires
 * @returns {{ dismiss: () => void }} Handle to programmatically dismiss the overlay
 */
export function showDeviceFallbackUI(info) {
    if (typeof document === 'undefined') {
        console.warn('[OAuth2Device] Cannot show fallback UI: not in a browser environment.');
        return { dismiss() {} };
    }

    injectStyles();

    const verificationUrl = info.verification_uri_complete || info.verification_uri;

    const overlay = document.createElement('div');
    overlay.id = 'xapi-device-fallback-overlay';

    let expiryText = '';
    if (info.expires_in && info.expires_in > 0) {
        const mins = Math.floor(info.expires_in / 60);
        const secs = info.expires_in % 60;
        expiryText = mins > 0
            ? 'Code expires in ' + mins + 'm ' + secs + 's'
            : 'Code expires in ' + secs + 's';
    }

    overlay.innerHTML = `
      <div class="xapi-device-card">
        <h2>Sign In</h2>
        <p>Open the link below on another device and enter this code:</p>
        <div class="xapi-device-code" title="Click to select">${escapeHtml(info.user_code)}</div>
        <a class="xapi-device-url" href="${escapeHtml(verificationUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(verificationUrl)}</a>
        <button class="xapi-device-btn" type="button">Open Verification Page</button>
        ${expiryText ? '<div class="xapi-device-expiry">' + escapeHtml(expiryText) + '</div>' : ''}
        <button class="xapi-device-close" type="button">Close</button>
      </div>
    `;

    const btn = overlay.querySelector('.xapi-device-btn');
    btn.addEventListener('click', function () {
        window.open(verificationUrl, '_blank', 'noopener,noreferrer');
    });

    const closeBtn = overlay.querySelector('.xapi-device-close');
    closeBtn.addEventListener('click', function () {
        dismiss();
    });

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            dismiss();
        }
    });

    function dismiss() {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
        if (!document.getElementById('xapi-device-fallback-overlay')) {
            removeStyles();
        }
    }

    document.body.appendChild(overlay);

    return { dismiss };
}

function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

export default { showDeviceFallbackUI };
