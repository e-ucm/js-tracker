import crypto from "crypto";

export default class PkceGenerator {
    // Function to generate a random string of the specified length
    generateRandomString(length) {
        if (typeof window !== 'undefined' && window.location) {
            const array = new Uint32Array(length / 2);
            window.crypto.getRandomValues(array);
            return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
        } else {
            return crypto.randomBytes(Math.ceil(length / 2))
                .toString('hex') // Convert to hexadecimal
                .slice(0, length); // Return required length
        }
    }
  
    // Function to encode data using Base64 URL encoding
    base64UrlEncode(str) {
      return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, ''); // Remove padding
    }
  
    // Function to compute SHA-256 hash of a string
    sha256(message) {
      const encoder = new TextEncoder();
      return crypto.subtle.digest('SHA-256', encoder.encode(message));
    }
  
    // Function to generate the PKCE challenge
    async generatePkceChallenge() {
        const codeVerifier = this.generateRandomString(128); // Generate a random code verifier
        var codeChallenge;
        if (typeof window !== 'undefined' && window.location) {
            const hashBuffer = await this.sha256(codeVerifier); // Hash the code verifier
            codeChallenge = this.base64UrlEncode(hashBuffer); // Base64 URL encode the hash      
        } else {
            const hash = crypto.createHash('sha256'); // Create a SHA-256 hash
            hash.update(codeVerifier); // Update hash with the code verifier
            codeChallenge = hash.digest('base64url'); // Base64 URL encode the hash
        }  
        return { codeVerifier, codeChallenge };
    }
}